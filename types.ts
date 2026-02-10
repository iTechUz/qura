
export type MatchStatus = 'pending' | 'finished' | 'bye';

export interface Goal {
  playerId: string; // Player name/id
  teamId: string;
}

export interface Match {
  id: string;
  roundIndex: number;
  homeTeamId: string;
  awayTeamId: string | null; // null means BYE
  scoreHome?: number;
  scoreAway?: number;
  homeGoals?: string[]; // Array of player names who scored for home team
  awayGoals?: string[]; // Array of player names who scored for away team
  homeAssists?: string[]; // Array of player names who assisted for home team
  awayAssists?: string[]; // Array of player names who assisted for away team
  homeYellowCards?: string[]; // Array of player names who got yellow card
  awayYellowCards?: string[]; // Array of player names who got yellow card
  homeRedCards?: string[]; // Array of player names who got red card
  awayRedCards?: string[]; // Array of player names who got red card
  winnerTeamId?: string;
  status: MatchStatus;
}

export interface Round {
  index: number;
  matches: Match[];
}

export interface Team {
  id: string;
  name: string;
  players: string[];
}

export interface Tournament {
  id: string;
  name: string;
  playersPerTeam: number;
  date?: string;
  createdAt: number;
  championTeamId?: string;
}

export interface TournamentState {
  tournament: Tournament | null;
  teams: Team[];
  rounds: Round[];
}
