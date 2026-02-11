
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
  Target
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
  const [justFinished, setJustFinished] = React.useState(false);
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

  // Winner transition animation effect
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

  const removeCard = (list: string[], setList: (l: string[]) => void, index: number) => {
    setList(list.filter((_, i) => i !== index));
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
      setJustFinished(true);
      setTimeout(() => setJustFinished(false), 2000);
    }, 400);
  };

  const handleManualWinner = (id: string) => {
    if (!isLastRound && isFinished && !showConfirmReset) { setShowConfirmReset(true); return; }
    if (!isLastRound && isFinished) resetDownstream(roundIdx);
    updateMatch(roundIdx, match.id, { winnerTeamId: id, status: 'finished' });
    setShowConfirmReset(false);
    setJustFinished(true);
    setTimeout(() => setJustFinished(false), 2000);
  };

  if (isBye) {
    return (
      <Card className="bg-slate-50 border-2 border-dashed border-indigo-200 rounded-2xl p-6 text-center group hover:bg-indigo-50/30 transition-all duration-300">
        <div className="relative mb-4 inline-flex">
          <div className="absolute inset-0 bg-indigo-200 blur-lg opacity-40 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
            <FastForward size={24} />
          </div>
        </div>
        <h4 className="font-black text-slate-900 tracking-tight text-lg">{homeTeam?.name.toUpperCase()}</h4>
        <div className="mt-2 flex items-center justify-center gap-2">
          <span className="h-px w-4 bg-indigo-200"></span>
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Keyingi bosqichda</span>
          <span className="h-px w-4 bg-indigo-200"></span>
        </div>
      </Card>
    );
  }

  const homeWinner = match.winnerTeamId === match.homeTeamId;
  const awayWinner = match.winnerTeamId === match.awayTeamId;

  const TeamRow = ({ team, score, side, isWinner, goals, assists }: { team: Team | undefined, score: number, side: 'home' | 'away', isWinner: boolean, goals: string[], assists: string[] }) => (
    <div className={`relative p-3 rounded-2xl transition-all duration-500 ${isWinner ? `bg-indigo-600 text-white shadow-[0_10px_30px_rgba(79,70,229,0.3)] ring-2 ring-indigo-400 ring-offset-2 ${winnerAnimate ? 'animate-pulse scale-[1.05]' : 'scale-[1.02]'}` : 'bg-slate-50 hover:bg-slate-100'} ${justFinished && isWinner ? 'animate-in zoom-in-95 fade-in duration-500' : ''}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] shrink-0 italic ${isWinner ? 'bg-white/20' : 'bg-slate-200 text-slate-500'}`}>
            {team?.name.charAt(0).toUpperCase()}
          </div>
          <span className="font-black text-xs uppercase italic truncate pr-1">{team?.name}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
           {isWinner && <Crown size={16} fill="currentColor" className="text-amber-300 animate-bounce" />}
           <span className="text-xl font-black italic tabular-nums">{score}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Card className={`relative overflow-hidden p-0 border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 group ${isFinished ? 'border-indigo-100' : ''}`}>
      <div className="p-5 space-y-3">
        <TeamRow team={homeTeam} score={match.scoreHome || 0} side="home" isWinner={homeWinner} goals={homeGoals} assists={homeAssists} />
        <div className="flex items-center justify-center gap-3 py-1">
           <div className="flex-1 h-px bg-slate-100"></div>
           <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black italic text-slate-300">VS</div>
           <div className="flex-1 h-px bg-slate-100"></div>
        </div>
        <TeamRow team={awayTeam} score={match.scoreAway || 0} side="away" isWinner={awayWinner} goals={awayGoals} assists={awayAssists} />

        {/* Action Bar */}
        <div className="pt-4 flex items-center justify-between gap-3">
           <button 
             onClick={() => setShowDetails(!showDetails)}
             className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
           >
             {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />} 
             {showDetails ? 'YASHIRISH' : 'NATIJA KIRITISH'}
           </button>
           {isFinished && (
             <Badge variant="indigo" size="xs" className="italic px-3">TUGALLANDI</Badge>
           )}
        </div>
      </div>

      {/* Detail Panel */}
      {showDetails && (
        <div className="border-t border-slate-100 bg-slate-50/50 p-5 space-y-6 animate-in slide-in-from-top-2 duration-300">
           {showConfirmReset && (
             <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-rose-600 text-[10px] font-black uppercase tracking-widest">
                   <AlertCircle size={16} /> DIQQAT!
                </div>
                <p className="text-[11px] text-rose-500 font-bold leading-relaxed">Natijani o'zgartirish keyingi barcha bosqichlarni o'chirib yuboradi. Davom etasizmi?</p>
                <div className="flex gap-2">
                   <Button size="sm" variant="danger" className="flex-1 rounded-lg" onClick={handleSave}>HA, O'ZGARTIRISH</Button>
                   <Button size="sm" variant="secondary" className="flex-1 rounded-lg" onClick={() => setShowConfirmReset(false)}>BEKOR QILISH</Button>
                </div>
             </div>
           )}

           <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                 <span>Hisobni yangilash</span>
                 <Target size={14} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-100">
                    <button onClick={() => handleScoreChange('home', scoreHome - 1)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><Minus size={16} /></button>
                    <span className="text-2xl font-black italic">{scoreHome}</span>
                    <button onClick={() => handleScoreChange('home', scoreHome + 1)} className="p-2 hover:bg-slate-50 rounded-lg text-indigo-600"><Plus size={16} /></button>
                 </div>
                 <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-100">
                    <button onClick={() => handleScoreChange('away', scoreAway - 1)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><Minus size={16} /></button>
                    <span className="text-2xl font-black italic">{scoreAway}</span>
                    <button onClick={() => handleScoreChange('away', scoreAway + 1)} className="p-2 hover:bg-slate-50 rounded-lg text-rose-500"><Plus size={16} /></button>
                 </div>
              </div>
           </div>

           {scoreHome === scoreAway && scoreHome > 0 && (
             <div className="space-y-3 pt-2">
                <p className="text-[9px] font-black text-center text-slate-400 uppercase tracking-widest italic">Durang! G'olibni tanlang:</p>
                <div className="flex gap-2">
                   <Button variant={match.winnerTeamId === match.homeTeamId ? 'primary' : 'outline'} size="sm" className="flex-1 rounded-lg" onClick={() => handleManualWinner(match.homeTeamId)}>
                      {homeTeam?.name}
                   </Button>
                   <Button variant={match.winnerTeamId === match.awayTeamId ? 'primary' : 'outline'} size="sm" className="flex-1 rounded-lg" onClick={() => awayTeam ? handleManualWinner(awayTeam.id) : null}>
                      {awayTeam?.name}
                   </Button>
                </div>
             </div>
           )}

           <Button className="w-full rounded-xl h-11 font-black text-xs uppercase tracking-[0.2em]" loading={isUpdating} onClick={handleSave}>
              SAQLASH VA TASDIQLASH
           </Button>
        </div>
      )}
    </Card>
  );
};
