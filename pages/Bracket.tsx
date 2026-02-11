
import React from 'react';
import { useTournamentStore } from '../store';
import { MatchCard } from '../features/MatchCard';
import { Button } from '../shared/ui/Button';
import { Card } from '../shared/ui/Card';
import { Badge } from '../shared/ui/Badge';
import { useNavigate } from 'react-router-dom';
import * as htmlToImage from 'html-to-image';
import { 
  Trophy, 
  ArrowRight, 
  Zap, 
  Swords,
  Dices,
  Image as ImageIcon,
  Download,
  Eye,
  X,
  Users,
  Undo2,
  ChevronLeft,
  Crown,
  Target,
  Layout,
  Maximize2,
  Share2,
  Sparkles,
  Layers
} from 'lucide-react';
import { Team, Round, Match, Tournament } from '../types';

type Stage = 'intro' | 'countdown' | 'picking_home' | 'ball_shaking_home' | 'revealing_home' | 'picking_away' | 'ball_shaking_away' | 'revealing_away' | 'match_slam' | 'summary';

const Particle: React.FC<{ color?: string }> = ({ color = "white" }) => {
  const x = Math.random() * 400 - 200;
  const y = Math.random() * 400 - 200;
  return (
    <div 
      className="absolute animate-particle rounded-full pointer-events-none"
      style={{ 
        width: Math.random() * 8 + 4 + 'px', 
        height: Math.random() * 8 + 4 + 'px', 
        backgroundColor: color,
        '--tw-translate-x': `${x}px`,
        '--tw-translate-y': `${y}px`
      } as any}
    />
  );
};

const DrawCeremony: React.FC<{ teams: Team[], onComplete: () => void, onCancel: () => void }> = ({ teams, onComplete, onCancel }) => {
  const [currentStage, setCurrentStage] = React.useState<Stage>('intro');
  const [countdown, setCountdown] = React.useState(3);
  const [matchResults, setMatchResults] = React.useState<Array<{ h: Team, a: Team | null }>>([]);
  const [currentPair, setCurrentPair] = React.useState<{ h: Team | null, a: Team | null }>({ h: null, a: null });
  const [particles, setParticles] = React.useState<number[]>([]);
  
  const pairs = React.useMemo(() => {
    const arr = [...teams].sort(() => Math.random() - 0.5);
    const p: Array<{ h: Team, a: Team | null }> = [];
    for (let i = 0; i < arr.length; i += 2) {
      p.push({ h: arr[i], a: arr[i + 1] || null });
    }
    return p;
  }, [teams]);

  const targetPair = pairs[matchResults.length];

  const triggerParticles = () => {
    setParticles(Array.from({ length: 15 }, (_, i) => Date.now() + i));
    setTimeout(() => setParticles([]), 1500);
  };

  React.useEffect(() => {
    if (currentStage === 'intro') {
        const t = setTimeout(() => setCurrentStage('countdown'), 1500);
        return () => clearTimeout(t);
    }
    
    if (currentStage === 'countdown') {
        if (countdown > 0) {
            const t = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(t);
        } else {
            setCurrentStage('picking_home');
        }
    }

    if (!targetPair && currentStage !== 'intro' && currentStage !== 'countdown' && currentStage !== 'summary') {
        setCurrentStage('summary');
        return;
    }

    const timings = { picking: 800, shaking: 1200, revealing: 1500, slam: 1200 };

    if (currentStage === 'picking_home') {
        const t = setTimeout(() => setCurrentStage('ball_shaking_home'), timings.picking);
        return () => clearTimeout(t);
    }
    if (currentStage === 'ball_shaking_home') {
        const t = setTimeout(() => {
            setCurrentStage('revealing_home');
            triggerParticles();
        }, timings.shaking);
        return () => clearTimeout(t);
    }
    if (currentStage === 'revealing_home') {
        if (!currentPair.h && targetPair) setCurrentPair({ h: targetPair.h, a: null });
        const t = setTimeout(() => {
            if (targetPair?.a) setCurrentStage('picking_away');
            else setCurrentStage('match_slam');
        }, timings.revealing);
        return () => clearTimeout(t);
    }
    if (currentStage === 'picking_away') {
        const t = setTimeout(() => setCurrentStage('ball_shaking_away'), timings.picking);
        return () => clearTimeout(t);
    }
    if (currentStage === 'ball_shaking_away') {
        const t = setTimeout(() => {
            setCurrentStage('revealing_away');
            triggerParticles();
        }, timings.shaking);
        return () => clearTimeout(t);
    }
    if (currentStage === 'revealing_away') {
        if (!currentPair.a && targetPair) setCurrentPair(prev => ({ ...prev, a: targetPair.a }));
        const t = setTimeout(() => setCurrentStage('match_slam'), timings.revealing);
        return () => clearTimeout(t);
    }
    if (currentStage === 'match_slam') {
        const t = setTimeout(() => {
            if (targetPair) setMatchResults(prev => [...prev, targetPair]);
            setCurrentPair({ h: null, a: null });
            setCurrentStage('picking_home');
        }, timings.slam);
        return () => clearTimeout(t);
    }
  }, [currentStage, countdown, matchResults.length, pairs, targetPair, currentPair.h, currentPair.a]);

  return (
    <div className={`fixed inset-0 z-[100] bg-[#020617] text-white flex flex-col items-center justify-center p-4 scanline-effect overflow-hidden transition-all duration-300 ${currentStage === 'match_slam' ? 'animate-screen-shake' : ''}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_#020617_70%)] opacity-60"></div>
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[800px] sm:h-[800px] border border-white/10 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
      </div>

      <button 
        onClick={onCancel} 
        className="absolute top-6 left-6 sm:top-10 sm:left-10 z-[110] flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/20 transition-all text-[10px] sm:text-xs font-black uppercase tracking-widest group"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> <span className="hidden xs:inline">Bekor qilish</span>
      </button>

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center gap-8 sm:gap-16 text-center">
         {currentStage === 'intro' && (
           <div className="animate-in zoom-in fade-in duration-700 space-y-4 sm:space-y-6">
             <Trophy size={60} className="sm:w-[100px] sm:h-[100px] mx-auto text-amber-400 animate-bounce" />
             <h2 className="text-4xl sm:text-6xl font-black uppercase italic tracking-tighter">TAYYORMISIZ?</h2>
           </div>
         )}

         {currentStage === 'countdown' && (
           <div key={countdown} className="animate-countdown">
              <span className="text-8xl sm:text-[12rem] font-black italic text-indigo-500 drop-shadow-[0_0_50px_rgba(79,70,229,0.8)]">
                {countdown > 0 ? countdown : 'GO!'}
              </span>
           </div>
         )}

         {(currentStage.startsWith('picking') || currentStage.startsWith('ball_shaking')) && (
           <div className="animate-in zoom-in fade-in duration-700 space-y-6 sm:space-y-10 relative">
             <div className="w-40 h-40 sm:w-64 sm:h-64 bg-slate-900 border-4 border-indigo-500/50 rounded-full mx-auto flex items-center justify-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-500/10 animate-pulse"></div>
                <Dices size={80} className={`text-indigo-400 z-10 sm:w-[120px] sm:h-[120px] ${currentStage.startsWith('ball_shaking') ? 'animate-ball-shake' : 'animate-spin'}`} />
             </div>
             <h2 className="text-2xl sm:text-4xl font-black uppercase italic tracking-[0.2em] animate-pulse">
                {currentStage.includes('home') ? 'UY EGASI...' : 'MEHMON...'}
             </h2>
           </div>
         )}

         {(currentStage.includes('revealing') || currentStage === 'match_slam') && (
            <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-16 relative">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 hidden sm:block">
                  <div className="w-20 h-20 bg-white rounded-full animate-burst"></div>
               </div>
               
               <div className={`flex-1 w-full flex flex-col items-center gap-4 sm:gap-6 animate-reveal z-10`}>
                  <div className={`w-full max-w-[280px] sm:w-64 h-32 sm:h-64 bg-slate-900 border-4 rounded-[1.5rem] sm:rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-4 sm:p-8 transition-all duration-500 ${currentPair.h ? 'border-emerald-500 bg-emerald-950/20' : 'border-indigo-500'}`}>
                     {currentPair.h ? (
                       <span className="text-2xl sm:text-4xl font-black uppercase italic tracking-tighter drop-shadow-md truncate w-full text-center px-2">{currentPair.h.name}</span>
                     ) : (
                       <div className="w-10 h-10 sm:w-20 sm:h-20 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
                     )}
                  </div>
               </div>

               <div className="shrink-0 z-20">
                  {currentStage === 'match_slam' ? (
                    <div className="animate-slam bg-white text-black px-8 py-3 sm:px-12 sm:py-6 text-4xl sm:text-8xl font-black italic shadow-[0_0_80px_#fff] -rotate-3 border-2 sm:border-4 border-black">VS</div>
                  ) : (
                    <div className="relative">
                       <Swords size={40} className="sm:w-[60px] sm:h-[60px] text-white/20 animate-pulse scale-150 rotate-12" />
                    </div>
                  )}
               </div>

               <div className={`flex-1 w-full flex flex-col items-center gap-4 sm:gap-6 transition-all duration-500 z-10 ${currentStage.includes('revealing_away') || currentStage === 'match_slam' ? 'opacity-100' : 'opacity-0 scale-90'}`}>
                  <div className={`w-full max-w-[280px] sm:w-64 h-32 sm:h-64 bg-slate-900 border-4 rounded-[1.5rem] sm:rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-4 sm:p-8 transition-all duration-500 ${currentPair.a || targetPair?.a === null ? 'border-rose-500 bg-rose-950/20' : 'border-indigo-500'}`}>
                     {currentPair.a ? (
                       <span className="text-2xl sm:text-4xl font-black uppercase italic tracking-tighter drop-shadow-md truncate w-full text-center px-2">{currentPair.a.name}</span>
                     ) : (
                       targetPair?.a === null ? (
                        <span className="text-2xl sm:text-4xl font-black uppercase italic tracking-tighter text-slate-500">BYE</span>
                       ) : (
                        <div className="w-10 h-10 sm:w-20 sm:h-20 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
                       )
                     )}
                  </div>
               </div>
               {particles.map(id => <Particle key={id} color={id % 2 === 0 ? '#4f46e5' : '#10b981'} />)}
            </div>
         )}

         {currentStage === 'summary' && (
            <div className="animate-in fade-in zoom-in duration-1000 w-full max-w-4xl space-y-6 sm:space-y-12 text-center p-4">
               <div className="relative inline-block">
                  <div className="absolute inset-0 bg-indigo-500 blur-[60px] opacity-30 animate-pulse"></div>
                  <h2 className="text-4xl sm:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter relative z-10">Qura Yakunlandi</h2>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto pr-2 scrollbar-hide">
                  {matchResults.map((m, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center justify-between font-bold italic uppercase tracking-tight text-xs sm:text-base">
                       <span className="truncate flex-1 text-left">{m.h.name}</span>
                       <span className="text-indigo-400 px-2 sm:px-4 shrink-0 italic">VS</span>
                       <span className="truncate flex-1 text-right">{m.a?.name || 'BYE'}</span>
                    </div>
                  ))}
               </div>
               <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                  <Button size="xl" onClick={onComplete} className="flex-1 h-16 sm:h-24 rounded-2xl sm:rounded-[2rem] bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl sm:text-3xl shadow-[0_20px_40px_rgba(79,70,229,0.4)] hover:scale-[1.02] transition-all">DAVOM ETISH</Button>
                  <Button variant="glass" size="xl" onClick={onCancel} className="px-10 h-16 sm:h-24 rounded-2xl sm:rounded-[2rem] font-bold text-lg sm:text-xl border-white/40">BEKOR QILISH</Button>
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

const RoadmapPoster: React.FC<{ tournament: Tournament, teams: Team[], rounds: Round[], id: string }> = ({ tournament, teams, rounds, id }) => {
  const getTeamName = (id: string | null) => teams.find(t => t.id === id)?.name || 'N/A';
  return (
    <div id={id} className="w-[1200px] h-[800px] bg-slate-950 p-12 text-white flex flex-col items-center justify-between relative overflow-hidden shrink-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_#020617_70%)] opacity-60"></div>
      
      {/* Improved Header to prevent overlapping */}
      <div className="relative z-10 text-center w-full flex flex-col items-center">
        <div className="flex items-center justify-center gap-8 mb-4">
          <Trophy className="text-amber-400 shrink-0" size={80} />
          <h1 className="text-8xl font-black uppercase italic tracking-tighter leading-[0.9] pr-4">
            {tournament.name}
          </h1>
        </div>
        <div className="h-1 w-48 bg-indigo-600/50 rounded-full mb-4"></div>
        <p className="text-indigo-400 font-bold uppercase tracking-[0.6em] text-2xl">
          Turnir Jadvali / Roadmap
        </p>
      </div>

      <div className="relative z-10 w-full flex-1 flex items-center justify-around gap-8 mt-12">
        {rounds.map((round, rIdx) => (
          <div key={rIdx} className="flex-1 flex flex-col gap-6">
            <h3 className="text-center text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-2">
              {round.matches.length === 1 ? 'FINAL' : round.matches.length === 2 ? 'SEMI-FINAL' : `ROUND ${rIdx + 1}`}
            </h3>
            {round.matches.map((match, mIdx) => (
              <div key={mIdx} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-2 relative">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className={`pr-2 truncate max-w-[150px] ${match.winnerTeamId === match.homeTeamId ? 'text-indigo-400' : ''}`}>{getTeamName(match.homeTeamId).toUpperCase()}</span>
                  <span className="text-white/20 shrink-0">{match.scoreHome ?? '-'}</span>
                </div>
                <div className="h-px bg-white/5"></div>
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className={`pr-2 truncate max-w-[150px] ${match.winnerTeamId === match.awayTeamId ? 'text-indigo-400' : ''}`}>{match.awayTeamId ? getTeamName(match.awayTeamId).toUpperCase() : 'BYE'}</span>
                  <span className="text-white/20 shrink-0">{match.scoreAway ?? '-'}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="relative z-10 w-full border-t border-white/10 pt-8 flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
        <span>EduCup Tournament Manager</span>
        <span>Generated: {new Date().toLocaleString()}</span>
      </div>
    </div>
  );
};

const SquadPoster: React.FC<{ team: Team, tournamentName: string, id: string }> = ({ team, tournamentName, id }) => {
  return (
    <div id={id} className="w-[800px] h-[1000px] bg-slate-900 p-16 text-white flex flex-col items-center justify-between relative overflow-hidden shrink-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#1e1b4b_0%,_#020617_80%)] opacity-60"></div>
      
      {/* Improved Header for Squad Poster */}
      <div className="relative z-10 text-center w-full flex flex-col items-center space-y-4">
        <p className="text-indigo-400 text-base font-black uppercase tracking-[0.5em]">{tournamentName}</p>
        <h1 className="text-8xl font-black uppercase italic tracking-tighter leading-[0.9] pr-4">
          {team.name}
        </h1>
        <div className="w-32 h-2 bg-indigo-600 rounded-full"></div>
      </div>

      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center space-y-8 mt-12">
        <div className="grid grid-cols-1 gap-4 w-full max-w-md">
          {team.players.map((player, idx) => (
            <div key={idx} className={`p-6 rounded-3xl border flex items-center justify-between font-black uppercase italic text-3xl transition-all shadow-xl pr-6
              ${player === team.captainName ? 'bg-amber-500 text-black border-amber-400 ring-4 ring-amber-500/20' : 'bg-white/5 border-white/10 text-white'}`}>
              <span className="truncate pr-4">{player}</span>
              {player === team.captainName && <Crown size={32} fill="currentColor" />}
            </div>
          ))}
        </div>
      </div>
      <div className="relative z-10 flex flex-col items-center gap-4">
        <Users size={48} className="text-indigo-500 opacity-20" />
        <p className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-500">Official Team Roster</p>
      </div>
    </div>
  );
};

export const Bracket: React.FC = () => {
  const { tournament, teams, rounds, startTournament, generateNextRound } = useTournamentStore();
  const [showCeremony, setShowCeremony] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'bracket' | 'gallery'>('bracket');
  const [exporting, setExporting] = React.useState<string | null>(null);
  const [previewData, setPreviewData] = React.useState<{ id: string, type: string, team?: Team } | null>(null);
  const [viewportScale, setViewportScale] = React.useState(1);
  const navigate = useNavigate();

  // Dynamic Scaling Effect
  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      const targetWidth = previewData?.type === 'roadmap' ? 1200 : 800;
      const targetHeight = previewData?.type === 'roadmap' ? 800 : 1000;
      
      const hPadding = width < 768 ? 40 : 120;
      const vPadding = width < 768 ? 200 : 250;
      
      const scaleW = (width - hPadding) / targetWidth;
      const scaleH = (height - vPadding) / targetHeight;
      
      const scale = Math.min(1, scaleW, scaleH);
      setViewportScale(scale);
    };

    if (previewData) {
      handleResize();
      window.addEventListener('resize', handleResize);
    }
    return () => window.removeEventListener('resize', handleResize);
  }, [previewData]);

  if (!tournament) return null;

  const downloadPoster = async (id: string, fileName: string) => {
    const node = document.getElementById(id);
    if (!node) return;
    setExporting(id);
    try {
      const originalLeft = node.style.left;
      const originalPosition = node.style.position;
      if (node.style.left === '-5000px') {
        node.style.left = '0';
        node.style.position = 'fixed';
      }
      const dataUrl = await htmlToImage.toPng(node, { 
        quality: 1, 
        pixelRatio: 2, 
        cacheBust: true,
        backgroundColor: '#020617'
      });
      node.style.left = originalLeft;
      node.style.position = originalPosition;
      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = dataUrl;
      link.click();
      setPreviewData(null);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Rasm tayyorlashda xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.');
    } finally {
      setExporting(null);
    }
  };

  if (showCeremony) return (
    <DrawCeremony 
      teams={teams} 
      onComplete={() => { setShowCeremony(false); startTournament(); }} 
      onCancel={() => setShowCeremony(false)}
    />
  );

  if (rounds.length === 0) {
    return (
      <div className="min-h-[70vh] sm:min-h-[85vh] w-full flex flex-col items-center justify-center py-6 sm:py-10 px-4 sm:px-6 relative overflow-hidden animate-in fade-in duration-700">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-indigo-500/5 blur-[80px] sm:blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-blue-500/5 blur-[80px] sm:blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center space-y-8 sm:space-y-12">
          <div className="relative flex flex-col items-center">
            <div className="absolute -top-12 inset-x-0 flex justify-center opacity-30">
               <div className="w-24 h-24 sm:w-32 sm:h-32 bg-indigo-600 rounded-full blur-3xl animate-pulse"></div>
            </div>
            <div className="relative w-16 h-16 sm:w-24 sm:h-24 bg-white rounded-2xl sm:rounded-3xl shadow-xl flex items-center justify-center text-indigo-600 mb-6 sm:mb-8 border border-slate-100 animate-sphere-float">
               <Zap size={32} className="sm:w-[48px] sm:h-[48px] drop-shadow-sm" fill="currentColor" />
            </div>
            <h1 className="text-3xl md:text-6xl font-black text-slate-900 uppercase italic tracking-tighter leading-tight mb-4 pr-2">
              Qura Marosimi <br /> 
              <span className="text-indigo-600">Tayyor!</span>
            </h1>
            <p className="text-slate-500 max-w-lg mx-auto font-bold text-xs sm:text-base uppercase tracking-widest leading-relaxed opacity-70 px-4">
              Barcha jamoalar ro'yxatdan o'tdi. Endi qura tashlash orqali raqiblarni aniqlash vaqti keldi.
            </p>
          </div>

          <Card className="w-full max-w-2xl bg-white/40 backdrop-blur-md border border-white/60 p-0 overflow-hidden shadow-2xl">
             <div className="bg-slate-900 text-white p-4 sm:p-6 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2 sm:gap-3">
                   <div className="p-1.5 sm:p-2 bg-indigo-600 rounded-lg">
                      <Layout size={14} className="sm:w-[18px] sm:h-[18px]" />
                   </div>
                   <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-widest italic pr-1">Konfiguratsiya</h3>
                </div>
                <Badge variant="indigo" size="xs" className="bg-indigo-500/20 text-indigo-200 border-indigo-400/30">Ready</Badge>
             </div>
             <div className="grid grid-cols-3 divide-x divide-slate-100">
                <div className="p-4 sm:p-8 flex flex-col items-center gap-1 sm:gap-2">
                   <Users className="text-slate-300 w-5 h-5 sm:w-6 sm:h-6" />
                   <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Jamoalar</span>
                   <span className="text-sm sm:text-2xl font-black italic">{teams.length} ta</span>
                </div>
                <div className="p-4 sm:p-8 flex flex-col items-center gap-1 sm:gap-2">
                   <Target className="text-slate-300 w-5 h-5 sm:w-6 sm:h-6" />
                   <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Format</span>
                   <span className="text-sm sm:text-2xl font-black italic">{tournament.playersPerTeam}×{tournament.playersPerTeam}</span>
                </div>
                <div className="p-4 sm:p-8 flex flex-col items-center gap-1 sm:gap-2">
                   <Trophy className="text-slate-300 w-5 h-5 sm:w-6 sm:h-6" />
                   <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Bosqichlar</span>
                   <span className="text-sm sm:text-2xl font-black italic">{Math.ceil(Math.log2(teams.length))} ta</span>
                </div>
             </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md pt-4 px-4">
             <Button size="xl" onClick={() => setShowCeremony(true)} className="w-full h-16 sm:h-20 rounded-[1.2rem] sm:rounded-[1.8rem] text-sm sm:text-xl font-black shadow-[0_20px_40px_rgba(79,70,229,0.2)] hover:scale-[1.03] transition-all group overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                MAROSIMNI BOSHLASH
             </Button>
             <Button variant="secondary" size="xl" onClick={() => navigate('/teams')} className="w-full sm:px-10 h-16 sm:h-20 rounded-[1.2rem] sm:rounded-[1.8rem] font-bold text-slate-500 border-slate-200 bg-white/80 hover:bg-slate-50">
                <Undo2 size={18} className="mr-2 sm:w-[20px] sm:h-[20px]" /> TAHRIRLASH
             </Button>
          </div>
        </div>
      </div>
    );
  }

  const lastRound = rounds[rounds.length - 1];
  const allMatchesFinished = lastRound.matches.every(m => m.winnerTeamId);
  const isFinalFinished = lastRound.matches.length === 1 && allMatchesFinished;

  return (
    <div className="space-y-8 sm:space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
         <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight italic pr-2">EduCup Jadval</h1>
            <p className="text-[10px] sm:text-sm text-slate-500 font-bold uppercase tracking-[0.2em] opacity-70">Turnir bosqichlari va grafik vizuallar.</p>
         </div>
         <div className="flex bg-slate-100 p-1 rounded-xl sm:p-1.5 sm:rounded-2xl gap-1">
            <button onClick={() => setActiveTab('bracket')} className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all ${activeTab === 'bracket' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
              <Layers size={14} className="sm:w-[16px] sm:h-[16px]" /> JADVAL
            </button>
            <button onClick={() => setActiveTab('gallery')} className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all ${activeTab === 'gallery' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
              <ImageIcon size={14} className="sm:w-[16px] sm:h-[16px]" /> GALEREYA
            </button>
         </div>
      </header>

      {activeTab === 'bracket' ? (
        <div className="space-y-10 sm:space-y-12 animate-in fade-in duration-500">
          {!isFinalFinished && (
            <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200 shadow-sm gap-4 sm:gap-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 blur-[40px] -mr-16 -mt-16"></div>
               <div className="flex items-center gap-4 relative z-10 w-full sm:w-auto">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 shrink-0">
                    <Zap size={20} className="sm:w-[24px] sm:h-[24px]" fill="currentColor" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-slate-900 uppercase italic pr-1">Keyingi bosqich</h4>
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">G'oliblar pairingi</p>
                  </div>
               </div>
               <Button disabled={!allMatchesFinished} onClick={generateNextRound} className="w-full sm:w-auto rounded-xl sm:rounded-2xl px-8 sm:px-12 h-12 sm:h-16 font-black text-xs sm:text-sm tracking-widest shadow-xl shadow-indigo-50">
                  GENERATSIYA <ArrowRight size={16} className="ml-2 sm:w-[18px] sm:h-[18px]" />
               </Button>
            </div>
          )}
          {rounds.map((round, rIdx) => (
            <div key={rIdx} className="space-y-6 sm:space-y-8">
               <div className="flex items-center gap-4">
                  <h3 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-indigo-600 bg-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full border border-slate-100 shadow-sm italic pr-4">
                    {round.matches.length === 1 ? 'FINAL BOSQICHI' : round.matches.length === 2 ? 'YARIM FINALLAR' : `BOSQICH ${rIdx + 1}`}
                  </h3>
                  <div className="flex-1 h-px bg-slate-200"></div>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {round.matches.map(m => <MatchCard key={m.id} match={m} roundIdx={rIdx} />)}
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="group relative bg-slate-900 rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden aspect-[4/5] shadow-2xl transition-all hover:scale-[1.02] active:scale-95 border-2 sm:border-4 border-transparent hover:border-indigo-500">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10"></div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
              <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-20">
                 <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/20 text-white shadow-xl">
                    <Sparkles size={16} className="sm:w-[24px] sm:h-[24px]" />
                 </div>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-10 text-center z-20">
                 <div className="w-16 h-16 sm:w-24 sm:h-24 bg-indigo-600/20 backdrop-blur-xl rounded-full flex items-center justify-center mb-4 sm:mb-8 border border-indigo-500/30 group-hover:scale-110 transition-transform duration-500">
                    <Trophy className="text-indigo-400 w-8 h-8 sm:w-12 sm:h-12" />
                 </div>
                 <h4 className="text-white text-2xl sm:text-4xl font-black uppercase italic tracking-tighter leading-none mb-2 sm:mb-4 pr-2 text-center">ROADMAP<br/><span className="text-indigo-500">POSTER</span></h4>
                 <p className="text-slate-400 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-6 sm:mb-10 max-w-[200px] leading-relaxed text-center">HD formatdagi turnir jadvali</p>
                 <div className="flex gap-2 sm:gap-3 w-full mt-auto">
                    <button 
                      onClick={() => setPreviewData({ id: 'roadmap-poster-export', type: 'roadmap' })}
                      className="flex-1 h-10 sm:h-14 bg-white text-slate-900 rounded-lg sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase italic tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-500 hover:text-white transition-all shadow-xl pr-1"
                    >
                       <Eye size={14} className="sm:w-[18px] sm:h-[18px]" /> KO'RISH
                    </button>
                    <button 
                      onClick={() => downloadPoster('roadmap-poster-export', 'tournament_roadmap')}
                      className="w-10 h-10 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-md text-white rounded-lg sm:rounded-2xl flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all"
                    >
                       <Download size={16} className="sm:w-[20px] sm:h-[20px]" />
                    </button>
                 </div>
              </div>
           </div>

           {teams.map((team, idx) => (
             <div key={idx} className="group relative bg-slate-800 rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden aspect-[4/5] shadow-xl transition-all hover:scale-[1.02] active:scale-95 border-2 sm:border-4 border-transparent hover:border-emerald-500">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-800/40 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-5"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-10 text-center z-20">
                   <div className="w-14 h-14 sm:w-20 sm:h-20 bg-emerald-600/20 backdrop-blur-xl rounded-xl sm:rounded-[2rem] flex items-center justify-center mb-4 sm:mb-8 border border-emerald-500/30 group-hover:scale-110 transition-transform duration-500">
                      <Users className="text-emerald-400 w-8 h-8 sm:w-10 sm:h-10" />
                   </div>
                   <h4 className="text-white text-xl sm:text-3xl font-black uppercase italic tracking-tighter leading-none mb-2 sm:mb-4 truncate w-full px-2 pr-3 text-center">{team.name}</h4>
                   <p className="text-slate-400 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-6 sm:mb-10 text-center">Jamoa tarkibi posteri</p>
                   <div className="flex gap-2 sm:gap-3 w-full mt-auto">
                      <button 
                        onClick={() => setPreviewData({ id: `squad-export-${team.id}`, type: 'squad', team })}
                        className="flex-1 h-10 sm:h-14 bg-white text-slate-900 rounded-lg sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase italic tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-500 hover:text-white transition-all shadow-xl pr-1"
                      >
                         <Eye size={14} className="sm:w-[18px] sm:h-[18px]" /> KO'RISH
                      </button>
                      <button 
                        onClick={() => downloadPoster(`squad-export-${team.id}`, `squad_${team.name}`)}
                        className="w-10 h-10 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-md text-white rounded-lg sm:rounded-2xl flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all"
                      >
                         <Download size={16} className="sm:w-[20px] sm:h-[20px]" />
                      </button>
                   </div>
                </div>
             </div>
           ))}
        </div>
      )}

      <div className="fixed left-[-5000px] top-0 pointer-events-none">
         <RoadmapPoster tournament={tournament} teams={teams} rounds={rounds} id="roadmap-poster-export" />
         {teams.map(team => (
            <SquadPoster key={team.id} team={team} tournamentName={tournament.name} id={`squad-export-${team.id}`} />
         ))}
      </div>

      {previewData && (
        <div className="fixed inset-0 z-[150] bg-slate-950/98 backdrop-blur-2xl flex flex-col animate-in fade-in duration-300">
           <div className="h-16 sm:h-20 bg-slate-900/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 sm:px-8 shrink-0">
              <div className="flex items-center gap-3 sm:gap-5">
                 <button onClick={() => setPreviewData(null)} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white/5 hover:bg-rose-500/20 text-white rounded-lg sm:rounded-xl transition-all border border-white/10 group">
                    <X size={16} className="sm:w-[20px] sm:h-[20px] group-hover:scale-110 transition-transform" />
                 </button>
                 <div className="h-6 sm:h-8 w-px bg-white/10"></div>
                 <div className="min-w-0">
                    <h3 className="text-sm sm:text-lg font-black text-white uppercase italic tracking-tight leading-none truncate pr-1">{previewData.type === 'roadmap' ? 'ROADMAP' : 'SQUAD'}</h3>
                    <p className="text-[7px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 truncate">{previewData.team?.name || tournament.name}</p>
                 </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                 <div className="hidden xs:flex items-center gap-2 px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20 text-[7px] font-black uppercase tracking-widest whitespace-nowrap">
                    <Sparkles size={8} /> HQ Rendering
                 </div>
                 <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white rounded-lg sm:rounded-xl transition-all border border-white/10 shrink-0">
                    <Share2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                 </button>
              </div>
           </div>

           <div className="flex-1 overflow-auto p-4 sm:p-12 scrollbar-hide flex items-center justify-center cursor-zoom-out" onClick={() => setPreviewData(null)}>
              <div 
                className="relative shadow-[0_50px_100px_rgba(0,0,0,0.5)] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden animate-in zoom-in duration-500 transition-all cursor-default"
                style={{ transform: `scale(${viewportScale})`, transformOrigin: 'center center' }}
                onClick={(e) => e.stopPropagation()}
              >
                 <div className="flex items-center justify-center bg-slate-900 border-4 border-white/5 rounded-[inherit]">
                    {previewData.type === 'roadmap' ? (
                       <RoadmapPoster tournament={tournament} teams={teams} rounds={rounds} id="roadmap-preview-internal" />
                    ) : (
                       <SquadPoster team={previewData.team!} tournamentName={tournament.name} id="squad-preview-internal" />
                    )}
                 </div>
                 
                 {exporting && (
                   <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center z-50 text-white p-10">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <h4 className="text-lg sm:text-xl font-black italic uppercase tracking-tighter">RENDER QILINMOQDA...</h4>
                   </div>
                 )}
              </div>
           </div>

           <div className="h-24 sm:h-28 bg-slate-900/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-center px-4 sm:px-8 shrink-0">
              <div className="flex gap-2 sm:gap-3 w-full max-w-lg">
                 <Button 
                   size="lg" 
                   className="flex-1 h-12 sm:h-14 rounded-xl sm:rounded-2xl text-[10px] sm:text-sm font-black shadow-2xl shadow-indigo-500/20 relative group overflow-hidden tracking-widest uppercase italic pr-2" 
                   onClick={() => downloadPoster(previewData.id, `${previewData.type}_${previewData.team?.name || 'tournament'}`)} 
                   loading={exporting !== null}
                 >
                    <Download size={16} className="mr-2 sm:mr-3 sm:w-[20px] sm:h-[20px]" /> PNG YUKLASH
                 </Button>
                 <Button 
                   variant="glass" 
                   size="lg" 
                   className="px-6 sm:px-8 h-12 sm:h-14 rounded-xl sm:rounded-2xl font-black text-[9px] sm:text-xs uppercase italic border-white/10 hover:bg-white/5 tracking-widest" 
                   onClick={() => setPreviewData(null)}
                 >
                    YOPISH
                 </Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
