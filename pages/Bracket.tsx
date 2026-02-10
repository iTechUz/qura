
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
  Swords
} from 'lucide-react';
import { Team } from '../types';

// Dramatik qur'a animatsiyasi uchun maxsus komponent
const DrawCeremony: React.FC<{ teams: Team[], onComplete: () => void }> = ({ teams, onComplete }) => {
  const [stage, setStage] = React.useState<'shaking' | 'revealing' | 'finished'>('shaking');
  const [pairs, setPairs] = React.useState<Array<{ h: Team, a: Team | null }>>([]);
  const [currentPairIndex, setCurrentPairIndex] = React.useState(-1);

  // Shuffled teams logic
  const shuffleTeams = React.useMemo(() => {
    const arr = [...teams].sort(() => Math.random() - 0.5);
    const p: Array<{ h: Team, a: Team | null }> = [];
    for (let i = 0; i < arr.length; i += 2) {
      p.push({ h: arr[i], a: arr[i + 1] || null });
    }
    return p;
  }, [teams]);

  React.useEffect(() => {
    if (stage === 'shaking') {
      const timer = setTimeout(() => {
        setStage('revealing');
        setCurrentPairIndex(0);
      }, 2500); // 2.5 sekund silkichlash
      return () => clearTimeout(timer);
    }

    if (stage === 'revealing' && currentPairIndex >= 0) {
      if (currentPairIndex < shuffleTeams.length) {
        const timer = setTimeout(() => {
          setPairs(prev => [...prev, shuffleTeams[currentPairIndex]]);
          setCurrentPairIndex(prev => prev + 1);
        }, 1500); // Har bir juftlik uchun 1.5 sekund dramatik pauza
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => setStage('finished'), 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [stage, currentPairIndex, shuffleTeams]);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950"></div>
      
      {stage === 'shaking' && (
        <div className="relative z-10 text-center space-y-8 animate-in zoom-in duration-500">
           <div className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.5)] animate-shaker mx-auto">
              <RefreshCcw size={48} className="text-white animate-spin duration-1000" />
           </div>
           <div className="space-y-2">
              <h2 className="text-2xl font-black text-white uppercase tracking-[0.3em] animate-pulse">Qur'a Tashlanmoqda...</h2>
              <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest">Jamoalar tasodifiy tartibda ajratilmoqda</p>
           </div>
        </div>
      )}

      {stage === 'revealing' && (
        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-8">
           <div className="flex items-center gap-4 text-white/20">
              <div className="h-px w-24 bg-current"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Matching Sequence</span>
              <div className="h-px w-24 bg-current"></div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {pairs.map((pair, idx) => (
                <div key={idx} className="animate-ball-pop">
                  <Card className="bg-white/5 border-white/10 p-4 backdrop-blur-sm overflow-hidden relative group">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 flex items-center gap-3 animate-slide-left">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs">
                          {pair.h.name.charAt(0)}
                        </div>
                        <span className="text-white font-black text-sm truncate">{pair.h.name.toUpperCase()}</span>
                      </div>

                      <div className="shrink-0 flex flex-col items-center">
                         <Swords size={16} className="text-indigo-400 mb-1" />
                         <span className="text-[8px] font-black text-white/30 tracking-widest uppercase">vs</span>
                      </div>

                      <div className={`flex-1 flex items-center justify-end gap-3 ${pair.a ? 'animate-slide-right' : ''}`}>
                        <span className="text-white font-black text-sm truncate text-right">
                          {pair.a ? pair.a.name.toUpperCase() : 'SARALASHDAN OZOD'}
                        </span>
                        <div className={`w-8 h-8 rounded-lg ${pair.a ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white/40'} flex items-center justify-center font-black text-xs`}>
                          {pair.a ? pair.a.name.charAt(0) : '-'}
                        </div>
                      </div>
                    </div>
                    {/* Flash effect on reveal */}
                    <div className="absolute inset-0 bg-white pointer-events-none animate-flash opacity-0"></div>
                  </Card>
                </div>
              ))}
           </div>

           {currentPairIndex < shuffleTeams.length && (
              <div className="flex items-center gap-2 text-indigo-400 animate-bounce">
                 <Zap size={14} fill="currentColor" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Navbatdagi Juftlik...</span>
              </div>
           )}
        </div>
      )}

      {stage === 'finished' && (
        <div className="relative z-10 text-center space-y-12 animate-in fade-in zoom-in duration-700">
           <div className="space-y-4">
             <div className="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center text-white mx-auto shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                <ShieldCheck size={40} />
             </div>
             <h2 className="text-4xl font-black text-white tracking-tighter italic">QUR'A YAKUNLANDI!</h2>
             <p className="text-slate-400 text-sm font-medium">Musobaqa boshlanishiga barcha narsa tayyor.</p>
           </div>
           
           <Button size="lg" onClick={onComplete} className="px-12 rounded-2xl bg-white text-indigo-600 hover:bg-slate-100 border-none shadow-2xl">
              Turnirni Ko'rish <ArrowRight size={20} className="ml-2" />
           </Button>
        </div>
      )}
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

  const handleStartWithCeremony = () => {
    setShowCeremony(true);
  };

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
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-100">
            <Zap size={32} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Qur'a Tashlash</h1>
          <p className="text-slate-500 text-sm font-medium">Tizim ishtirokchilarni tasodifiy tartibda juftlarga ajratib beradi.</p>
        </div>
        
        {!canStart ? (
          <div className="w-full max-w-md p-6 bg-white border border-rose-100 rounded-2xl shadow-sm space-y-6">
             <div className="flex items-center gap-3 text-rose-600 justify-center">
                <AlertTriangle size={20} />
                <span className="font-bold uppercase tracking-widest text-[10px]">Tayyorgarlik to'liq emas</span>
             </div>
             <div className="space-y-3 text-left">
               {teams.length < 2 && (
                 <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">1</span>
                    Kamida 2 ta jamoa qo'shing
                 </p>
               )}
               {incompleteTeams.length > 0 && (
                 <div className="space-y-2">
                   <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">2</span>
                      Ayrim jamoalar tarkibi to'liq emas:
                   </p>
                   <div className="grid grid-cols-2 gap-2 pl-7">
                      {incompleteTeams.map(t => (
                        <span key={t.id} className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded truncate">
                           {t.name} ({t.players.length}/{tournament.playersPerTeam})
                        </span>
                      ))}
                   </div>
                 </div>
               )}
             </div>
             <Button variant="secondary" size="md" className="w-full rounded-xl" onClick={() => navigate('/teams')}>
                <Users size={16} className="mr-2" /> Tarkibni to'ldirish
             </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <Button size="lg" onClick={handleStartWithCeremony} className="px-12 rounded-2xl shadow-xl hover:-translate-y-1 transition-all">
              <LayoutList size={20} className="mr-2" /> Qur'ani Boshlash
            </Button>
            <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest flex items-center gap-2">
               <ShieldCheck size={14} /> Hamma ma'lumotlar tayyor
            </p>
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
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">O'yinlar Jadvali</h1>
         </div>
         <div className="flex gap-2">
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
                   className={`rounded-xl font-bold px-6 ${allMatchesFinished ? 'animate-bounce shadow-lg shadow-green-100 bg-green-600' : ''}`}
               >
                   {allMatchesFinished ? 'Keyingi Bosqich' : 'O'yinlar davom etmoqda'} <ArrowRight size={16} className="ml-2" />
               </Button>
            )}
         </div>
      </header>

      {tournament.championTeamId && (
        <div className="max-w-2xl mx-auto">
          <Card className="bg-slate-900 text-white border-none p-0 overflow-hidden relative" variant="premium">
             <div className="p-8 text-center relative z-10 space-y-6">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-md border border-white/10">
                   <Trophy size={32} className="text-amber-400" />
                </div>
                <div className="space-y-1">
                   <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-[0.3em]">Mutlaq G'olib</p>
                   <h2 className="text-4xl font-black italic tracking-tighter">
                     {teams.find(t => t.id === tournament.championTeamId)?.name.toUpperCase()}
                   </h2>
                </div>
                <div className="flex justify-center gap-4 text-amber-500 opacity-50">
                   <Sparkles size={20} /> <Award size={24} /> <Sparkles size={20} />
                </div>
             </div>
             <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 rotate-12"><Trophy size={150} /></div>
          </Card>
        </div>
      )}

      <div className="space-y-24">
        {rounds.map((round, rIdx) => {
          const isFinal = round.matches.length === 1;
          const isSemi = round.matches.length === 2;
          
          return (
            <div key={round.index} className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${isFinal ? 'bg-indigo-600' : 'bg-slate-900'}`}>
                    {isFinal ? '🏆 Final Bahsi' : isSemi ? '⚔️ Yarim Final' : `📦 Bosqich ${round.index + 1}`}
                  </span>
                  <div className="flex-1 h-px bg-slate-200"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{round.matches.length} matches</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {round.matches.map((match) => (
                  <MatchCard key={match.id} match={match} roundIdx={rIdx} />
                ))}
              </div>

              {rounds[rIdx + 1] && (
                 <div className="flex flex-col items-center gap-2 text-slate-200">
                    <div className="h-8 w-px bg-slate-200"></div>
                    <ChevronDown size={16} />
                 </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
