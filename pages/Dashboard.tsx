
import React from 'react';
import { useTournamentStore } from '../store';
import { Card } from '../shared/ui/Card';
import { Button } from '../shared/ui/Button';
import { Badge } from '../shared/ui/Badge';
import { 
  Trophy, 
  Users, 
  Plus, 
  Calendar, 
  Activity, 
  ArrowUpRight, 
  Rocket, 
  Shield, 
  Zap, 
  Star,
  ChevronRight,
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
      <div className="min-h-[85vh] flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-400/10 blur-[100px] animate-orbit"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/10 blur-[120px] animate-sphere-float"></div>

        <div className="text-center space-y-10 max-w-4xl relative z-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 animate-in slide-in-from-top-4 duration-500">
              <Sparkles size={16} />
              <span className="text-xs font-black uppercase tracking-widest">EduCup v2.5 Professional</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none animate-in fade-in zoom-in duration-700">
              PROFESSIONAL <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]">
                TOURNAMENT MANAGER
              </span>
            </h1>
            
            <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed animate-in fade-in duration-1000">
              O'quv markazlari uchun maxsus ishlab chiqilgan professional futbol musobaqalarini boshqarish tizimi. 
              Knockout mantiqi, avtomatik jadvallar va Telegram integratsiyasi — hammasi bir joyda.
            </p>
          </div>
          
          <div className="pt-4 flex flex-col items-center gap-8">
            {isCreating ? (
              <Card className="text-left border-indigo-200 shadow-2xl relative animate-in zoom-in duration-300 w-full max-w-lg overflow-visible" variant="premium">
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                  <Zap size={24} />
                </div>
                <button 
                  onClick={() => setIsCreating(false)} 
                  className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                  title="Bekor qilish"
                  disabled={loading}
                >
                  <X size={20} />
                </button>
                <form onSubmit={handleCreate} className="space-y-6 p-2">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Turnir nomi</label>
                    <input 
                      autoFocus
                      type="text" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Masalan: EduCup Bahor-2025"
                      className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none text-xl font-black transition-all placeholder:text-slate-300 shadow-inner"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Format (Ishtirokchilar soni)</label>
                    <div className="grid grid-cols-4 gap-3">
                      {['3', '5', '7', '11'].map(num => (
                        <button
                          key={num}
                          type="button"
                          disabled={loading}
                          onClick={() => setPlayersPerTeam(num)}
                          className={`py-3 rounded-2xl text-sm font-black border-2 transition-all ${playersPerTeam === num ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white text-slate-600 border-slate-100 hover:border-indigo-200'}`}
                        >
                          {num}×{num}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button type="submit" loading={loading} className="flex-1 py-5 text-lg rounded-2xl shadow-xl shadow-indigo-100">
                      MUSOBAQANI YARATISH
                    </Button>
                  </div>
                </form>
              </Card>
            ) : (
              <div className="flex flex-col gap-6 w-full items-center">
                <Button onClick={() => setIsCreating(true)} size="lg" className="px-16 py-8 text-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:scale-105 active:scale-95 transition-all group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <PlusCircle size={28} className="mr-3" /> TURNIRNI BOSHLASH
                </Button>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl pt-8">
                  {[
                    { icon: <Zap className="text-amber-500" />, title: 'Tezkor pairing', desc: 'Avtomatik knockout' },
                    { icon: <ImageIcon className="text-indigo-500" />, title: 'Posterlar', desc: 'Professional grafikalar' },
                    { icon: <Share2 className="text-blue-500" />, title: 'Telegram Hub', desc: 'Bir klikda xabar' },
                  ].map((f, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 p-4 bg-white/50 border border-slate-100 rounded-3xl animate-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${i * 150}ms` }}>
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mb-2">{f.icon}</div>
                      <h4 className="text-xs font-black text-slate-900 uppercase">{f.title}</h4>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{f.desc}</p>
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
    <div className="space-y-10 pb-20 animate-in fade-in duration-500">
      <div className="relative p-8 md:p-12 bg-slate-900 rounded-[3rem] overflow-hidden text-white shadow-2xl shadow-slate-200">
         <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-600/20 to-transparent"></div>
         <div className="absolute -bottom-12 -right-12 opacity-10 rotate-12">
            <Trophy size={280} />
         </div>
         
         <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4 w-full">
               <div className="flex items-center gap-3">
                  <Badge variant="indigo" className="bg-indigo-500/20 border-indigo-400/30 text-indigo-200">FAOL MUSOBAQA</Badge>
                  <span className="text-slate-400 text-xs font-bold flex items-center gap-1 uppercase tracking-widest">
                     <Calendar size={12} className="text-indigo-400" /> {new Date(tournament.createdAt).toLocaleDateString()}
                  </span>
               </div>
               
               {isEditingTitle ? (
                 <div className="flex items-center gap-3 max-w-2xl group">
                    <input 
                      autoFocus
                      type="text"
                      value={editTitleValue}
                      onChange={e => setEditTitleValue(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSaveTitle()}
                      onBlur={handleSaveTitle}
                      className="bg-white/10 border-b-4 border-indigo-500 outline-none text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none w-full px-2 py-1 rounded-t-lg"
                    />
                    <button onClick={handleSaveTitle} className="p-3 bg-emerald-500 rounded-2xl text-white hover:scale-110 transition-transform">
                       <Check size={24} />
                    </button>
                 </div>
               ) : (
                 <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none flex items-center gap-4 group">
                    {tournament.name}
                    <button 
                      onClick={() => setIsEditingTitle(true)}
                      className="p-2 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-xl transition-all"
                      title="Nomni tahrirlash"
                    >
                      <Edit2 size={24} className="text-indigo-400" />
                    </button>
                 </h1>
               )}

               <div className="flex items-center gap-6 pt-2">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Format</span>
                     <span className="text-xl font-bold">{tournament.playersPerTeam}×{tournament.playersPerTeam}</span>
                  </div>
                  <div className="w-px h-8 bg-white/10"></div>
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jamoalar</span>
                     <span className="text-xl font-bold">{teams.length}</span>
                  </div>
               </div>
            </div>
            
            <div className="flex flex-col gap-3 shrink-0">
               <Button variant="glass" size="lg" className="rounded-2xl font-black text-sm px-8" onClick={() => navigate('/export')}>
                  <Share2 size={18} className="mr-3 text-indigo-400" /> TELEGRAM PUBLISH
               </Button>
               <button 
                 onClick={() => { if(confirm('Haqiqatdan turnirni butunlay yopmoqchimisiz? Barcha natijalar o\'chadi.')) resetTournament() }}
                 className="text-[10px] font-black text-slate-500 hover:text-rose-400 uppercase tracking-[0.2em] transition-colors"
               >
                 MUSOBAQANI YAKUNLASH
               </button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-2 p-8 overflow-hidden bg-white border border-slate-100 flex flex-col justify-between shadow-sm">
           <div className="flex justify-between items-start mb-10">
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">O'yinlar Progressi</p>
                 <h2 className="text-4xl font-black text-slate-900">{progressPercent}%</h2>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                 <Activity size={24} />
              </div>
           </div>
           <div className="space-y-4">
              <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase tracking-tight">
                 <span>Yakunlangan: <b className="text-slate-900">{finishedMatches}</b></span>
                 <span>Jami o'yinlar: <b className="text-slate-900">{totalPossibleMatches > 0 ? totalPossibleMatches : '-'}</b></span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-indigo-600 transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }}></div>
              </div>
           </div>
        </Card>

        <Card className="flex flex-col justify-between p-8">
           <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
              <Target size={24} />
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Jami Gollar</p>
              <h3 className="text-4xl font-black text-slate-900">{stats.totalGoals}</h3>
           </div>
        </Card>

        <Card className="flex flex-col justify-between p-8">
           <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-6">
              <Zap size={24} />
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Kartochkalar</p>
              <h3 className="text-4xl font-black text-slate-900">{stats.totalCards}</h3>
           </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { 
            to: '/teams', 
            icon: <Users size={28} />, 
            color: 'bg-slate-900', 
            title: 'Jamoalar Boshqaruvi', 
            desc: 'Ishtirokchilar va tarkiblarni tahrirlash.' 
          },
          { 
            to: '/bracket', 
            icon: <Trophy size={28} />, 
            color: 'bg-indigo-600', 
            title: 'O\'yinlar Jadvali', 
            desc: 'Natijalarni kiritish va bosqichlar.' 
          },
          { 
            to: '/stats', 
            icon: <BarChart3 size={28} />, 
            color: 'bg-violet-600', 
            title: 'Toliq Analitika', 
            desc: 'To\'purarlar va individual natijalar.' 
          }
        ].map((item, idx) => (
          <button 
            key={idx}
            onClick={() => navigate(item.to)}
            className="group relative flex flex-col text-left p-10 bg-white rounded-[2.5rem] border border-slate-100 hover:border-indigo-500 hover:shadow-2xl transition-all duration-500"
          >
            <div className={`w-16 h-16 ${item.color} text-white rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 shadow-xl`}>
               {item.icon}
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight uppercase italic">{item.title}</h3>
            <p className="text-sm text-slate-500 mb-8 font-medium leading-relaxed">{item.desc}</p>
            <div className="flex items-center gap-3 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] mt-auto">
               BO'LIMGA O'TISH <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
