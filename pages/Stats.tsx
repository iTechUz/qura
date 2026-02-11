
import React from 'react';
import { useTournamentStore } from '../store';
import { Card } from '../shared/ui/Card';
import { Badge } from '../shared/ui/Badge';
import { getTournamentStats, PlayerStat } from '../utils';
import { 
  Trophy, 
  Activity, 
  Target, 
  Search, 
  Users,
  Medal,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Minus,
  Star,
  Crown
} from 'lucide-react';

type SortKey = 'goals' | 'assists' | 'discipline' | 'score' | 'name';

export const Stats: React.FC = () => {
  const { tournament, rounds, teams } = useTournamentStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{ key: SortKey; direction: 'asc' | 'desc' }>({
    key: 'score',
    direction: 'desc'
  });

  if (!tournament) return null;

  const { totalMatches, totalGoals, topScorers, topAssisters, allPlayers } = getTournamentStats(rounds, teams);
  const getTeamName = (id: string) => teams.find(t => t.id === id)?.name || 'N/A';

  const handleSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const sortedPlayers = React.useMemo(() => {
    return [...allPlayers]
      .filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        getTeamName(p.teamId).toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        const calculateScore = (p: PlayerStat) => (p.goals * 3) + (p.assists * 1.5) - (p.yellowCards * 1) - (p.redCards * 3);
        const getDiscipline = (p: PlayerStat) => (p.redCards * 2) + p.yellowCards;

        let valA: any, valB: any;
        
        switch (sortConfig.key) {
          case 'goals': valA = a.goals; valB = b.goals; break;
          case 'assists': valA = a.assists; valB = b.assists; break;
          case 'discipline': valA = getDiscipline(a); valB = getDiscipline(b); break;
          case 'score': valA = calculateScore(a); valB = calculateScore(b); break;
          case 'name': valA = a.name; valB = b.name; break;
          default: valA = 0; valB = 0;
        }

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
  }, [allPlayers, searchQuery, sortConfig, teams]);

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortConfig.key !== column) return <Minus size={12} className="opacity-20" />;
    return sortConfig.direction === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />;
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Turnir Statistikasi</h1>
          <p className="text-sm text-slate-500">O'yinlar tahlili va individual reytinglar.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-2">
              <Trophy size={16} className="text-indigo-600" />
              <span className="text-xs font-black text-indigo-700 uppercase tracking-widest">Live Stats</span>
           </div>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="premium" className="flex flex-col justify-between">
           <div className="flex items-center justify-between mb-6">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                 <Target size={20} />
              </div>
              <TrendingUp size={16} className="text-emerald-500" />
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Jami Gollar</p>
              <h3 className="text-4xl font-black text-slate-900">{totalGoals}</h3>
           </div>
        </Card>

        <Card className="flex flex-col justify-between">
           <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center mb-6">
              <Activity size={20} />
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Jami O'yinlar</p>
              <h3 className="text-4xl font-black text-slate-900">{totalMatches}</h3>
           </div>
        </Card>

        <Card className="lg:col-span-2 relative overflow-hidden bg-slate-900 text-white border-none shadow-xl">
           <div className="relative z-10 flex h-full">
              <div className="flex-1 flex flex-col justify-center p-2">
                 <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                    <Medal size={14} /> To'purarlar Etakchisi
                 </p>
                 <h4 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase leading-none mb-2">
                    {topScorers[0]?.goals > 0 ? topScorers[0].name : '---'}
                 </h4>
                 <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                       <Target size={12} /> {topScorers[0]?.goals || 0} Gol
                    </span>
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                       <Activity size={12} /> {topScorers[0]?.assists || 0} Assist
                    </span>
                 </div>
              </div>
              <div className="absolute top-0 right-0 h-full flex items-center px-10 opacity-10 scale-150 rotate-12">
                 <Trophy size={140} />
              </div>
           </div>
        </Card>
      </div>

      {/* Leaderboard Section */}
      <div className="space-y-6">
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
               <Users size={22} className="text-indigo-600" /> Leaderboard
            </h2>
            <div className="relative max-w-sm w-full">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={e => setSearchQuery(e.target.value)}
                 placeholder="Ism yoki jamoa bo'yicha qidiruv..."
                 className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all"
               />
            </div>
         </div>

         <Card className="p-0 overflow-hidden border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">#</th>
                    <th className="px-4 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('name')}>
                       <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          O'yinchi <SortIcon column="name" />
                       </div>
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Jamoa</th>
                    <th className="px-4 py-4 text-center cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('goals')}>
                       <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          Gol <SortIcon column="goals" />
                       </div>
                    </th>
                    <th className="px-4 py-4 text-center cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('assists')}>
                       <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          Assist <SortIcon column="assists" />
                       </div>
                    </th>
                    <th className="px-4 py-4 text-center cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('discipline')}>
                       <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          Kartochka <SortIcon column="discipline" />
                       </div>
                    </th>
                    <th className="px-6 py-4 text-right cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('score')}>
                       <div className="flex items-center justify-end gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                          Index Score <SortIcon column="score" />
                       </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {sortedPlayers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-24 text-center">
                         <div className="max-w-xs mx-auto space-y-3">
                            <Activity size={40} className="mx-auto text-slate-200" />
                            <p className="text-sm font-bold text-slate-400">Hech qanday o'yinchi statistikasi topilmadi.</p>
                         </div>
                      </td>
                    </tr>
                  ) : (
                    sortedPlayers.map((p, i) => {
                      const score = (p.goals * 3) + (p.assists * 1.5) - (p.yellowCards * 1) - (p.redCards * 3);
                      const rank = i + 1;
                      const team = teams.find(t => t.id === p.teamId);
                      const isCaptain = team?.captainName === p.name;
                      
                      return (
                        <tr key={i} className={`group hover:bg-slate-50/80 transition-all ${isCaptain ? 'bg-amber-50/20' : ''}`}>
                          <td className="px-6 py-5">
                             <div className="flex items-center justify-center w-6 h-6 rounded-lg text-[10px] font-black transition-all">
                                {rank === 1 ? <div className="bg-amber-100 text-amber-700 w-full h-full rounded-md flex items-center justify-center ring-2 ring-amber-400 ring-offset-2 scale-110 shadow-lg shadow-amber-100">1</div> :
                                 rank === 2 ? <div className="bg-slate-100 text-slate-600 w-full h-full rounded-md flex items-center justify-center ring-2 ring-slate-300 ring-offset-2 scale-105 shadow-md">2</div> :
                                 rank === 3 ? <div className="bg-orange-100 text-orange-700 w-full h-full rounded-md flex items-center justify-center ring-2 ring-orange-300 ring-offset-2">3</div> :
                                 <span className="text-slate-300 font-bold">{rank}</span>}
                             </div>
                          </td>
                          <td className="px-4 py-5">
                             <div className="flex flex-col">
                                <span className={`font-black text-sm group-hover:text-indigo-600 transition-colors flex items-center gap-1.5 uppercase tracking-tight ${isCaptain ? 'text-amber-900' : 'text-slate-900'}`}>
                                   {p.name}
                                   {isCaptain && <Crown size={10} className="text-amber-500" fill="currentColor" />}
                                </span>
                                {isCaptain && (
                                   <Badge variant="amber" size="xs" className="mt-1 self-start">
                                     Jamoa Sardori
                                   </Badge>
                                )}
                             </div>
                          </td>
                          <td className="px-6 py-5">
                             <span className="text-[10px] font-black text-slate-500 px-3 py-1 bg-slate-100 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all border border-transparent group-hover:border-indigo-100">
                                {getTeamName(p.teamId).toUpperCase()}
                             </span>
                          </td>
                          <td className="px-4 py-5 text-center">
                             <span className={`text-base font-black ${p.goals > 0 ? 'text-indigo-600' : 'text-slate-200'}`}>{p.goals}</span>
                          </td>
                          <td className="px-4 py-5 text-center">
                             <span className={`text-base font-black ${p.assists > 0 ? 'text-slate-600' : 'text-slate-200'}`}>{p.assists}</span>
                          </td>
                          <td className="px-4 py-5">
                             <div className="flex items-center justify-center gap-1.5">
                                {p.yellowCards > 0 && Array.from({ length: p.yellowCards }).map((_, idx) => (
                                  <div key={idx} className="w-2.5 h-4 bg-amber-400 rounded-sm shadow-[0_0_8px_rgba(251,191,36,0.3)]" />
                                ))}
                                {p.redCards > 0 && Array.from({ length: p.redCards }).map((_, idx) => (
                                  <div key={idx} className="w-2.5 h-4 bg-rose-500 rounded-sm shadow-[0_0_8px_rgba(244,63,94,0.3)]" />
                                ))}
                                {p.yellowCards === 0 && p.redCards === 0 && <span className="text-slate-200 font-medium">-</span>}
                             </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                             <div className="flex flex-col items-end">
                                <span className={`text-sm font-black ${score > 0 ? 'text-emerald-600' : score < 0 ? 'text-rose-500' : 'text-slate-300'}`}>
                                   {score > 0 ? '+' : ''}{score.toFixed(1)}
                                </span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-40">Performance</span>
                             </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
         </Card>
      </div>

      {/* Analytics Info Card */}
      <Card variant="flat" className="flex items-start gap-4 p-8 border-indigo-100 bg-indigo-50/30">
         <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shrink-0">
            <Activity size={20} />
         </div>
         <div className="space-y-1">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Index Score Qanday Hisoblanadi?</h4>
            <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
               O'yinchi reytingi avtomatik formulaga asoslangan: <br />
               <b className="text-slate-900">+3 ball</b> har bir gol uchun, 
               <b className="text-slate-900"> +1.5 ball</b> assist uchun. 
               Jarima sifatida: <b className="text-rose-500">-1 ball</b> sariq kartochka, 
               <b className="text-rose-600"> -3 ball</b> qizil kartochka uchun ayirib tashlanadi.
            </p>
         </div>
      </Card>
    </div>
  );
};
