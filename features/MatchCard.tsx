
import React from 'react';
import { useTournamentStore } from '../store';
import { Match } from '../types';
import { Card } from '../shared/ui/Card';
import { Button } from '../shared/ui/Button';
import { 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Target, 
  ChevronDown, 
  ChevronUp, 
  X, 
  AlertCircle,
  Award
} from 'lucide-react';

interface MatchCardProps {
  match: Match;
  roundIdx: number;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, roundIdx }) => {
  const { teams, updateMatch, rounds, resetDownstream } = useTournamentStore();
  const homeTeam = teams.find(t => t.id === match.homeTeamId);
  const awayTeam = teams.find(t => t.id === match.awayTeamId);

  const [scoreHome, setScoreHome] = React.useState(match.scoreHome?.toString() || '0');
  const [scoreAway, setScoreAway] = React.useState(match.scoreAway?.toString() || '0');
  
  const [homeGoals, setHomeGoals] = React.useState<string[]>(match.homeGoals || []);
  const [awayGoals, setAwayGoals] = React.useState<string[]>(match.awayGoals || []);
  const [homeAssists, setHomeAssists] = React.useState<string[]>(match.homeAssists || []);
  const [awayAssists, setAwayAssists] = React.useState<string[]>(match.awayAssists || []);
  
  const [homeYellows, setHomeYellows] = React.useState<string[]>(match.homeYellowCards || []);
  const [awayYellows, setAwayYellows] = React.useState<string[]>(match.awayYellowCards || []);
  const [homeReds, setHomeReds] = React.useState<string[]>(match.homeRedCards || []);
  const [awayReds, setAwayReds] = React.useState<string[]>(match.awayRedCards || []);
  
  const [showDetails, setShowDetails] = React.useState(false);
  const [showConfirmReset, setShowConfirmReset] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);

  React.useEffect(() => {
    setScoreHome(match.scoreHome?.toString() || '0');
    setScoreAway(match.scoreAway?.toString() || '0');
    setHomeGoals(match.homeGoals || []);
    setAwayGoals(match.awayGoals || []);
    setHomeAssists(match.homeAssists || []);
    setAwayAssists(match.awayAssists || []);
    setHomeYellows(match.homeYellowCards || []);
    setAwayYellows(match.awayYellowCards || []);
    setHomeReds(match.homeRedCards || []);
    setAwayReds(match.awayRedCards || []);
  }, [match]);

  const isBye = match.status === 'bye';
  const isFinished = match.status === 'finished';
  const isLastRound = rounds.length - 1 === roundIdx;

  const handleScoreChange = (side: 'home' | 'away', val: string) => {
    const num = Math.max(0, parseInt(val) || 0);
    if (side === 'home') {
      setScoreHome(val);
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
      setScoreAway(val);
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
      type === 'yellow' ? setAwayYellows([...awayYellows, ""]) : setAwayReds([...awayReds, ""]);
    }
  };

  const removeCard = (list: string[], setList: (l: string[]) => void, index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!isLastRound && isFinished && !showConfirmReset) {
      setShowConfirmReset(true);
      return;
    }

    const sH = parseInt(scoreHome) || 0;
    const sA = parseInt(scoreAway) || 0;
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
    }, 400);
  };

  const handleManualWinner = (id: string) => {
    if (!isLastRound && isFinished && !showConfirmReset) { setShowConfirmReset(true); return; }
    if (!isLastRound && isFinished) resetDownstream(roundIdx);
    updateMatch(roundIdx, match.id, { winnerTeamId: id, status: 'finished' });
    setShowConfirmReset(false);
  };

  if (isBye) {
    return (
      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center">
        <ArrowRight size={24} className="mx-auto text-indigo-400 mb-3" />
        <h4 className="font-bold text-slate-900">{homeTeam?.name}</h4>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">Saralashsiz o'tdi</span>
      </div>
    );
  }

  const homeWinner = match.winnerTeamId === match.homeTeamId;
  const awayWinner = match.winnerTeamId === match.awayTeamId;

  const TeamRow = ({ team, score, side, isWinner, goals, assists }: any) => (
    <div className={`p-3 rounded-xl transition-all ${isWinner ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50'}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${isWinner ? 'bg-white text-indigo-600' : 'bg-slate-200 text-slate-600'}`}>
            {team?.name.charAt(0).toUpperCase()}
          </div>
          <span className="font-bold truncate text-sm">{team?.name}</span>
        </div>
        <input 
          type="number" min="0" value={score} onChange={e => handleScoreChange(side, e.target.value)}
          className={`w-10 h-8 rounded-lg text-center text-sm font-black outline-none transition-all ${isWinner ? 'bg-white/20 text-white' : 'bg-white border border-slate-200 text-slate-900'}`}
        />
      </div>

      {(goals.length > 0 || assists.length > 0) && (
        <div className="mt-3 pt-3 border-t border-black/10 space-y-2 animate-in fade-in duration-300">
           {goals.map((_: any, i: number) => (
             <div key={i} className="grid grid-cols-2 gap-1.5">
                <select 
                  value={goals[i]} 
                  onChange={e => updateScorer(goals, side === 'home' ? setHomeGoals : setAwayGoals, i, e.target.value)}
                  className={`p-1 rounded bg-black/5 text-[9px] font-bold outline-none border-none ${isWinner ? 'text-white' : 'text-slate-600'}`}
                >
                  <option value="">GOL MUALLIFI...</option>
                  {team?.players.map((p: string) => <option key={p} value={p}>{p}</option>)}
                </select>
                <select 
                  value={assists[i]} 
                  onChange={e => updateScorer(assists, side === 'home' ? setHomeAssists : setAwayAssists, i, e.target.value)}
                  className={`p-1 rounded bg-black/5 text-[9px] font-bold outline-none border-none ${isWinner ? 'text-white' : 'text-slate-600'}`}
                >
                  <option value="">ASSIST...</option>
                  {team?.players.map((p: string) => <option key={p} value={p}>{p}</option>)}
                </select>
             </div>
           ))}
        </div>
      )}
    </div>
  );

  return (
    <Card className={`relative p-0 overflow-hidden ${isUpdating ? 'opacity-50' : ''}`}>
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
         <span className={`text-[9px] font-black uppercase tracking-widest ${isFinished ? 'text-slate-400' : 'text-indigo-600 animate-pulse'}`}>
           {isFinished ? 'Yakunlangan' : 'Jonli'}
         </span>
         <span className="text-[9px] font-bold text-slate-300">ID: {match.id.slice(0, 4)}</span>
      </div>
      
      <div className="p-4 space-y-3">
        <TeamRow team={homeTeam} score={scoreHome} side="home" isWinner={homeWinner} goals={homeGoals} assists={homeAssists} />
        
        <div className="relative flex items-center justify-center py-1">
           <div className="absolute w-full border-t border-slate-100"></div>
           <span className="relative px-2 bg-white text-[9px] font-black text-slate-300">VS</span>
        </div>

        <TeamRow team={awayTeam} score={scoreAway} side="away" isWinner={awayWinner} goals={awayGoals} assists={awayAssists} />

        <div className="pt-2 flex flex-col gap-2">
           <button 
             className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 flex items-center justify-center gap-1 transition-colors"
             onClick={() => setShowDetails(!showDetails)}
           >
              {showDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              Intizom choralari
           </button>

           {showDetails && (
             <div className="p-3 bg-slate-50 rounded-xl space-y-4 animate-in slide-in-from-top-2 duration-200">
                {/* Discipline fields simplified */}
                <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Kartochkalar</span>
                  <div className="flex gap-2">
                    <button onClick={() => addCard('home', 'yellow')} className="text-amber-500 hover:underline">A+</button>
                    <button onClick={() => addCard('away', 'yellow')} className="text-amber-500 hover:underline">B+</button>
                  </div>
                </div>
                
                {/* Yellow/Red lists compressed */}
                <div className="space-y-1 max-h-32 overflow-y-auto">
                   {[...homeYellows, ...homeReds, ...awayYellows, ...awayReds].length === 0 && (
                     <p className="text-[9px] text-slate-300 text-center italic">Hech qanday ogohlantirish yo'q</p>
                   )}
                   {/* Logic to render individual cards briefly */}
                   {homeYellows.map((v, i) => (
                     <div key={`hy-${i}`} className="flex items-center gap-2 bg-white p-1 rounded border border-slate-100">
                        <div className="w-2 h-3 bg-amber-400 rounded-sm"></div>
                        <select value={v} onChange={e => updateScorer(homeYellows, setHomeYellows, i, e.target.value)} className="flex-1 bg-transparent text-[9px] border-none"><option value="">O'yinchi...</option>{homeTeam?.players.map(p => <option key={p} value={p}>{p}</option>)}</select>
                        <button onClick={() => removeCard(homeYellows, setHomeYellows, i)} className="text-slate-300"><X size={12}/></button>
                     </div>
                   ))}
                </div>
             </div>
           )}

           <Button 
              variant={isFinished ? "secondary" : "primary"} 
              size="sm" 
              className="w-full font-bold py-2 rounded-xl"
              onClick={handleSave} 
              loading={isUpdating}
            >
              {isFinished ? 'Tahrirlash' : 'Saqlash'}
           </Button>
        </div>

        {/* Tied handling */}
        {isFinished && match.scoreHome === match.scoreAway && !match.winnerTeamId && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl space-y-2">
             <p className="text-[10px] font-bold text-amber-700 uppercase text-center">Penaltilar Seriyasi</p>
             <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 text-[9px] border-amber-200 bg-white" onClick={() => handleManualWinner(match.homeTeamId)}>A-G'olib</Button>
                <Button variant="outline" size="sm" className="flex-1 text-[9px] border-amber-200 bg-white" onClick={() => handleManualWinner(match.awayTeamId!)}>B-G'olib</Button>
             </div>
          </div>
        )}

        {showConfirmReset && (
          <div className="absolute inset-0 bg-white/95 z-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
             <AlertCircle size={32} className="text-rose-500 mb-3" />
             <p className="text-xs font-bold text-slate-900 mb-4 leading-tight">Natijani o'zgartirish keyingi bosqichlarni o'chirib yuboradi!</p>
             <div className="flex flex-col gap-2 w-full">
                <Button variant="danger" size="sm" className="w-full" onClick={handleSave}>HA, TAHRIRLASH</Button>
                <Button variant="ghost" size="sm" className="w-full text-slate-400" onClick={() => setShowConfirmReset(false)}>BEKOR QILISH</Button>
             </div>
          </div>
        )}
      </div>
    </Card>
  );
};
