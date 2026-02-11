
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
  Crown,
  BarChart3,
  Zap
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

  const { totalMatches, totalGoals, totalCards, topScorers, allPlayers } = getTournamentStats(rounds, teams);
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
    if (sortConfig.key !== column) return <Minus size={10} className="opacity-20" />;
    return sortConfig.direction === 'desc' ? <ChevronDown size={12} /> : <ChevronUp size={12} />;
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Statistika</h1>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Natijalar va intizom markazi.</p>
        </div>
        
        <div className="flex items-center gap-2">
           <div className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center gap-2 shadow-sm">
              <Trophy size={14} className="text-indigo-600" />
              <span className="text-[9px] font-black text-indigo-700 uppercase tracking-widest">Live Performance</span>
           </div>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="premium" className="flex flex-col justify-between p-6">
           <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-lg">
                 <Target size={16} />
              </div>
              <TrendingUp size={14} className="text-emerald-500" />
           </div>
           <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Gollar</p>
              <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter">{totalGoals}</h3>
           </div>
        </Card>

        <Card className="flex flex-col justify-between p-6" variant="default">
           <div className="w-8 h-8 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center mb-4 shadow-inner">
              <Zap size={16} />
           </div>
           <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Kartochkalar</p>
              <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter">{totalCards}</h3>
           </div>
        </Card>

        <Card className="lg:col-span-2 relative overflow-hidden bg-slate-900 text-white border-none shadow-xl p-0">
           <div className="relative z-10 flex h-full items-center p-6">
              <div className="flex-1 flex flex-col justify-center">
                 <p className="text-indigo-400 text-[8px] font-black uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
                    <Medal size={14} /> ETAYKCHI
                 </p>
                 <h4 className="text-2xl font-black italic tracking-tighter uppercase leading-none mb-3">
                    {topScorers[0]?.goals > 0 ? topScorers[0].name : '---'}
                 </h4>
                 <div className="flex items-center gap-5">
                    <div className="flex flex-col">
                       <span className="text-[8px] font-black text-indigo-300 uppercase tracking-widest opacity-60">Gollar</span>
                       <span className="text-lg font-black tabular-nums">{topScorers[0]?.goals || 0}</span>
                    </div>
                    <div className="w-px h-5 bg-white/10"></div>
                    <div className="flex flex-col">
                       <span className="text-[8px] font-black text-indigo-300 uppercase tracking-widest opacity-60">Assist</span>
                       <span className="text-lg font-black tabular-nums">{topScorers[0]?.assists || 0}</span>
                    </div>
                 </div>
              </div>
              <div className="absolute top-0 right-0 h-full flex items-center px-6 opacity-5 scale-125 rotate-12 pointer-events-none">
                 <Trophy size={160} />
              </div>
           </div>
        </Card>
      </div>

      {/* Leaderboard Section */}
      <div className="space-y-4">
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 uppercase italic tracking-tight">
               <Users size={18} className="text-indigo-600" /> Leaderboard
            </h2>
            <div className="relative max-w-sm w-full group">
               <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={14} />
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={e => setSearchQuery(e.target.value)}
                 placeholder="Qidirish..."
                 className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border-2 border-slate-100 text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all shadow-sm italic"
               />
            </div>
         </div>

         <Card className="p-0 overflow-hidden border-slate-200" variant="default">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] w-14">Rank</th>
                    <th className="px-3 py-3 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('name')}>
                       <div className="flex items-center gap-1 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                          O'yinchi <SortIcon column="name" />
                       </div>
                    </th>
                    <th className="px-3 py-3 text-center cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('goals')}>
                       <div className="flex items-center justify-center gap-1 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                          Gol <SortIcon column="goals" />
                       </div>
                    </th>
                    <th className="px-3 py-3 text-center cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('assists')}>
                       <div className="flex items-center justify-center gap-1 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                          Ast <SortIcon column="assists" />
                       </div>
                    </th>
                    <th className="px-3 py-3 text-center cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('discipline')}>
                       <div className="flex items-center justify-center gap-1 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                          Y/R <SortIcon column="discipline" />
                       </div>
                    </th>
                    <th className="px-5 py-3 text-right cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('score')}>
                       <div className="flex items-center justify-end gap-1 text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em]">
                          Index <SortIcon column="score" />
                       </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {sortedPlayers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-16 text-center">
                         <div className="space-y-2">
                            <Activity size={32} className="mx-auto text-slate-200" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Ma'lumot topilmadi</p>
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
                        <tr key={i} className={`group hover:bg-indigo-50/20 transition-all ${isCaptain ? 'bg-amber-50/10' : ''}`}>
                          <td className="px-5 py-3">
                             <div className="flex items-center justify-center w-6 h-6 rounded-lg text-[10px] font-black transition-all">
                                {rank === 1 ? <div className="bg-amber-100 text-amber-700 w-full h-full rounded-lg flex items-center justify-center shadow-sm">1</div> :
                                 rank === 2 ? <div className="bg-slate-100 text-slate-600 w-full h-full rounded-lg flex items-center justify-center">2</div> :
                                 rank === 3 ? <div className="bg-orange-100 text-orange-700 w-full h-full rounded-lg flex items-center justify-center">3</div> :
                                 <span className="text-slate-300 tabular-nums">{rank}</span>}
                             </div>
                          </td>
                          <td className="px-3 py-3">
                             <div className="flex flex-col">
                                <span className={`font-black text-xs group-hover:text-indigo-600 transition-colors flex items-center gap-1 uppercase italic ${isCaptain ? 'text-amber-900' : 'text-slate-900'}`}>
                                   {p.name}
                                   {isCaptain && <Crown size={10} className="text-amber-500" fill="currentColor" />}
                                </span>
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{getTeamName(p.teamId)}</span>
                             </div>
                          </td>
                          <td className="px-3 py-3 text-center">
                             <span className={`text-base font-black tabular-nums ${p.goals > 0 ? 'text-indigo-600' : 'text-slate-200'}`}>{p.goals}</span>
                          </td>
                          <td className="px-3 py-3 text-center">
                             <span className={`text-base font-black tabular-nums ${p.assists > 0 ? 'text-slate-600' : 'text-slate-200'}`}>{p.assists}</span>
                          </td>
                          <td className="px-3 py-3">
                             <div className="flex items-center justify-center gap-1">
                                {p.yellowCards > 0 && (
                                  <div className="flex items-center gap-0.5">
                                    <div className="w-1.5 h-2.5 bg-amber-400 rounded-[1px]"></div>
                                    <span className="text-[9px] font-black text-amber-700">{p.yellowCards}</span>
                                  </div>
                                )}
                                {p.redCards > 0 && (
                                  <div className="flex items-center gap-0.5">
                                    <div className="w-1.5 h-2.5 bg-rose-500 rounded-[1px]"></div>
                                    <span className="text-[9px] font-black text-rose-700">{p.redCards}</span>
                                  </div>
                                )}
                                {p.yellowCards === 0 && p.redCards === 0 && <span className="text-slate-200">-</span>}
                             </div>
                          </td>
                          <td className="px-5 py-3 text-right">
                             <span className={`text-sm font-black tabular-nums italic ${score > 0 ? 'text-emerald-600' : score < 0 ? 'text-rose-500' : 'text-slate-300'}`}>
                                {score > 0 ? '+' : ''}{score.toFixed(1)}
                             </span>
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

      {/* Info Card */}
      <Card variant="flat" className="p-4 border-indigo-100 bg-indigo-50/20">
        <div className="flex gap-3 items-start">
          <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-md shrink-0">
             <BarChart3 size={16} />
          </div>
          <div>
            <h4 className="text-[11px] font-black text-slate-900 uppercase italic tracking-tight mb-0.5">Index Score Algoritmi</h4>
            <p className="text-[9px] font-bold text-slate-500 leading-relaxed uppercase tracking-widest opacity-80">
               Gol: <span className="text-indigo-600">+3.0</span> • Assist: <span className="text-emerald-600">+1.5</span> • Sariq: <span className="text-rose-500">-1.0</span> • Qizil: <span className="text-rose-700">-3.0</span>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
