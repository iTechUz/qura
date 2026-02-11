
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
  ShieldCheck, 
  Zap, 
  Swords,
  Dices,
  Image as ImageIcon,
  Download,
  Eye,
  Check,
  X,
  Users,
  Flame,
  Calendar,
  Undo2,
  ChevronLeft
} from 'lucide-react';
import { Team, Round, Match } from '../types';

type Stage = 'intro' | 'picking_home' | 'ball_shaking_home' | 'revealing_home' | 'picking_away' | 'ball_shaking_away' | 'revealing_away' | 'match_slam' | 'summary';

const DrawCeremony: React.FC<{ teams: Team[], onComplete: () => void, onCancel: () => void }> = ({ teams, onComplete, onCancel }) => {
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
    const timings = { picking: 1200, shaking: 1000, revealing: 1200, slam: 1200 };
    if (currentStage === 'picking_home') {
        const t = setTimeout(() => setCurrentStage('ball_shaking_home'), timings.picking);
        return () => clearTimeout(t);
    }
    if (currentStage === 'ball_shaking_home') {
        const t = setTimeout(() => setCurrentStage('revealing_home'), timings.shaking);
        return () => clearTimeout(t);
    }
    if (currentStage === 'revealing_home') {
        setCurrentPair({ h: targetPair.h, a: null });
        const t = setTimeout(() => {
            if (targetPair.a) setCurrentStage('picking_away');
            else setCurrentStage('match_slam');
        }, timings.revealing);
        return () => clearTimeout(t);
    }
    if (currentStage === 'picking_away') {
        const t = setTimeout(() => setCurrentStage('ball_shaking_away'), timings.picking);
        return () => clearTimeout(t);
    }
    if (currentStage === 'ball_shaking_away') {
        const t = setTimeout(() => setCurrentStage('revealing_away'), timings.shaking);
        return () => clearTimeout(t);
    }
    if (currentStage === 'revealing_away') {
        setCurrentPair(prev => ({ ...prev, a: targetPair.a }));
        const t = setTimeout(() => setCurrentStage('match_slam'), timings.revealing);
        return () => clearTimeout(t);
    }
    if (currentStage === 'match_slam') {
        const t = setTimeout(() => {
            setMatchResults(prev => [...prev, targetPair]);
            setCurrentPair({ h: null, a: null });
            setRemainingTeams(prev => prev.filter(t => t.id !== targetPair.h.id && (targetPair.a ? t.id !== targetPair.a.id : true)));
            setCurrentStage('picking_home');
        }, timings.slam);
        return () => clearTimeout(t);
    }
  }, [currentStage, matchResults.length, pairs]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#020617] text-white flex flex-col items-center justify-center p-4 scanline-effect overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_#020617_70%)] opacity-60"></div>
      
      <button 
        onClick={onCancel} 
        className="absolute top-10 left-10 z-[110] flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/20 transition-all text-xs font-black uppercase tracking-widest group"
      >
        <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" /> Ortga qaytish
      </button>

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center gap-16 text-center">
         {(currentStage.startsWith('picking') || currentStage === 'intro' || currentStage.startsWith('ball_shaking')) && (
           <div className="animate-in zoom-in fade-in duration-700 space-y-10">
             <div className="w-56 h-56 bg-slate-900 border-2 border-indigo-500/50 rounded-full mx-auto flex items-center justify-center shadow-2xl relative">
                <Dices size={100} className={`text-indigo-400 ${currentStage.startsWith('ball_shaking') ? 'animate-ball-shake' : 'animate-spin'}`} style={{ animationDuration: currentStage.startsWith('ball_shaking') ? '0.5s' : '4s' }} />
             </div>
             <h2 className="text-4xl font-black uppercase italic tracking-tighter">QURA BOSHLANMOQDA</h2>
           </div>
         )}
         {(currentStage.includes('revealing') || currentStage === 'match_slam') && (
            <div className="w-full flex items-center justify-center gap-16">
               <div className={`flex-1 flex flex-col items-center gap-6 animate-reveal`}>
                  <div className="w-64 h-64 bg-slate-900 border-4 border-indigo-500 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-8">
                     <span className="text-3xl font-black uppercase italic truncate w-full">{currentPair.h?.name}</span>
                  </div>
               </div>
               <div className="shrink-0">
                  {currentStage === 'match_slam' ? <div className="animate-slam bg-white text-black px-8 py-4 text-7xl font-black italic shadow-[0_0_40px_#fff]">VS</div> : <Swords size={48} className="text-white/20 animate-pulse scale-150" />}
               </div>
               <div className={`flex-1 flex flex-col items-center gap-6 transition-opacity duration-500 ${currentPair.a ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="w-64 h-64 bg-slate-900 border-4 border-indigo-500 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-8">
                     <span className="text-3xl font-black uppercase italic truncate w-full">{currentPair.a?.name || 'BYE'}</span>
                  </div>
               </div>
            </div>
         )}
         {currentStage === 'summary' && (
            <div className="animate-in fade-in zoom-in duration-1000 w-full max-w-4xl space-y-12 text-center">
               <h2 className="text-6xl font-black italic uppercase tracking-tighter">Qura Yakunlandi</h2>
               <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" onClick={onComplete} className="flex-1 h-24 rounded-[2rem] bg-white text-indigo-950 font-black text-3xl shadow-2xl">DAVOM ETISH</Button>
                  <Button variant="glass" size="lg" onClick={onCancel} className="px-10 h-24 rounded-[2rem] font-bold text-xl border-white/40">BEKOR QILISH</Button>
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

// PROFESSIONAL TOURNAMENT BRACKET POSTER (Soccer Field Aesthetic)
const RoadmapPoster: React.FC<{ tournament: any, teams: Team[], rounds: Round[], id: string }> = ({ tournament, teams, rounds, id }) => {
  const getTeamName = (id: string | null) => teams.find(t => t.id === id)?.name || '';

  return (
    <div 
      id={id} 
      className="w-[1280px] h-[800px] bg-[#065f46] flex flex-col items-center relative overflow-hidden text-white font-['Plus_Jakarta_Sans',_sans-serif]"
    >
      {/* Background Sunburst Effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ background: 'conic-gradient(from 180deg at 50% 110%, transparent 0deg, rgba(255,255,255,0.3) 10deg, transparent 20deg, rgba(255,255,255,0.3) 30deg, transparent 40deg, rgba(255,255,255,0.3) 50deg, transparent 60deg, rgba(255,255,255,0.3) 70deg, transparent 80deg, rgba(255,255,255,0.3) 90deg, transparent 100deg, rgba(255,255,255,0.3) 110deg, transparent 120deg, rgba(255,255,255,0.3) 130deg, transparent 140deg, rgba(255,255,255,0.3) 150deg, transparent 160deg, rgba(255,255,255,0.3) 170deg, transparent 180deg)' }}>
      </div>

      {/* Field Grass Texture Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/grass.png')]"></div>
      
      {/* Field Arc (Bottom) */}
      <div className="absolute -bottom-[200px] w-[1400px] h-[400px] bg-emerald-950/40 rounded-[100%] border-t-8 border-white/10"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Header */}
        <header className="pt-12 text-center">
           <h1 className="text-7xl font-[800] tracking-[0.1em] uppercase italic drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
              TOURNAMENT BRACKET
           </h1>
           <p className="mt-2 text-xl font-bold tracking-[0.5em] text-emerald-200 uppercase opacity-80">
              {tournament.name} • SEASON {new Date().getFullYear()}
           </p>
        </header>

        {/* Dynamic Bracket with Connections */}
        <main className="flex-1 flex items-center justify-between px-16 pb-12 gap-0 relative">
          {rounds.map((round, rIdx) => {
            const matchesCount = round.matches.length;
            const columnWidth = 240; 
            
            return (
              <React.Fragment key={rIdx}>
                {/* Round Column */}
                <div className="flex flex-col justify-around h-full relative z-20" style={{ width: columnWidth }}>
                  {round.matches.map((match, mIdx) => {
                    const isWinnerHome = match.winnerTeamId === match.homeTeamId;
                    const isWinnerAway = match.winnerTeamId === match.awayTeamId;
                    
                    return (
                      <div key={mIdx} className="relative flex items-center justify-center">
                         {/* Match Box */}
                         <div className="w-52 bg-slate-100 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl flex flex-col text-slate-900">
                            <div className={`px-4 py-2.5 border-b border-slate-200 flex justify-between items-center ${isWinnerHome ? 'bg-emerald-100 ring-2 ring-emerald-500 ring-inset' : 'bg-white'}`}>
                               <span className={`text-[13px] font-[800] uppercase truncate w-32 ${isWinnerHome ? 'text-emerald-700' : 'text-slate-800'}`}>{getTeamName(match.homeTeamId)}</span>
                               <span className="text-[13px] font-black text-slate-400">{match.status === 'finished' ? (match.scoreHome ?? '-') : '-'}</span>
                            </div>
                            <div className={`px-4 py-2.5 flex justify-between items-center ${isWinnerAway ? 'bg-emerald-100 ring-2 ring-emerald-500 ring-inset' : 'bg-white'}`}>
                               <span className={`text-[13px] font-[800] uppercase truncate w-32 ${isWinnerAway ? 'text-emerald-700' : 'text-slate-800'}`}>{getTeamName(match.awayTeamId) || 'BYE'}</span>
                               <span className="text-[13px] font-black text-slate-400">{match.status === 'finished' ? (match.scoreAway ?? '-') : '-'}</span>
                            </div>
                         </div>

                         {/* Mantiqiy bog'lovchi chiziqlar (Brackets Logic) */}
                         {rIdx < rounds.length - 1 && (
                            <div className="absolute left-[208px] w-[32px] h-full flex items-center">
                               {/* O'yindan chiquvchi gorizontal chiziq */}
                               <div className="absolute left-0 top-1/2 w-full h-[2px] bg-emerald-300 -translate-y-1/2"></div>
                               
                               {/* Vertikal chiziq va keyingi bosqichga kirish (Faqat har 2 tadan 1-o'yinda ko'rsatiladi) */}
                               {mIdx % 2 === 0 && (
                                  <div className="absolute left-full top-1/2 w-[2px] bg-emerald-300" style={{ height: `calc(${100 / (matchesCount/2)}%)` }}>
                                     {/* Keyingi bosqichga kiruvchi gorizontal chiziq */}
                                     <div className="absolute top-1/2 left-0 w-[16px] h-[2px] bg-emerald-300"></div>
                                  </div>
                               )}
                            </div>
                         )}
                      </div>
                    );
                  })}
                </div>
              </React.Fragment>
            );
          })}

          {/* Champion Section */}
          <div className="flex flex-col items-center justify-center pl-10 relative">
             <div className="relative group">
                <div className="absolute inset-0 bg-amber-400 blur-[80px] opacity-40 animate-pulse"></div>
                <div className="w-52 h-52 bg-amber-400 border-[8px] border-white rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center relative z-10 rotate-3 transition-transform hover:rotate-0">
                   <Trophy size={90} className="text-amber-900 drop-shadow-lg mb-2" />
                   <span className="text-[11px] font-black text-amber-900 uppercase tracking-widest">CHAMPION</span>
                   <h4 className="mt-1 text-2xl font-black text-amber-950 px-4 text-center leading-none truncate w-full uppercase">
                      {tournament.championTeamId ? getTeamName(tournament.championTeamId) : '???'}
                   </h4>
                </div>
             </div>
          </div>
        </main>

        {/* Footer Area */}
        <footer className="h-28 flex items-center justify-between px-16 relative">
           <div className="flex flex-col">
              <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest opacity-50">Tournament System</span>
              <span className="text-2xl font-black italic">@EduCupManager</span>
           </div>
           
           <div className="absolute left-1/2 -translate-x-1/2 -top-12">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/d/d3/Soccerball.svg" 
                alt="ball" 
                className="w-32 h-32 drop-shadow-[0_20px_20px_rgba(0,0,0,0.6)]"
              />
           </div>

           <div className="text-right flex flex-col">
              <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest opacity-50">Official Report</span>
              <span className="text-2xl font-black italic">{new Date().toLocaleDateString('uz-UZ')}</span>
           </div>
        </footer>
      </div>
    </div>
  );
};

// SQUAD POSTER TEMPLATE
const SquadPoster: React.FC<{ team: Team, tournamentName: string, id: string }> = ({ team, tournamentName, id }) => (
  <div 
    id={id} 
    className="w-[1080px] h-[1080px] bg-slate-950 p-20 flex flex-col items-center relative overflow-hidden text-white font-['Plus_Jakarta_Sans',_sans-serif]"
  >
     <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#1e1b4b_0%,_#020617_70%)]"></div>
     <header className="relative z-10 text-center mb-16">
        <Badge variant="indigo" className="mb-6 px-6 py-2 rounded-full text-lg">Official Squad</Badge>
        <h1 className="text-8xl font-black italic tracking-tighter uppercase mb-4">{team.name}</h1>
        <p className="text-2xl font-bold text-indigo-400 tracking-[0.4em] uppercase opacity-80">{tournamentName}</p>
     </header>
     <main className="relative z-10 w-full flex-1 flex flex-col justify-center gap-6">
        {team.players.map((p, i) => (
          <div key={i} className="flex items-center gap-8 bg-white/5 border border-white/10 p-6 rounded-[2rem]">
             <span className="text-3xl font-black text-indigo-500 opacity-40 italic">{(i + 1).toString().padStart(2, '0')}</span>
             <span className="text-4xl font-black uppercase tracking-tight">{p} {team.captainName === p ? '★' : ''}</span>
          </div>
        ))}
     </main>
  </div>
);

export const Bracket: React.FC = () => {
  const { tournament, teams, rounds, startTournament, generateNextRound } = useTournamentStore();
  const [showCeremony, setShowCeremony] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'bracket' | 'gallery'>('bracket');
  const [exporting, setExporting] = React.useState<string | null>(null);
  const [previewData, setPreviewData] = React.useState<{ id: string, type: string, team?: Team } | null>(null);
  const navigate = useNavigate();

  if (!tournament) return null;

  const downloadPoster = async (id: string, fileName: string) => {
    // Target element for export might be either off-screen or the preview one
    const node = document.getElementById(id);
    if (!node) return;
    setExporting(id);
    try {
      const originalLeft = node.style.left;
      const originalPosition = node.style.position;
      
      // Temporarily show for capture if it's the off-screen one
      if (node.style.left === '-5000px') {
        node.style.left = '0';
        node.style.position = 'fixed';
      }

      const dataUrl = await htmlToImage.toPng(node, { 
        quality: 1, 
        pixelRatio: 2,
        cacheBust: true,
        fontEmbedCSS: '', 
      });
      
      // Restore
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-10">
        <div className="relative">
           <Zap size={80} className="text-indigo-600 animate-pulse" />
           <div className="absolute inset-0 bg-indigo-400 blur-3xl opacity-20 animate-orbit"></div>
        </div>
        <div className="space-y-4">
           <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Qura marosimi tayyor</h1>
           <p className="text-slate-500 max-w-sm mx-auto font-medium">Barcha jamoalar shakllantirildi. Qura tashlash marosimi orqali raqiblarni aniqlang.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
           <Button size="lg" onClick={() => setShowCeremony(true)} className="flex-1 rounded-2xl px-16 h-20 text-xl font-black shadow-2xl">
              MAROSIMNI BOSHLASH
           </Button>
           <Button variant="outline" size="lg" onClick={() => navigate('/teams')} className="rounded-2xl px-8 h-20 font-bold text-slate-500 border-slate-200">
              <Undo2 size={20} className="mr-2" /> JAMOALARGA QAYTISH
           </Button>
        </div>
      </div>
    );
  }

  const lastRound = rounds[rounds.length - 1];
  const allMatchesFinished = lastRound.matches.every(m => m.winnerTeamId);
  const isFinalFinished = lastRound.matches.length === 1 && allMatchesFinished;

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
         <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">O'yinlar Jadvali</h1>
            <p className="text-sm text-slate-500 font-medium">Musobaqa bosqichlari va professional posterlar.</p>
         </div>
         <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
            <button onClick={() => setActiveTab('bracket')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'bracket' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>JADVAL</button>
            <button onClick={() => setActiveTab('gallery')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'gallery' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>GALEREYA</button>
         </div>
      </header>

      {activeTab === 'bracket' ? (
        <div className="space-y-12">
          {!isFinalFinished && (
            <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-5 rounded-3xl border border-slate-200 shadow-sm gap-4">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                    <Zap size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase">Keyingi bosqich</h4>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">G'oliblar aniqlangach davom eting</p>
                  </div>
               </div>
               <Button disabled={!allMatchesFinished} onClick={generateNextRound} className="w-full sm:w-auto rounded-xl px-10 h-14 font-black text-sm">KEYINGI BOSQICH <ArrowRight size={18} className="ml-2" /></Button>
            </div>
          )}
          {rounds.map((round, rIdx) => (
            <div key={rIdx} className="space-y-8">
               <div className="flex items-center gap-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 shadow-sm">Round {rIdx + 1}</h3>
                  <div className="flex-1 h-px bg-slate-100"></div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {round.matches.map(m => <MatchCard key={m.id} match={m} roundIdx={rIdx} />)}
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {/* ROADMAP POSTER CARD */}
           <Card className="p-0 overflow-hidden flex flex-col group border-2 border-transparent hover:border-green-500 transition-all shadow-md">
              <div className="h-72 bg-green-900 relative flex items-center justify-center p-6 text-center overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grass.png')] opacity-20"></div>
                 <div className="relative z-10 transition-transform group-hover:scale-110 duration-500">
                    <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/20">
                       <ImageIcon className="text-white" size={40} />
                    </div>
                    <h4 className="text-white text-3xl font-black uppercase italic tracking-tight">Professional Roadmap</h4>
                    <Badge variant="emerald" className="mt-3 px-4 py-1.5 border-emerald-400/30">Tournament Bracket Poster</Badge>
                 </div>
              </div>
              <div className="p-8">
                 <Button variant="primary" className="w-full h-16 rounded-2xl font-black bg-green-700 hover:bg-green-800 shadow-lg shadow-green-100" onClick={() => setPreviewData({ id: 'roadmap-poster-export', type: 'roadmap' })}>
                    <Eye size={20} className="mr-3" /> KO'RISH VA YUKLASH
                 </Button>
              </div>
           </Card>

           {/* SQUAD POSTERS */}
           {teams.map((team, idx) => (
             <Card key={idx} className="p-0 overflow-hidden flex flex-col group border-2 border-transparent hover:border-indigo-500 transition-all shadow-md">
                <div className="h-72 bg-slate-900 relative flex items-center justify-center p-6 text-center overflow-hidden">
                   <div className="relative z-10 text-white transition-transform group-hover:scale-110 duration-500">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                         <Users className="text-indigo-400" size={32} />
                      </div>
                      <h4 className="text-2xl font-black uppercase italic tracking-tight">{team.name}</h4>
                      <Badge variant="indigo" className="mt-3 px-4 py-1.5 border-indigo-400/30">Team Squad Poster</Badge>
                   </div>
                </div>
                <div className="p-8">
                   <Button variant="secondary" className="w-full h-14 rounded-2xl font-black border-slate-200" onClick={() => setPreviewData({ id: `squad-export-${team.id}`, type: 'squad', team })}>
                      <Eye size={18} className="mr-3" /> TARKIB POSTERI
                   </Button>
                </div>
             </Card>
           ))}
        </div>
      )}

      {/* Hidden container for background exporting */}
      <div className="fixed left-[-5000px] top-0 pointer-events-none">
         <RoadmapPoster tournament={tournament} teams={teams} rounds={rounds} id="roadmap-poster-export" />
         {teams.map(team => (
            <SquadPoster key={team.id} team={team} tournamentName={tournament.name} id={`squad-export-${team.id}`} />
         ))}
      </div>

      {/* Preview Modal */}
      {previewData && (
        <div className="fixed inset-0 z-[150] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4 lg:p-10">
           <div className="w-full max-w-6xl bg-white rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300 flex flex-col h-full max-h-[900px]">
              <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                 <div>
                    <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight">Poster Preview</h3>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-[0.2em]">{previewData.type === 'roadmap' ? 'Tournament Roadmap' : `Squad: ${previewData.team?.name}`}</p>
                 </div>
                 <button onClick={() => setPreviewData(null)} className="p-4 hover:bg-slate-100 rounded-2xl text-slate-400 transition-colors">
                    <X size={32} />
                 </button>
              </div>
              
              <div className="flex-1 overflow-auto bg-slate-100/50 p-12 flex justify-center items-center">
                 <div className={`transform origin-center transition-transform ${previewData.type === 'roadmap' ? 'scale-[0.45]' : 'scale-[0.4]'}`}>
                    {previewData.type === 'roadmap' ? (
                       <RoadmapPoster tournament={tournament} teams={teams} rounds={rounds} id="roadmap-preview-internal" />
                    ) : (
                       <SquadPoster team={previewData.team!} tournamentName={tournament.name} id="squad-preview-internal" />
                    )}
                 </div>
              </div>

              <div className="p-10 bg-white flex flex-col sm:flex-row gap-5 border-t border-slate-100 shrink-0">
                 <Button 
                   size="lg" 
                   className="flex-1 h-20 rounded-3xl text-2xl font-black shadow-xl shadow-indigo-100" 
                   onClick={() => downloadPoster(previewData.id, `${previewData.type}_${previewData.team?.name || 'tournament'}`)}
                   loading={exporting !== null}
                 >
                    <Download size={28} className="mr-4" /> HQ PNG YUKLASH
                 </Button>
                 <Button variant="secondary" size="lg" className="px-12 h-20 rounded-3xl text-xl font-bold border-slate-200" onClick={() => setPreviewData(null)}>
                    BEKOR QILISH / YOPISH
                 </Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
