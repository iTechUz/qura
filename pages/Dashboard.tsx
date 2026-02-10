
import React from 'react';
import { useTournamentStore } from '../store';
import { Card } from '../shared/ui/Card';
import { Button } from '../shared/ui/Button';
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
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getTournamentStats } from '../utils';

export const Dashboard: React.FC = () => {
  const { tournament, teams, rounds, initTournament, resetTournament } = useTournamentStore();
  const [isCreating, setIsCreating] = React.useState(false);
  const [name, setName] = React.useState('');
  const [playersPerTeam, setPlayersPerTeam] = React.useState('5');
  const navigate = useNavigate();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    initTournament(name, parseInt(playersPerTeam) || 5);
    setName('');
    setIsCreating(false);
  };

  if (!tournament) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 px-4">
        <div className="text-center space-y-6 max-w-2xl">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-200">
            <Trophy size={32} />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">EduCup Manager</h1>
          <p className="text-slate-500 text-lg">Musobaqalarni tashkil qilish va boshqarishning professional tizimi. Yangi turnir yaratish orqali boshlang.</p>
          
          <div className="pt-8">
            {isCreating ? (
              <Card className="text-left border-indigo-100 shadow-xl" variant="premium">
                <form onSubmit={handleCreate} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Turnir nomi</label>
                    <input 
                      autoFocus
                      type="text" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Masalan: EduCup Qishki-2024"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none text-lg font-bold transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Format (Ishtirokchilar soni)</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['3', '5', '7', '11'].map(num => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setPlayersPerTeam(num)}
                          className={`py-2 rounded-lg text-sm font-bold border transition-all ${playersPerTeam === num ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                        >
                          {num}×{num}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button type="submit" className="flex-1 py-3">Yaratish</Button>
                    <Button type="button" variant="ghost" onClick={() => setIsCreating(false)} className="px-6">Bekor qilish</Button>
                  </div>
                </form>
              </Card>
            ) : (
              <Button onClick={() => setIsCreating(true)} size="lg" className="px-10 py-4 text-lg rounded-2xl shadow-xl">
                <Plus size={20} className="mr-2" /> Yangi Turnir Boshlash
              </Button>
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
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
             <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">Active</span>
             <span className="text-slate-400 text-xs font-medium flex items-center gap-1">
               <Calendar size={12} /> {new Date(tournament.createdAt).toLocaleDateString()}
             </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{tournament.name}</h1>
        </div>
        <div className="flex gap-2">
           <Button variant="secondary" size="sm" className="rounded-xl font-bold" onClick={() => navigate('/export')}>
             <Zap size={16} className="mr-2" /> Export
           </Button>
           <Button variant="outline" size="sm" className="rounded-xl text-rose-500 border-rose-100 hover:bg-rose-50" onClick={() => { if(confirm('Haqiqatdan turnirni yopmoqchimisiz?')) resetTournament() }}>
             Turnirni yopish
           </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-2 p-0 overflow-hidden bg-slate-900 text-white border-none">
           <div className="p-6 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                 <div className="space-y-1">
                    <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest">Turnir Progressi</p>
                    <h2 className="text-3xl font-black">{progressPercent}%</h2>
                 </div>
                 <Activity className="text-indigo-400" size={24} />
              </div>
              <div className="mt-8 space-y-3">
                 <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                    <span>O'yinlar: {finishedMatches} / {totalPossibleMatches > 0 ? totalPossibleMatches : '-'}</span>
                 </div>
                 <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                 </div>
              </div>
           </div>
        </Card>

        <Card className="flex flex-col justify-between">
           <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <Target size={20} />
           </div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Jami Gollar</p>
              <h3 className="text-3xl font-black text-slate-900">{stats.totalGoals}</h3>
           </div>
        </Card>

        <Card className="flex flex-col justify-between">
           <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
              <Star size={20} />
           </div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Jamoalar soni</p>
              <h3 className="text-3xl font-black text-slate-900">{teams.length}</h3>
           </div>
        </Card>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => navigate('/teams')}
          className="group text-left p-6 bg-white rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-lg transition-all"
        >
          <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
             <Users size={20} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">Jamoalar</h3>
          <p className="text-sm text-slate-500 mb-4">Ishtirokchilar va tarkibni boshqarish.</p>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
             O'tish <ArrowUpRight size={14} />
          </div>
        </button>

        <button 
          onClick={() => navigate('/bracket')}
          className="group text-left p-6 bg-white rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-lg transition-all"
        >
          <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
             <Trophy size={20} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">O'yin Jadvali</h3>
          <p className="text-sm text-slate-500 mb-4">Knockout bosqichi va natijalar.</p>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
             O'tish <ArrowUpRight size={14} />
          </div>
        </button>

        <button 
          onClick={() => navigate('/stats')}
          className="group text-left p-6 bg-white rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-lg transition-all"
        >
          <div className="w-10 h-10 bg-violet-600 text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
             <Shield size={20} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">Analitika</h3>
          <p className="text-sm text-slate-500 mb-4">To'purarlar va jamoalar statistikasi.</p>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
             O'tish <ArrowUpRight size={14} />
          </div>
        </button>
      </div>

      {rounds.length === 0 && teams.length >= 2 && (
        <Card className="bg-indigo-50/50 border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-6" variant="flat">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                <Zap size={24} fill="currentColor" />
             </div>
             <div>
                <h4 className="font-bold text-slate-900">Tayyormisiz?</h4>
                <p className="text-sm text-slate-500">Tarkiblar shakllantirildi, pley-offga start berish mumkin.</p>
             </div>
          </div>
          <Button size="lg" className="rounded-xl whitespace-nowrap" onClick={() => navigate('/bracket')}>
            Turnirni Boshlash <ArrowUpRight size={18} className="ml-2" />
          </Button>
        </Card>
      )}
    </div>
  );
};
