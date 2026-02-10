
import React from 'react';
import { useTournamentStore } from '../store';
import { MatchCard } from '../features/MatchCard';
import { Button } from '../shared/ui/Button';
import { Card } from '../shared/ui/Card';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  RotateCw, 
  AlertTriangle, 
  Users, 
  LayoutList, 
  Printer, 
  ChevronDown,
  Award,
  Sparkles,
  RefreshCcw,
  Swords,
  Box,
  Play,
  Crown,
  Dices
} from 'lucide-react';
import { Team } from '../types';

type Stage = 'intro' | 'picking_home' | 'ball_shaking_home' | 'revealing_home' | 'picking_away' | 'ball_shaking_away' | 'revealing_away' | 'match_slam' | 'summary';

const DrawCeremony: React.FC<{ teams: Team[], onComplete: () => void }> = ({ teams, onComplete }) => {
  const [currentStage, setCurrentStage] = React.useState<Stage>('intro');
  const [matchResults, setMatchResults] = React.useState<Array<{ h: Team, a: Team | null }>>([]);
  const [currentPair, setCurrentPair] = React.useState<{ h: Team | null, a: Team | null }>({ h: null, a: null });
  const [remainingTeams, setRemainingTeams] = React.useState<Team[]>([]);
  
  const pairs = React.useMemo(() => {
    const arr = [...teams].sort(() => Math.random() - 0.5);
    const p: Array<{ h: Team, a: Team | null }> = [];
    for (let i = 0; i < arr.length; i += 2) {
      p.push({ h: arr[i], a: arr[i + 1] || null });
    }
    return p;
  }, [teams]);

  const startDraw = () => {
    setRemainingTeams([...teams]);
    setCurrentStage('picking_home');
  };

  React.useEffect(() => {
    if (currentStage === 'intro') {
        const t = setTimeout(startDraw, 1500);
        return () => clearTimeout(t);
    }

    const currentPairIdx = matchResults.length;
    const targetPair = pairs[currentPairIdx];

    if (!targetPair) {
        if (currentStage !== 'summary') setCurrentStage('summary');
        return;
    }

    if (currentStage === 'picking_home') {
        const t = setTimeout(() => setCurrentStage('ball_shaking_home'), 1500);
        return () => clearTimeout(t);
    }

    if (currentStage === 'ball_shaking_home') {
        const t = setTimeout(() => setCurrentStage('revealing_home'), 1200);
        return () => clearTimeout(t);
    }

    if (currentStage === 'revealing_home') {
        setCurrentPair({ h: targetPair.h, a: null });
        const t = setTimeout(() => {
            if (targetPair.a) setCurrentStage('picking_away');
            else setCurrentStage('match_slam');
        }, 1500);
        return () => clearTimeout(t);
    }

    if (currentStage === 'picking_away') {
        const t = setTimeout(() => setCurrentStage('ball_shaking_away'), 1500);
        return () => clearTimeout(t);
    }

    if (currentStage === 'ball_shaking_away') {
        const t = setTimeout(() => setCurrentStage('revealing_away'), 1200);
        return () => clearTimeout(t);
    }

    if (currentStage === 'revealing_away') {
        setCurrentPair(prev => ({ ...prev, a: targetPair.a }));
        const t = setTimeout(() => setCurrentStage('match_slam'), 1500);
        return () => clearTimeout(t);
    }

    if (currentStage === 'match_slam') {
        const t = setTimeout(() => {
            setMatchResults(prev => [...prev, targetPair]);
            setCurrentPair({ h: null, a: null });
            setRemainingTeams(prev => prev.filter(t => t.id !== targetPair.h.id && (targetPair.a ? t.id !== targetPair.a.id : true)));
            setCurrentStage('picking_home');
        }, 1200);
        return () => clearTimeout(t);
    }
  }, [currentStage, matchResults.length, pairs]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#020617] text-white flex flex-col items-center justify-center p-4 scanline-effect overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_#020617_70%)] opacity-60"></div>
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none"></div>

      {/* Progress Header */}
      <div className="absolute top-10 left-0 right-0 px-12 flex justify-between items-center opacity-80 z-20">
         <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Marosim Progressi</span>
            <div className="flex gap-1 mt-2">
               {pairs.map((_, i) => (
                 <div key={i} className={`h-1.5 w-8 rounded-full transition-all duration-500 ${i < matchResults.length ? 'bg-indigo-500' : i === matchResults.length ? 'bg-white animate-pulse' : 'bg-white/10'}`}></div>
               ))}
            </div>
         </div>
         <div className="flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Savatda Qoldi</span>
            <span className="text-4xl font-black italic text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{remainingTeams.length}</span>
         </div>
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center gap-16">
        
        {/* Pot & Picking Stage */}
        {(currentStage.startsWith('picking') || currentStage === 'intro' || currentStage.startsWith('ball_shaking')) && (
           <div className="flex flex-col items-center gap-10 animate-in zoom-in fade-in duration-700">
              <div className="relative w-64 h-64">
                 <div className="absolute inset-0 bg-indigo-600/30 rounded-full blur-3xl animate-pulse"></div>
                 
                 {/* The Pot Visualizer */}
                 <div className={`relative w-full h-full glass-dark rounded-full flex items-center justify-center border-2 border-indigo-500/20 shadow-2xl transition-all duration-700 ${currentStage.startsWith('ball_shaking') ? 'scale-125 border-indigo-400/50 glow-indigo' : ''}`}>
                    
                    {currentStage.startsWith('ball_shaking') ? (
                       <div className="animate-ball-shake">
                          <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-indigo-800 rounded-full border-2 border-white/20 shadow-2xl flex items-center justify-center overflow-hidden">
                             <div className="absolute top-0 right-0 w-8 h-8 bg-white/20 blur-md rounded-full"></div>
                             <Dices size={48} className="text-white/80" />
                          </div>
                       </div>
                    ) : (
                       <div className="relative w-full h-full flex items-center justify-center">
                          <RefreshCcw size={80} className="text-indigo-400/40 animate-spin" style={{ animationDuration: '4s' }} />
                          {/* Mini spheres inside the pot */}
                          {[...Array(6)].map((_, i) => (
                            <div key={i} className="absolute w-6 h-6 bg-indigo-500/30 border border-white/10 rounded-full animate-sphere-float" style={{ animationDelay: `${i * 0.5}s`, left: `${20 + Math.random() * 60}%`, top: `${20 + Math.random() * 60}%` }}></div>
                          ))}
                       </div>
                    )}
                 </div>

                 {/* Orbiting particles */}
                 {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                   <div key={deg} className="absolute inset-0 flex items-center justify-center animate-orbit" style={{ animationDelay: `${deg/50}s`, animationDuration: '5s' }}>
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full shadow-[0_0_10px_#818cf8]"></div>
                   </div>
                 ))}
              </div>

              <div className="text-center space-y-4">
                 <div className="flex items-center justify-center gap-3 text-white">
                    <div className="h-px w-12 bg-indigo-500/30"></div>
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-[0.6em] text-white italic drop-shadow-lg">
                       {currentStage === 'picking_home' || currentStage === 'ball_shaking_home' ? 'Savatdan Mezbon Tanlanmoqda' : 
                        currentStage === 'picking_away' || currentStage === 'ball_shaking_away' ? 'Raqib Aniqlanmoqda' : 
                        'Marosim Boshlanmoqda'}
                    </h2>
                    <div className="h-px w-12 bg-indigo-500/30"></div>
                 </div>
                 <p className="text-indigo-400 text-xs font-black uppercase tracking-[0.4em] opacity-60 animate-pulse">
                    Tasodifiy algoritmlar muvozanati
                 </p>
              </div>
           </div>
        )}

        {/* Reveal & Slam Stage */}
        {(currentStage.includes('revealing') || currentStage === 'match_slam') && (
          <div className="w-full flex flex-col items-center gap-16">
             <div className="w-full flex items-center justify-around gap-6 md:gap-20">
                
                {/* Home Slot */}
                <div className="flex-1 flex flex-col items-center gap-6">
                  <div className={`relative w-40 h-40 md:w-60 md:h-60 rounded-[2.5rem] flex flex-col items-center justify-center transition-all duration-700 border-2 ${currentPair.h ? 'animate-reveal glass-dark border-indigo-500 shadow-[0_0_60px_rgba(79,70,229,0.4)]' : 'border-dashed border-white/5 bg-white/5 opacity-10'}`}>
                    {currentPair.h ? (
                       <div className="flex flex-col items-center">
                         <div className="relative group">
                            <div className="absolute inset-0 bg-indigo-400 blur-xl opacity-20"></div>
                            <div className="relative w-20 h-20 md:w-28 md:h-28 bg-indigo-600 rounded-3xl flex items-center justify-center text-white text-4xl md:text-6xl font-black mb-6 shadow-2xl border border-white/10 group-hover:scale-105 transition-transform">
                              {currentPair.h.name.charAt(0)}
                            </div>
                         </div>
                         <span className="text-white font-black text-center px-4 text-base md:text-2xl tracking-tighter uppercase italic leading-none">{currentPair.h.name}</span>
                       </div>
                    ) : (
                       <Box size={48} className="text-white/10" />
                    )}
                    {currentStage === 'revealing_home' && <div className="absolute inset-0 animate-burst bg-white/20 rounded-[2.5rem]"></div>}
                  </div>
                  <div className="px-4 py-1.5 bg-indigo-900/40 border border-indigo-500/20 rounded-full">
                     <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.5em]">Mezbon</span>
                  </div>
                </div>

                {/* VS Centerpiece */}
                <div className="shrink-0 flex flex-col items-center justify-center">
                   {currentStage === 'match_slam' ? (
                      <div className="animate-slam bg-white text-black px-6 md:px-10 py-2 md:py-4 font-black italic text-2xl md:text-6xl skew-x-[-15deg] shadow-[0_0_50px_#fff] border-r-8 border-indigo-600">VS</div>
                   ) : (
                      <div className="relative w-16 h-16 md:w-24 md:h-24 flex items-center justify-center">
                         <div className="absolute inset-0 bg-white/5 rounded-full border border-white/10 animate-ping"></div>
                         <Swords size={32} className="text-white/20 animate-pulse md:scale-150" />
                      </div>
                   )}
                </div>

                {/* Away Slot */}
                <div className="flex-1 flex flex-col items-center gap-6">
                  <div className={`relative w-40 h-40 md:w-60 md:h-60 rounded-[2.5rem] flex flex-col items-center justify-center transition-all duration-700 border-2 ${currentPair.a ? 'animate-reveal glass-dark border-indigo-500 shadow-[0_0_60px_rgba(79,70,229,0.4)]' : 'border-dashed border-white/5 bg-white/5 opacity-10'}`}>
                    {currentPair.a ? (
                       <div className="flex flex-col items-center">
                         <div className="relative group">
                            <div className="absolute inset-0 bg-indigo-400 blur-xl opacity-20"></div>
                            <div className="relative w-20 h-20 md:w-28 md:h-28 bg-indigo-600 rounded-3xl flex items-center justify-center text-white text-4xl md:text-6xl font-black mb-6 shadow-2xl border border-white/10 group-hover:scale-105 transition-transform">
                              {currentPair.a.name.charAt(0)}
                            </div>
                         </div>
                         <span className="text-white font-black text-center px-4 text-base md:text-2xl tracking-tighter uppercase italic leading-none">{currentPair.a.name}</span>
                       </div>
                    ) : (
                      currentStage === 'match_slam' && !currentPair.a ? (
                         <div className="flex flex-col items-center gap-2">
                           <Zap size={40} className="text-green-400 animate-bounce" />
                           <div className="text-green-400 font-black text-center text-xs tracking-[0.3em] uppercase px-4 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">BYE PASS</div>
                         </div>
                      ) : <Box size={48} className="text-white/10" />
                    )}
                    {currentStage === 'revealing_away' && <div className="absolute inset-0 animate-burst bg-white/20 rounded-[2.5rem]"></div>}
                  </div>
                  <div className="px-4 py-1.5 bg-indigo-900/40 border border-indigo-500/20 rounded-full">
                     <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.5em]">Mehmon</span>
                  </div>
                </div>
             </div>
          </div>
        )}

        {/* Summary Screen */}
        {currentStage === 'summary' && (
          <div className="w-full flex flex-col items-center gap-10 animate-in fade-in zoom-in duration-1000">
             <div className="text-center space-y-4">
                <div className="relative w-24 h-24 bg-green-500 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-[0_0_60px_rgba(34,197,94,0.4)] rotate-3">
                   <ShieldCheck size={56} />
                   <Sparkles className="absolute -top-2 -right-2 text-white animate-pulse" size={24} />
                </div>
                <h2 className="text-5xl font-black italic tracking-tighter uppercase text-white drop-shadow-2xl">Qur'a Yakunlandi</h2>
                <p className="text-indigo-400 text-xs font-bold uppercase tracking-[0.5em] opacity-60">1-bosqich juftliklari tasdiqlandi</p>
             </div>

             <div className="w-full max-w-4xl max-h-[45vh] overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 gap-4 scrollbar-hide">
                {matchResults.map((m, idx) => (
                  <div key={idx} className="glass-dark p-6 rounded-3xl flex items-center justify-between border-white/5 hover:border-indigo-500/30 transition-all group">
                     <div className="flex items-center gap-4">
                        <span className="text-sm font-black text-indigo-500 bg-indigo-500/10 w-8 h-8 rounded-lg flex items-center justify-center">#{idx+1}</span>
                        <span className="text-sm md:text-base font-black text-white uppercase tracking-tight group-hover:text-indigo-400 transition-colors">{m.h.name}</span>
                     </div>
                     <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-white/20 italic tracking-widest">VS</span>
                        <span className="text-sm md:text-base font-black text-white uppercase tracking-tight text-right">{m.a?.name || '---'}</span>
                        {m.a === null && <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded font-black">BYE</span>}
                     </div>
                  </div>
                ))}
             </div>

             <Button size="lg" onClick={onComplete} className="w-full py-8 rounded-[2rem] bg-white text-indigo-950 font-black text-2xl hover:bg-indigo-50 shadow-[0_20px_60px_rgba(255,255,255,0.2)] hover:scale-[1.02] transition-all">
                TURNIRGA START BERISH <ArrowRight size={32} className="ml-4" />
             </Button>
          </div>
        )}
      </div>

      {/* Lighting Effects */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
    </div>
  );
};

export const Bracket: React.FC = () => {
  const { tournament, teams, rounds, startTournament, reShuffleRound1, generateNextRound } = useTournamentStore();
  const [showCeremony, setShowCeremony] = React.useState(false);
  const navigate = useNavigate();

  if (!tournament) return null;

  const incompleteTeams = teams.filter(t => t.players.length < tournament.playersPerTeam);
  const canStart = teams.length >= 2 && incompleteTeams.length === 0;

  const handleStartWithCeremony = () => setShowCeremony(true);

  const finalizeTournament = () => {
    setShowCeremony(false);
    startTournament();
  };

  if (showCeremony) {
    return <DrawCeremony teams={teams} onComplete={finalizeTournament} />;
  }

  if (rounds.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-12 px-4 text-center space-y-12">
        <div className="space-y-4 max-w-lg">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-indigo-200 animate-sphere-float">
            <Zap size={40} fill="currentColor" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Knockout Stage</h1>
          <p className="text-slate-500 text-base font-medium">Jamoalar tayyor. Qur'a tashlash marosimini o'tkazish va o'yinlarni boshlash mumkin.</p>
        </div>
        
        {!canStart ? (
          <div className="w-full max-w-md p-8 bg-white border border-rose-100 rounded-[2.5rem] shadow-xl space-y-6">
             <div className="flex items-center gap-3 text-rose-600 justify-center">
                <AlertTriangle size={24} />
                <span className="font-black uppercase tracking-[0.2em] text-xs">Tayyorgarlik to'liq emas</span>
             </div>
             <div className="space-y-4 text-left">
               {teams.length < 2 && (
                 <p className="text-sm font-bold text-slate-600 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">1</span>
                    Kamida 2 ta jamoa qo'shing
                 </p>
               )}
               {incompleteTeams.length > 0 && (
                 <div className="space-y-3">
                   <p className="text-sm font-bold text-slate-600 flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">2</span>
                      Jamoalar tarkibi to'liq emas:
                   </p>
                   <div className="flex flex-wrap gap-2 pl-9">
                      {incompleteTeams.map(t => (
                        <span key={t.id} className="text-[11px] font-black text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
                           {t.name}
                        </span>
                      ))}
                   </div>
                 </div>
               )}
             </div>
             <Button variant="secondary" size="lg" className="w-full rounded-2xl py-6" onClick={() => navigate('/teams')}>
                <Users size={20} className="mr-2" /> Tarkibni to'ldirish
             </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8">
            <Button size="lg" onClick={handleStartWithCeremony} className="px-16 py-8 rounded-[2rem] shadow-2xl hover:-translate-y-2 transition-all bg-indigo-600 text-white text-xl font-black">
              <LayoutList size={24} className="mr-3" /> Qur'a Tashlash Marosimi
            </Button>
            <div className="flex items-center gap-3 px-6 py-2 bg-green-50 border border-green-100 rounded-full">
               <ShieldCheck size={18} className="text-green-600" />
               <span className="text-xs text-green-700 font-black uppercase tracking-widest">Tizim startga tayyor</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  const lastRound = rounds[rounds.length - 1];
  const allMatchesFinished = lastRound.matches.every(m => m.winnerTeamId);
  const isFinalFinished = lastRound.matches.length === 1 && allMatchesFinished;
  const canReshuffle = rounds.length === 1 && rounds[0].matches.every(m => m.status === 'pending' || m.status === 'bye');

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden border-b border-slate-200 pb-8">
         <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
               <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded uppercase tracking-wider">Bracket</span>
               <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Bosqichlar: {rounds.length}</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight text-slate-900">O'yinlar Jadvali</h1>
         </div>
         <div className="flex gap-2 text-slate-900">
            <Button variant="outline" size="sm" className="rounded-xl font-bold" onClick={() => window.print()}>
              <Printer size={16} className="mr-2" /> Chop etish
            </Button>
            {canReshuffle && (
               <Button variant="secondary" size="sm" className="rounded-xl font-bold" onClick={handleStartWithCeremony}>
                 <RotateCw size={16} className="mr-2" /> Yangi Qur'a
               </Button>
            )}
            {!isFinalFinished && (
               <Button 
                   variant="primary" 
                   size="sm" 
                   disabled={!allMatchesFinished} 
                   onClick={generateNextRound}
                   className={`rounded-xl font-black px-6 transition-all duration-500 ${allMatchesFinished ? 'animate-pulse shadow-[0_0_30px_rgba(34,197,94,0.4)] bg-green-600 border-none hover:bg-green-700 scale-105' : ''}`}
               >
                   {allMatchesFinished ? 'KEYINGI BOSQICHGA O\'TISH' : 'O\'YINLAR DAVOM ETMOQDA'} <ArrowRight size={16} className="ml-2" />
               </Button>
            )}
         </div>
      </header>

      {tournament.championTeamId && (
        <div className="max-w-2xl mx-auto animate-in zoom-in duration-1000">
          <Card className="bg-slate-900 text-white border-none p-0 overflow-hidden relative shadow-[0_20px_50px_rgba(79,70,229,0.2)]" variant="premium">
             <div className="p-10 text-center relative z-10 space-y-8">
                <div className="relative inline-block">
                   <div className="absolute inset-0 bg-amber-400 blur-2xl opacity-20 animate-pulse"></div>
                   <div className="w-24 h-24 bg-white/10 rounded-[2.5rem] flex items-center justify-center mx-auto backdrop-blur-md border border-white/20 shadow-xl">
                      <Trophy size={48} className="text-amber-400" />
                   </div>
                </div>
                <div className="space-y-2">
                   <p className="text-indigo-400 text-[12px] font-black uppercase tracking-[0.5em] animate-pulse">🏆 Turnir G'olibi 🏆</p>
                   <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-tight bg-gradient-to-r from-white via-indigo-100 to-white bg-clip-text text-transparent">
                     {teams.find(t => t.id === tournament.championTeamId)?.name}
                   </h2>
                </div>
                <div className="flex justify-center gap-6 text-amber-500/40">
                   <Sparkles size={24} /> <Award size={32} /> <Sparkles size={24} />
                </div>
             </div>
             <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 rotate-12 pointer-events-none"><Trophy size={150} /></div>
             <div className="absolute -bottom-10 -left-10 p-8 opacity-5 -rotate-12 pointer-events-none"><Crown size={200} /></div>
          </Card>
        </div>
      )}

      <div className="space-y-32">
        {rounds.map((round, rIdx) => {
          const isFinal = round.matches.length === 1;
          const isSemi = round.matches.length === 2;
          
          return (
            <div key={round.index} className={`space-y-10 animate-in slide-in-from-bottom-10 duration-700 delay-[${rIdx * 100}ms]`}>
              <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className={`absolute inset-0 blur-lg opacity-30 group-hover:opacity-60 transition-opacity ${isFinal ? 'bg-indigo-600' : 'bg-slate-900'}`}></div>
                    <span className={`relative px-6 py-2 rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] text-white shadow-xl ${isFinal ? 'bg-indigo-600' : 'bg-slate-900'}`}>
                      {isFinal ? '🏆 Final Bahsi' : isSemi ? '⚔️ Yarim Final' : `📦 Bosqich ${round.index + 1}`}
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-slate-200 via-slate-100 to-transparent"></div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                    <LayoutList size={12} className="text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{round.matches.length} o'yinlar</span>
                  </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {round.matches.map((match) => (
                  <div key={match.id} className="animate-in zoom-in-95 duration-500">
                    <MatchCard match={match} roundIdx={rIdx} />
                  </div>
                ))}
              </div>

              {rounds[rIdx + 1] && (
                 <div className="flex flex-col items-center gap-3 pt-4">
                    <div className="h-12 w-px bg-gradient-to-b from-slate-200 to-transparent"></div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 animate-bounce">
                      <ChevronDown size={18} />
                    </div>
                 </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
