
import { v4 as uuidv4 } from 'uuid';
import { Team, Match, Round, Tournament } from './types';

export const fisherYatesShuffle = <T,>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export const buildRound1Matches = (teams: Team[]): Match[] => {
  const shuffled = fisherYatesShuffle(teams);
  const matches: Match[] = [];
  
  for (let i = 0; i < shuffled.length; i += 2) {
    const home = shuffled[i];
    const away = shuffled[i + 1] || null;
    
    matches.push({
      id: uuidv4(),
      roundIndex: 0,
      homeTeamId: home.id,
      awayTeamId: away ? away.id : null,
      status: away ? 'pending' : 'bye',
      winnerTeamId: away ? undefined : home.id,
      homeGoals: [],
      awayGoals: [],
      homeAssists: [],
      awayAssists: [],
      homeYellowCards: [],
      awayYellowCards: [],
      homeRedCards: [],
      awayRedCards: []
    });
  }
  
  return matches;
};

export const buildNextRoundMatches = (previousRound: Round): Match[] => {
  const winners = previousRound.matches
    .map(m => m.winnerTeamId)
    .filter((id): id is string => !!id);
    
  const matches: Match[] = [];
  for (let i = 0; i < winners.length; i += 2) {
    const homeId = winners[i];
    const awayId = winners[i + 1] || null;
    
    matches.push({
      id: uuidv4(),
      roundIndex: previousRound.index + 1,
      homeTeamId: homeId,
      awayTeamId: awayId,
      status: awayId ? 'pending' : 'bye',
      winnerTeamId: awayId ? undefined : homeId,
      homeGoals: [],
      awayGoals: [],
      homeAssists: [],
      awayAssists: [],
      homeYellowCards: [],
      awayYellowCards: [],
      homeRedCards: [],
      awayRedCards: []
    });
  }
  
  return matches;
};

export interface PlayerStat {
  name: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  teamId: string;
}

export const getTournamentStats = (rounds: Round[], teams: Team[]) => {
  const allMatches = rounds.flatMap(r => r.matches).filter(m => m.status === 'finished');
  const totalMatches = allMatches.length;
  let totalGoals = 0;
  let totalCards = 0;
  
  const playerStats: Record<string, PlayerStat> = {};

  // Initialize with all players from all teams to ensure zero-stats are tracked
  teams.forEach(team => {
    team.players.forEach(p => {
      playerStats[p] = { name: p, goals: 0, assists: 0, yellowCards: 0, redCards: 0, teamId: team.id };
    });
  });

  const ensurePlayer = (p: string, teamId: string) => {
    if (!p) return null;
    if (!playerStats[p]) {
      playerStats[p] = { name: p, goals: 0, assists: 0, yellowCards: 0, redCards: 0, teamId };
    }
    return playerStats[p];
  };

  allMatches.forEach(m => {
    totalGoals += (m.scoreHome || 0) + (m.scoreAway || 0);
    
    m.homeGoals?.forEach(p => { const st = ensurePlayer(p, m.homeTeamId); if (st) st.goals++; });
    m.homeAssists?.forEach(p => { const st = ensurePlayer(p, m.homeTeamId); if (st) st.assists++; });
    m.homeYellowCards?.forEach(p => { const st = ensurePlayer(p, m.homeTeamId); if (st) { st.yellowCards++; totalCards++; } });
    m.homeRedCards?.forEach(p => { const st = ensurePlayer(p, m.homeTeamId); if (st) { st.redCards++; totalCards++; } });

    if (m.awayTeamId) {
      m.awayGoals?.forEach(p => { const st = ensurePlayer(p, m.awayTeamId!); if (st) st.goals++; });
      m.awayAssists?.forEach(p => { const st = ensurePlayer(p, m.awayTeamId!); if (st) st.assists++; });
      m.awayYellowCards?.forEach(p => { const st = ensurePlayer(p, m.awayTeamId!); if (st) { st.yellowCards++; totalCards++; } });
      m.awayRedCards?.forEach(p => { const st = ensurePlayer(p, m.awayTeamId!); if (st) { st.redCards++; totalCards++; } });
    }
  });

  const allPlayers = Object.values(playerStats);
  
  const topScorers = [...allPlayers].sort((a, b) => b.goals - a.goals || b.assists - a.assists || a.name.localeCompare(b.name));
  const topAssisters = [...allPlayers].filter(p => p.assists > 0).sort((a, b) => b.assists - a.assists || b.goals - a.goals);
  const mostCards = [...allPlayers].filter(p => p.yellowCards > 0 || p.redCards > 0).sort((a, b) => (b.redCards * 2 + b.yellowCards) - (a.redCards * 2 + a.yellowCards));

  return { totalMatches, totalGoals, totalCards, topScorers, topAssisters, mostCards, allPlayers };
};

export const formatTeamsMessage = (teams: Team[]): string => {
  let text = `🏆 *EDUKUP: TURNIR ISHTIROKCHILARI*\n\n`;
  teams.forEach((team, idx) => {
    text += `${idx + 1}. 🛡 *${team.name.toUpperCase()}*\n`;
    if (team.players.length > 0) {
      text += `   👥 Tarkib: ${team.players.join(', ')}\n`;
    }
    text += `\n`;
  });
  text += `📍 @EduCupManager orqali tayyorlandi`;
  return text.trim();
};

export const formatRoundMessage = (round: Round, teams: Team[]): string => {
  const getTeamName = (id: string | null) => teams.find(t => t.id === id)?.name || 'Nomaʼlum';
  const roundTitle = round.matches.length === 1 ? 'FINAL' : round.matches.length === 2 ? 'YARIM FINAL' : `${round.index + 1}-BOSQICH`;
  
  let text = `⚽️ *${roundTitle} NATIJALARI*\n\n`;
  
  round.matches.forEach((match, idx) => {
    const home = getTeamName(match.homeTeamId);
    if (match.awayTeamId) {
      const away = getTeamName(match.awayTeamId);
      const score = match.status === 'finished' ? `*${match.scoreHome} - ${match.scoreAway}*` : 'vs';
      text += `${idx + 1}. ${home} ${score} ${away}\n`;
      if (match.winnerTeamId) {
        text += `   ✅ G'olib: *${getTeamName(match.winnerTeamId)}*\n`;
      }
    } else {
      text += `${idx + 1}. ${home} ➔ (Keyingi bosqichga)\n`;
    }
    text += `\n`;
  });
  
  text += `📅 Sana: ${new Date().toLocaleDateString()}`;
  return text.trim();
};

export const formatChampionMessage = (teamName: string, tournamentName: string): string => {
  return `⭐⭐⭐ *TABRIKLAYMIZ* ⭐⭐⭐\n\n🏆 *${tournamentName.toUpperCase()}* g'olibi aniqlandi!\n\n🥇 CHEMPION: *${teamName.toUpperCase()}*\n\nBarcha ishtirokchilarga rahmat! 🔥🔥🔥`;
};

export const splitTelegramMessage = (text: string, maxLen: number = 3000): string[] => {
  if (text.length <= maxLen) return [text];
  const parts: string[] = [];
  let current = text;
  while (current.length > 0) {
    let splitAt = current.lastIndexOf('\n', maxLen);
    if (splitAt === -1 || splitAt < maxLen * 0.7) splitAt = maxLen;
    parts.push(current.substring(0, splitAt).trim());
    current = current.substring(splitAt).trim();
  }
  return parts;
};

export const buildTelegramShareUrl = (text: string): string => {
  return `https://t.me/share/url?text=${encodeURIComponent(text)}`;
};

export const downloadFile = (content: string, fileName: string, contentType: string) => {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
};

export const exportToJSON = (data: any, fileName: string) => {
  const jsonString = JSON.stringify(data, null, 2);
  downloadFile(jsonString, `${fileName}.json`, 'application/json');
};

export const formatTournamentSummary = (tournament: Tournament, teams: Team[], rounds: Round[]): string => {
  const getTeamName = (id: string | null) => teams.find(t => t.id === id)?.name || 'N/A';
  const { totalGoals, totalMatches, topScorers } = getTournamentStats(rounds, teams);

  let summary = `========================================\n`;
  summary += `  TOURNAMENT REPORT: ${tournament.name.toUpperCase()}\n`;
  summary += `========================================\n\n`;
  summary += `Created at: ${new Date(tournament.createdAt).toLocaleString()}\n`;
  summary += `Format: ${tournament.playersPerTeam} vs ${tournament.playersPerTeam}\n\n`;
  
  summary += `STATISTICS:\n`;
  summary += `- Total Matches: ${totalMatches}\n`;
  summary += `- Total Goals: ${totalGoals}\n`;
  if (topScorers.length > 0) {
    summary += `- Top Scorer: ${topScorers[0].name} (${topScorers[0].goals} goals)\n`;
  }
  
  if (tournament.championTeamId) {
    summary += `\nWINNER: ${getTeamName(tournament.championTeamId).toUpperCase()}\n`;
  }
  
  summary += `\nTEAMS (${teams.length}):\n`;
  teams.forEach(t => {
    summary += `- ${t.name} (${t.players.join(', ')})\n`;
  });
  
  summary += `\nROUNDS AND RESULTS:\n`;
  rounds.forEach(r => {
    const title = r.matches.length === 1 ? 'FINAL' : r.matches.length === 2 ? 'SEMI-FINAL' : `ROUND ${r.index + 1}`;
    summary += `\n[ ${title} ]\n`;
    r.matches.forEach(m => {
      const home = getTeamName(m.homeTeamId);
      if (m.awayTeamId) {
        const away = getTeamName(m.awayTeamId);
        const score = m.status === 'finished' ? `${m.scoreHome} - ${m.scoreAway}` : 'PENDING';
        summary += `${home} vs ${away} => Result: ${score}\n`;
      } else {
        summary += `${home} (BYE)\n`;
      }
    });
  });
  
  summary += `\nGenerated by EduCup Manager MVP - ${new Date().toLocaleString()}\n`;
  return summary;
};

export const exportMatchesToCSV = (rounds: Round[], teams: Team[], tournamentName: string) => {
  const getTeamName = (id: string | null) => teams.find(t => t.id === id)?.name || 'N/A';
  
  const headers = ['Round', 'Home Team', 'Away Team', 'Home Score', 'Away Score', 'Home Scorers', 'Away Scorers', 'Winner', 'Status'];
  const rows = rounds.flatMap(round => 
    round.matches.map(match => [
      round.matches.length === 1 ? 'Final' : round.matches.length === 2 ? 'Semi-Final' : `Round ${round.index + 1}`,
      getTeamName(match.homeTeamId),
      getTeamName(match.awayTeamId),
      match.scoreHome ?? '',
      match.scoreAway ?? '',
      (match.homeGoals || []).filter(Boolean).join('; '),
      (match.awayGoals || []).filter(Boolean).join('; '),
      getTeamName(match.winnerTeamId || null),
      match.status
    ])
  );

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  downloadFile(csvContent, `${tournamentName.replace(/\s+/g, '_')}_Matches.csv`, 'text/csv;charset=utf-8;');
};

export const exportTeamsToCSV = (teams: Team[], tournamentName: string) => {
  const headers = ['Team Name', 'Players'];
  const rows = teams.map(team => [
    team.name,
    team.players.join('; ')
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  downloadFile(csvContent, `${tournamentName.replace(/\s+/g, '_')}_Teams.csv`, 'text/csv;charset=utf-8;');
};

export const exportScorersToCSV = (rounds: Round[], teams: Team[], tournamentName: string) => {
  const { topScorers } = getTournamentStats(rounds, teams);
  const headers = ['Rank', 'Player Name', 'Team', 'Goals', 'Assists', 'Yellow Cards', 'Red Cards'];
  
  const rows = topScorers.map((scorer, idx) => [
    idx + 1,
    scorer.name,
    teams.find(t => t.id === scorer.teamId)?.name || 'N/A',
    scorer.goals,
    scorer.assists,
    scorer.yellowCards,
    scorer.redCards
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  downloadFile(csvContent, `${tournamentName.replace(/\s+/g, '_')}_Scorers.csv`, 'text/csv;charset=utf-8;');
};
