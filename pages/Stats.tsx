
import React from 'react';
import { useTournamentStore } from '../store';
import { Card } from '../shared/ui/Card';
import { getTournamentStats, PlayerStat } from '../utils';
import { 
  Trophy, 
  Activity, 
  Target, 
  Search, 
  BarChart3,
  Users,
  AlertCircle
} from 'lucide-react';

export const Stats: React.FC = () => {
  const { tournament, rounds, teams } = useTournamentStore();
  const [activeTab, setActiveTab] = React.useState<'goals' | 'assists' | 'all'>('goals');
  const [searchQuery, setSearchQuery] = React.useState('');

  if (!tournament) return null;

  const { totalMatches, totalGoals, topScorers, topAssisters, allPlayers } = getTournamentStats(rounds, teams);
  const getTeamName = (id: string) => teams.find(t => t.id === id)?.name || 'N/A';

  const filteredPlayers = allPlayers
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || getTeamName(p.teamId).toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.goals - a.goals || b.assists - a.assists || a.name.localeCompare(b.name));

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Turnir Statistikasi</h1>
          <p className="text-sm text-slate-500">O'yinlar va individual ko'rsatkichlar tahlili.</p>
        </div>
        
        <div className="flex p-1 bg-slate-100 rounded-xl">
           <button onClick={() => setActiveTab('goals')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'goals' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>GOLLAR</button>
           <button onClick={() => setActiveTab('assists')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'assists' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>ASSISTLAR</button>
           <button onClick={() => setActiveTab('all')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>HAMMASI</button>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="flex flex-col items-center text-center p-4">
           <Activity className="text-indigo-500 mb-2" size={20} />
           <h4 className="text-2xl font-black text-slate-900">{totalMatches}</h4>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">O'yinlar</p>
        </Card>
        <Card className="flex flex-col items-center text-center p-4">
           <Target className="text-indigo-500 mb-2" size={20} />
           <h4 className="text-2xl font-black text-slate-900">{totalGoals}</h4>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gollar</p>
        </Card>
        <Card className="flex flex-col items-center text-center p-4 lg:col-span-2">
           <div className="flex items-center gap-2 mb-2 text-indigo-500">
              <Trophy size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Top To'purar</span>
           </div>
           <h4 className="text-xl font-black text-slate-900 truncate max-w-full">
             {topScorers[0]?.goals > 0 ? topScorers[0].name : '-'}
           </h4>
        </Card>
      </div>

      <div className="space-y-4">
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
               <Users size={18} /> Ishtirokchilar Reytingi
            </h2>
            <div className="relative max-w-xs w-full">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={e => setSearchQuery(e.target.value)}
                 placeholder="Qidiruv..."
                 className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
               />
            </div>
         </div>

         <Card className="p-0 overflow-hidden border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">O'yinchi</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">Jamoa</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase text-center">G</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase text-center">A</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase text-center">K</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase text-right">Ball</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredPlayers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-20 text-center text-slate-400 text-sm italic font-medium">Ma'lumot topilmadi</td>
                    </tr>
                  ) : (
                    filteredPlayers.map((p, i) => {
                      const score = (p.goals * 3) + (p.assists * 1.5) - (p.yellowCards * 1) - (p.redCards * 3);
                      return (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900 text-sm">{p.name}</td>
                          <td className="px-6 py-4">
                             <span className="text-[10px] font-bold text-slate-500 px-2 py-0.5 bg-slate-100 rounded tracking-tight">
                                {getTeamName(p.teamId)}
                             </span>
                          </td>
                          <td className="px-4 py-4 text-center font-black text-indigo-600 text-sm">{p.goals}</td>
                          <td className="px-4 py-4 text-center font-bold text-slate-600 text-sm">{p.assists}</td>
                          <td className="px-4 py-4 text-center">
                             <div className="flex items-center justify-center gap-1">
                                {p.yellowCards > 0 && <span className="w-2 h-3 bg-amber-400 rounded-sm"></span>}
                                {p.redCards > 0 && <span className="w-2 h-3 bg-rose-500 rounded-sm"></span>}
                                {p.yellowCards === 0 && p.redCards === 0 && <span className="text-slate-200">-</span>}
                             </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <span className={`text-xs font-black ${score > 0 ? 'text-green-600' : score < 0 ? 'text-rose-500' : 'text-slate-400'}`}>
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
    </div>
  );
};
