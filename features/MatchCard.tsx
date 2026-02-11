
import React from 'react';
import { useTournamentStore } from '../store';
import { Match, Team } from '../types';
import { Card } from '../shared/ui/Card';
import { Button } from '../shared/ui/Button';
import { Badge } from '../shared/ui/Badge';
import { 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  ChevronDown, 
  ChevronUp, 
  X, 
  AlertCircle,
  Trophy,
  Crown,
  FastForward,
  Info,
  Plus,
  Minus,
  Target,
  User,
  ShieldAlert
} from 'lucide-react';

interface MatchCardProps {
  match: Match;
  roundIdx: number;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, roundIdx }) => {
  const { teams, updateMatch, rounds, resetDownstream } = useTournamentStore();
  const homeTeam = teams.find(t => t.id === match.homeTeamId);
  const awayTeam = teams.find(t => t.id === match.awayTeamId);

  const [scoreHome, setScoreHome] = React.useState(match.scoreHome || 0);
  const [scoreAway, setScoreAway] = React.useState(match.scoreAway || 0);
  
  const [homeGoals, setHomeGoals] = React.useState<string[]>(match.homeGoals || []);
  const [awayGoals, setAwayGoals] = React.useState<string[]>(match.awayGoals || []);
  const [homeAssists, setHomeAssists] = React.useState<string[]>(match.homeAssists || []);
  const [awayAssists, setAwayAssists] = React.useState<string[]>(match.awayAssists || []);
  
  const [homeYellows, setHomeYellows] = React.useState<string[]>(match.homeYellowCards || []);
  const [awayYellows, setAwayYellows] = React.useState<string[]>(match.awayYellowCards || []);
  const [homeReds, setHomeReds] = React.useState<string[]>(match.homeRedCards || []);
  const [awayReds, setAwayRedCards] = React.useState<string[]>(match.awayRedCards || []);
  
  const [showDetails, setShowDetails] = React.useState(false);
  const [showConfirmReset, setShowConfirmReset] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [winnerAnimate, setWinnerAnimate] = React.useState(false);

  React.useEffect(() => {
    setScoreHome(match.scoreHome || 0);
    setScoreAway(match.scoreAway || 0);
    setHomeGoals(match.homeGoals || []);
    setAwayGoals(match.awayGoals || []);
    setHomeAssists(match.homeAssists || []);
    setAwayAssists(match.awayAssists || []);
    setHomeYellows(match.homeYellowCards || []);
    setAwayYellows(match.awayYellowCards || []);
    setHomeReds(match.homeRedCards || []);
    setAwayRedCards(match.awayRedCards || []);
  }, [match]);

  React.useEffect(() => {
    if (match.winnerTeamId) {
      setWinnerAnimate(true);
      const timer = setTimeout(() => setWinnerAnimate(false), 800);
      return () => clearTimeout(timer);
    }
  }, [match.winnerTeamId]);

  const isBye = match.status === 'bye';
  const isFinished = match.status === 'finished';
  const isLastRound = rounds.length - 1 === roundIdx;

  const handleScoreChange = (side: 'home' | 'away', newScore: number) => {
    const num = Math.max(0, newScore);
    if (side === 'home') {
      setScoreHome(num);
      setHomeGoals(prev => {
        const next = [...prev];
        if (next.length > num) return next.slice(0, num);
        while (next.length < num) next.push("");
        return next;
      });
      setHomeAssists(prev => {
        const next = [...prev];
        if (next.length > num) return next.slice(0, num);
        while (next.length < num) next.push("");
        return next;
      });
    } else {
      setScoreAway(num);
      setAwayGoals(prev => {
        const next = [...prev];
        if (next.length > num) return next.slice(0, num);
        while (next.length < num) next.push("");
        return next;
      });
      setAwayAssists(prev => {
        const next = [...prev];
        if (next.length > num) return next.slice(0, num);
        while (next.length < num) next.push("");
        return next;
      });
    }
  };

  const updateScorer = (list: string[], setList: (l: string[]) => void, index: number, name: string) => {
    const next = [...list];
    next[index] = name;
    setList(next);
  };

  const addCard = (side: 'home' | 'away', type: 'yellow' | 'red') => {
    if (side === 'home') {
      type === 'yellow' ? setHomeYellows([...homeYellows, ""]) : setHomeReds([...homeReds, ""]);
    } else {
      type === 'yellow' ? setAwayYellows([...awayYellows, ""]) : setAwayRedCards([...awayReds, ""]);
    }
  };

  const handleSave = () => {
    if (!isLastRound && isFinished && !showConfirmReset) {
      setShowConfirmReset(true);
      return;
    }

    const sH = scoreHome;
    const sA = scoreAway;
    let winnerId = sH > sA ? match.homeTeamId : (match.awayTeamId || undefined);
    
    if (sH === sA && match.winnerTeamId) winnerId = match.winnerTeamId;
    else if (sH === sA) winnerId = undefined;

    if (!isLastRound && isFinished) resetDownstream(roundIdx);

    setIsUpdating(true);
    setTimeout(() => {
      updateMatch(roundIdx, match.id, {
        scoreHome: sH,
        scoreAway: sA,
        homeGoals,
        awayGoals,
        homeAssists,
        awayAssists,
        homeYellowCards: homeYellows,
        awayYellowCards: awayYellows,
        homeRedCards: homeReds,
        awayRedCards: awayReds,
        winnerTeamId: winnerId,
        status: 'finished'
      });
      setIsUpdating(false);
      setShowConfirmReset(false);
      setShowDetails(false);
    }, 400);
  };

  const TeamRow = ({ team, score, isWinner }: { team: Team | undefined, score: number, isWinner: boolean }) => (
    <div className={`p-3 rounded-2xl transition-all duration-300 ${isWinner ? `bg-indigo-600 text-white shadow-lg ${winnerAnimate ? 'scale-105' : ''}` : 'bg-slate-50'}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 truncate">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-[10px] shrink-0 ${isWinner ? 'bg-white/20' : 'bg-slate-200 text-slate-500'}`}>
            {team?.name.charAt(0).toUpperCase()}
          </div>
          <span className="font-black text-xs uppercase italic truncate">{team?.name}</span>
        </div>
        <div className="flex items-center gap-2">
           {isWinner && <Crown size={14} fill="currentColor" className="text-amber-300" />}
           <span className="text-lg font-black italic tabular-nums">{score}</span>
        </div>
      </div>
    </div>
  );

  const ScorerInput = ({ label, count, players, values, onChange }: any) => {
    if (count === 0) return null;
    return (
      <div className="space-y-2">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <div className="grid grid-cols-1 gap-2">
          {Array.from({ length: count }).map((_, i) => (
            <select
              key={i}
              value={values[i] || ""}
              onChange={(e) => onChange(i, e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-bold outline-none focus:border-indigo-500 transition-all"
            >
              <option value="">O'yinchini tanlang</option>
              {players.map((p: string) => <option key={p} value={p}>{p}</option>)}
            </select>
          ))}
        </div>
      </div>
    );
  };

  if (isBye) return (
    <Card className="bg-slate-50 border-2 border-dashed border-indigo-200 rounded-2xl p-6 text-center">
      <FastForward size={24} className="mx-auto text-indigo-400 mb-2" />
      <h4 className="font-black text-slate-900 tracking-tight">{homeTeam?.name.toUpperCase()}</h4>
      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">Avtomatik o'tdi</p>
    </Card>
  );

  return (
    <Card className="p-0 overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all">
      <div className="p-4 space-y-2">
        <TeamRow team={homeTeam} score={match.scoreHome || 0} isWinner={match.winnerTeamId === match.homeTeamId} />
        <div className="flex items-center justify-center gap-2 py-0.5">
           <div className="flex-1 h-px bg-slate-100"></div>
           <span className="text-[9px] font-black text-slate-300">VS</span>
           <div className="flex-1 h-px bg-slate-100"></div>
        </div>
        <TeamRow team={awayTeam} score={match.scoreAway || 0} isWinner={match.winnerTeamId === match.awayTeamId} />

        <div className="pt-3 flex items-center justify-between">
           <button onClick={() => setShowDetails(!showDetails)} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 transition-colors">
              {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />} 
              {showDetails ? 'Yashirish' : 'Natija va Scorers'}
           </button>
           {isFinished && <Badge variant="indigo" size="xs">Tugallandi</Badge>}
        </div>
      </div>

      {showDetails && (
        <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-6 animate-in slide-in-from-top-2">
           {showConfirmReset && (
             <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-center space-y-2">
                <p className="text-[10px] text-rose-600 font-bold uppercase tracking-tight">Keyingi bosqichlar o'chib ketadi!</p>
                <div className="flex gap-2">
                   <Button size="sm" variant="danger" className="flex-1" onClick={handleSave}>Ha, o'zgartir</Button>
                   <Button size="sm" variant="secondary" className="flex-1" onClick={() => setShowConfirmReset(false)}>Bekor</Button>
                </div>
             </div>
           )}

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                 <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-100">
                    <button onClick={() => handleScoreChange('home', scoreHome - 1)} className="p-2 text-slate-300 hover:text-rose-500"><Minus size={16} /></button>
                    <span className="text-xl font-black italic">{scoreHome}</span>
                    <button onClick={() => handleScoreChange('home', scoreHome + 1)} className="p-2 text-indigo-500 hover:scale-110"><Plus size={16} /></button>
                 </div>
                 <ScorerInput label="Gollar" count={scoreHome} players={homeTeam?.players || []} values={homeGoals} onChange={(idx: number, val: string) => updateScorer(homeGoals, setHomeGoals, idx, val)} />
                 <ScorerInput label="Assistlar" count={scoreHome} players={homeTeam?.players || []} values={homeAssists} onChange={(idx: number, val: string) => updateScorer(homeAssists, setHomeAssists, idx, val)} />
              </div>

              <div className="space-y-4">
                 <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-100">
                    <button onClick={() => handleScoreChange('away', scoreAway - 1)} className="p-2 text-slate-300 hover:text-rose-500"><Minus size={16} /></button>
                    <span className="text-xl font-black italic">{scoreAway}</span>
                    <button onClick={() => handleScoreChange('away', scoreAway + 1)} className="p-2 text-rose-500 hover:scale-110"><Plus size={16} /></button>
                 </div>
                 <ScorerInput label="Gollar" count={scoreAway} players={awayTeam?.players || []} values={awayGoals} onChange={(idx: number, val: string) => updateScorer(awayGoals, setAwayGoals, idx, val)} />
                 <ScorerInput label="Assistlar" count={scoreAway} players={awayTeam?.players || []} values={awayAssists} onChange={(idx: number, val: string) => updateScorer(awayAssists, setAwayAssists, idx, val)} />
              </div>
           </div>

           {scoreHome === scoreAway && scoreHome > 0 && (
             <div className="text-center space-y-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Durang! G'olibni tanlang:</p>
                <div className="flex gap-2">
                   <Button variant={match.winnerTeamId === match.homeTeamId ? 'primary' : 'outline'} size="sm" className="flex-1 rounded-lg" onClick={() => updateMatch(roundIdx, match.id, { winnerTeamId: match.homeTeamId })}>
                      {homeTeam?.name}
                   </Button>
                   <Button variant={match.winnerTeamId === match.awayTeamId ? 'primary' : 'outline'} size="sm" className="flex-1 rounded-lg" onClick={() => awayTeam && updateMatch(roundIdx, match.id, { winnerTeamId: awayTeam.id })}>
                      {awayTeam?.name}
                   </Button>
                </div>
             </div>
           )}

           <Button className="w-full rounded-xl h-11 font-black text-xs uppercase tracking-widest" loading={isUpdating} onClick={handleSave}>
              NATIJANI SAQLASH
           </Button>
        </div>
      )}
    </Card>
  );
};
