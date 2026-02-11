
import React from 'react';
import { useTournamentStore } from '../store';
import { Card } from '../shared/ui/Card';
import { Button } from '../shared/ui/Button';
import { Badge } from '../shared/ui/Badge';
import { 
  Trophy, 
  Users, 
  Calendar, 
  Activity, 
  Zap, 
  Target, 
  X, 
  PlusCircle, 
  BarChart3, 
  Share2, 
  Sparkles, 
  ArrowRight, 
  Edit2, 
  Check, 
  Image as ImageIcon 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getTournamentStats } from '../utils';

export const Dashboard: React.FC = () => {
  const { tournament, teams, rounds, initTournament, renameTournament, resetTournament } = useTournamentStore();
  const [isCreating, setIsCreating] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [name, setName] = React.useState('');
  const [playersPerTeam, setPlayersPerTeam] = React.useState('5');
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [editTitleValue, setEditTitleValue] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (tournament) {
      setEditTitleValue(tournament.name);
    }
  }, [tournament]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setTimeout(() => {
      initTournament(name.trim(), parseInt(playersPerTeam) || 5);
      setName('');
      setLoading(false);
      setIsCreating(false);
    }, 600);
  };

  const handleSaveTitle = () => {
    if (editTitleValue.trim() && editTitleValue !== tournament?.name) {
      renameTournament(editTitleValue.trim());
    }
    setIsEditingTitle(false);
  };

  if (!tournament) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center py-8 px-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-indigo-400/10 blur-[80px] animate-orbit"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-400/10 blur-[100px] animate-sphere-float"></div>

        <div className="text-center space-y-6 max-w-3xl relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 animate-in slide-in-from-top-4 duration-500">
              <Sparkles size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">EduCup v2.5 Pro</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-normal animate-in fade-in zoom-in duration-700 uppercase italic pr-4">
              TOURNAMENT <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] animate-[gradient_3s_linear_infinite] pr-2">
                MANAGER
              </span>
            </h1>
            
            <p className="text-slate-500 text-base md:text-lg max-w-xl mx-auto font-medium leading-relaxed animate-in fade-in duration-1000">
              Professional futbol musobaqalarini boshqarish tizimi. 
              Knockout mantiqi va Telegram integratsiyasi — hammasi bir joyda.
            </p>
          </div>
          
          <div className="pt-4 flex flex-col items-center gap-6">
            {isCreating ? (
              <Card className="text-left border-indigo-200 shadow-xl relative animate-in zoom-in duration-300 w-full max-w-md p-6" variant="premium">
                <button 
                  onClick={() => setIsCreating(false)} 
                  className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"
                  title="Bekor qilish"
                  disabled={loading}
                >
                  <X size={20} />
                </button>
                <form onSubmit={handleCreate} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Turnir nomi</label>
                    <input 
                      autoFocus
                      type="text" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Masalan: EduCup Bahor-2025"
                      className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none text-lg font-black transition-all placeholder:text-slate-200 shadow-inner italic"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Format</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['3', '5', '7', '11'].map(num => (
                        <button
                          key={num}
                          type="button"
                          disabled={loading}
                          onClick={() => setPlayersPerTeam(num)}
                          className={`h-10 rounded-xl text-sm font-black border-2 transition-all ${playersPerTeam === num ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100' : 'bg-white text-slate-600 border-slate-100 hover:border-indigo-200'}`}
                        >
                          {num}×{num}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button type="submit" loading={loading} size="lg" className="w-full h-14 rounded-2xl">
                      MUSOBAQANI YARATISH
                    </Button>
                  </div>
                </form>
              </Card>
            ) : (
              <div className="flex flex-col gap-6 w-full items-center">
                <Button onClick={() => setIsCreating(true)} size="xl" className="w-full max-w-sm h-16 rounded-[1.5rem] shadow-xl shadow-indigo-100 group overflow-hidden">
                  <PlusCircle size={22} className="mr-2" /> TURNIRNI BOSHLASH
                </Button>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-2xl">
                  {[
                    { icon: <Zap size={18} className="text-amber-500" />, title: 'Tezkor pairing', desc: 'Auto knockout' },
                    { icon: <ImageIcon size={18} className="text-indigo-500" />, title: 'Posterlar', desc: 'Pro grafikalar' },
                    { icon: <Share2 size={18} className="text-blue-500" />, title: 'Telegram Hub', desc: 'Bir klikda publish' },
                  ].map((f, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5 p-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm animate-in slide-in-from-bottom-4 duration-700 hover:shadow-md transition-shadow" style={{ animationDelay: `${i * 100}ms` }}>
                      <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center mb-0.5">{f.icon}</div>
                      <h4 className="text-[10px] font-black text-slate-900 uppercase italic">{f.title}</h4>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const stats = getTournamentStats(rounds, teams);
  const finishedMatches = rounds.flatMap(r => r.matches).filter(m => m.status === 'finished').length;
  const totalPossibleMatches = teams.length - 1;
  const progressPercent = Math.min(100, Math.round((finishedMatches / totalPossibleMatches) * 100)) || 0;

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="relative p-6 md:p-10 bg-slate-900 rounded-[2rem] overflow-hidden text-white shadow-xl">
         <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-600/20 to-transparent"></div>
         <div className="absolute -bottom-8 -right-8 opacity-10 rotate-12">
            <Trophy size={180} />
         </div>
         
         <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 w-full">
               <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="indigo" className="bg-indigo-500/20 border-indigo-400/30 text-indigo-200 px-2 py-0.5 rounded-lg">FAOL</Badge>
                  <span className="text-slate-400 text-[10px] font-black flex items-center gap-1 uppercase tracking-[0.2em]">
                     <Calendar size={12} className="text-indigo-400" /> {new Date(tournament.createdAt).toLocaleDateString()}
                  </span>
               </div>
               
               {isEditingTitle ? (
                 <div className="flex items-center gap-2 max-w-xl">
                    <input 
                      autoFocus
                      type="text"
                      value={editTitleValue}
                      onChange={e => setEditTitleValue(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSaveTitle()}
                      onBlur={handleSaveTitle}
                      className="bg-white/10 border-b-2 border-indigo-500 outline-none text-2xl md:text-4xl font-black italic uppercase tracking-tight leading-normal w-full px-1 py-1 rounded-t-lg pr-4"
                    />
                    <button onClick={handleSaveTitle} className="p-2 bg-emerald-500 rounded-lg text-white hover:scale-105 transition-transform">
                       <Check size={18} />
                    </button>
                 </div>
               ) : (
                 <h1 className="text-2xl md:text-4xl font-black italic uppercase tracking-tight leading-normal flex items-center gap-3 group pr-4">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-200 pr-2">{tournament.name}</span>
                    <button 
                      onClick={() => setIsEditingTitle(true)}
                      className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-lg transition-all"
                      title="Tahrirlash"
                    >
                      <Edit2 size={16} className="text-indigo-400" />
                    </button>
                 </h1>
               )}

               <div className="flex items-center gap-5 pt-1">
                  <div className="flex flex-col">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Format</span>
                     <span className="text-base font-black italic">5x5</span>
                  </div>
                  <div className="w-px h-6 bg-white/10"></div>
                  <div className="flex flex-col">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Jamoalar</span>
                     <span className="text-base font-black italic">{teams.length} / 10</span>
                  </div>
               </div>
            </div>
            
            <div className="flex flex-col gap-2 shrink-0">
               <Button variant="glass" size="md" className="rounded-xl font-black text-[10px] px-5 h-10 tracking-widest" onClick={() => navigate('/export')}>
                  <Share2 size={14} className="mr-2 text-indigo-400" /> TELEGRAM
               </Button>
               <button 
                 onClick={() => { if(confirm('Musobaqani yakunlaysizmi?')) resetTournament() }}
                 className="text-[9px] font-black text-slate-500 hover:text-rose-400 uppercase tracking-[0.2em] transition-colors py-1 px-2"
               >
                 YAKUNLASH
               </button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-2 p-6 flex flex-col justify-between" variant="default">
           <div className="flex justify-between items-start mb-6">
              <div className="space-y-0.5">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Progress</p>
                 <h2 className="text-3xl font-black text-slate-900 italic tracking-tight">{progressPercent}%</h2>
              </div>
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                 <Activity size={20} />
              </div>
           </div>
           <div className="space-y-3">
              <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase tracking-[0.1em]">
                 <span>Tugallandi: {finishedMatches}</span>
                 <span>Jami: {totalPossibleMatches > 0 ? totalPossibleMatches : '-'}</span>
              </div>
              <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden p-0.5">
                 <div className="h-full bg-indigo-600 transition-all duration-1000 ease-out rounded-full shadow-sm shadow-indigo-100" style={{ width: `${progressPercent}%` }}></div>
              </div>
           </div>
        </Card>

        <Card className="p-6 flex flex-col justify-between" variant="default">
           <div className="w-9 h-9 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
              <Target size={18} />
           </div>
           <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Gollar</p>
              <h3 className="text-3xl font-black text-slate-900 italic tracking-tight">{stats.totalGoals}</h3>
           </div>
        </Card>

        <Card className="p-6 flex flex-col justify-between" variant="default">
           <div className="w-9 h-9 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center mb-4">
              <Zap size={18} />
           </div>
           <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Kartochkalar</p>
              <h3 className="text-3xl font-black text-slate-900 italic tracking-tight">{stats.totalCards}</h3>
           </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { 
            to: '/teams', 
            icon: <Users size={22} />, 
            color: 'bg-slate-900', 
            title: 'Jamoalar', 
            desc: 'Tarkiblarni tahrirlash.' 
          },
          { 
            to: '/bracket', 
            icon: <Trophy size={22} />, 
            color: 'bg-indigo-600', 
            title: 'Jadval', 
            desc: 'Natijalarni kiritish.' 
          },
          { 
            to: '/stats', 
            icon: <BarChart3 size={22} />, 
            color: 'bg-violet-600', 
            title: 'Analitika', 
            desc: 'Individual natijalar.' 
          }
        ].map((item, idx) => (
          <button 
            key={idx}
            onClick={() => navigate(item.to)}
            className="group flex flex-col text-left p-6 bg-white rounded-[1.5rem] border border-slate-100 hover:border-indigo-500 hover:shadow-lg transition-all duration-300 shadow-sm"
          >
            <div className={`w-12 h-12 ${item.color} text-white rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105 duration-500 shadow-md`}>
               {item.icon}
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1.5 uppercase italic tracking-tight">{item.title}</h3>
            <p className="text-[11px] text-slate-500 mb-6 font-medium leading-relaxed opacity-80">{item.desc}</p>
            <div className="flex items-center gap-1.5 text-indigo-600 font-black text-[9px] uppercase tracking-[0.3em] mt-auto">
               O'TISH <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
