
import React from 'react';
import { useTournamentStore } from '../store';
import { Card } from '../shared/ui/Card';
import { Badge } from '../shared/ui/Badge';
import { getTournamentStats, PlayerStat, TeamStat } from '../utils';
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
  Zap,
  Star,
  Shield,
  Clock,
  Layout
} from 'lucide-react';

type SortKey = 'goals' | 'assists' | 'discipline' | 'score' | 'name' | 'played';
type TeamSortKey = 'wins' | 'goalsFor' | 'gd' | 'name';

export const Stats: React.FC = () => {
  const { tournament, rounds, teams } = useTournamentStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'players' | 'teams'>('players');
  
  const [playerSort, setPlayerSort] = React.useState<{ key: SortKey; direction: 'asc' | 'desc' }>({
    key: 'score',
    direction: 'desc'
  });

  const [teamSort, setTeamSort] = React.useState<{ key: TeamSortKey; direction: 'asc' | 'desc' }>({
    key: 'wins',
    direction: 'desc'
  });

  if (!tournament) return null;

  const { totalMatches, totalGoals, totalCards, topScorers, topAssisters, mostCards, allPlayers, allTeams } = getTournamentStats(rounds, teams);
  
  const getTeamName = (id: string) => teams.find(t => t.id === id)?.name || 'N/A';

  const handlePlayerSort = (key: SortKey) => {
    setPlayerSort(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  // Add missing handleTeamSort function
  const handleTeamSort = (key: TeamSortKey) => {
    setTeamSort(prev => ({
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
        
        switch (playerSort.key) {
          case 'goals': valA = a.goals; valB = b.goals; break;
          case 'assists': valA = a.assists; valB = b.assists; break;
          case 'played': valA = a.matchesPlayed; valB = b.matchesPlayed; break;
          case 'discipline': valA = getDiscipline(a); valB = getDiscipline(b); break;
          case 'score': valA = calculateScore(a); valB = calculateScore(b); break;
          case 'name': valA = a.name; valB = b.name; break;
          default: valA = 0; valB = 0;
        }

        if (valA < valB) return playerSort.direction === 'asc' ? -1 : 1;
        if (valA > valB) return playerSort.direction === 'asc' ? 1 : -1;
        return 0;
      });
  }, [allPlayers, searchQuery, playerSort, teams]);

  const sortedTeams = React.useMemo(() => {
    return [...allTeams].sort((a, b) => {
      let valA: any, valB: any;
      switch (teamSort.key) {
        case 'wins': valA = a.wins; valB = b.wins; break;
        case 'goalsFor': valA = a.goalsFor; valB = b.goalsFor; break;
        case 'gd': valA = a.goalsFor - a.goalsAgainst; valB = b.goalsFor - b.goalsAgainst; break;
        case 'name': valA = a.name; valB = b.name; break;
        default: valA = 0; valB = 0;
      }
      if (valA < valB) return teamSort.direction === 'asc' ? -1 : 1;
      if (valA > valB) return teamSort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [allTeams, teamSort]);

  const SortIcon = ({ column, activeKey, direction }: { column: string, activeKey: string, direction: 'asc' | 'desc' }) => {
    if (activeKey !== column) return <Minus size={10} className="opacity-20" />;
    return direction === 'desc' ? <ChevronDown size={12} /> : <ChevronUp size={12} />;
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Turnir Statistikasi</h1>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-[0.2em] opacity-70">Professional tahlillar va individual natijalar.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
          <button onClick={() => setActiveTab('players')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'players' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>O'YINCHILAR</button>
          <button onClick={() => setActiveTab('teams')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'teams' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>JAMOALAR</button>
        </div>
      </header>

      {/* Hero Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="premium" className="relative overflow-hidden p-6">
           <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 blur-3xl -mr-8 -mt-8"></div>
           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
              <Star size={14} fill="currentColor" /> TOP SCORER
           </p>
           <h4 className="text-xl font-black italic tracking-tighter uppercase mb-2 truncate">
              {topScorers[0]?.goals > 0 ? topScorers[0].name : 'N/A'}
           </h4>
           <div className="flex items-end gap-3">
              <span className="text-4xl font-black italic leading-none">{topScorers[0]?.goals || 0}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">GOALS</span>
           </div>
        </Card>

        <Card variant="default" className="p-6">
           <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
              <Zap size={14} fill="currentColor" /> TOP ASSISTER
           </p>
           <h4 className="text-xl font-black italic tracking-tighter uppercase mb-2 truncate">
              {topAssisters[0]?.assists > 0 ? topAssisters[0].name : 'N/A'}
           </h4>
           <div className="flex items-end gap-3">
              <span className="text-4xl font-black italic leading-none text-slate-900">{topAssisters[0]?.assists || 0}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">ASSISTS</span>
           </div>
        </Card>

        <Card variant="default" className="p-6">
           <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
              <Shield size={14} fill="currentColor" /> DISCIPLINE
           </p>
           <h4 className="text-xl font-black italic tracking-tighter uppercase mb-2 truncate">
              {mostCards[0] ? mostCards[0].name : 'CLEAN'}
           </h4>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                 <div className="w-3 h-5 bg-amber-400 rounded-sm"></div>
                 <span className="text-2xl font-black italic">{mostCards[0]?.yellowCards || 0}</span>
              </div>
              <div className="flex items-center gap-1.5">
                 <div className="w-3 h-5 bg-rose-500 rounded-sm"></div>
                 <span className="text-2xl font-black italic">{mostCards[0]?.redCards || 0}</span>
              </div>
           </div>
        </Card>

        <Card className="bg-slate-900 text-white border-none p-6 flex flex-col justify-between">
           <div className="flex justify-between items-start">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">O'YINLAR</p>
              <Layout size={16} className="text-white/20" />
           </div>
           <div>
              <h3 className="text-4xl font-black italic tracking-tighter mb-1">{totalMatches}</h3>
              <div className="flex justify-between items-center">
                 <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">JAMI O'YINLAR</p>
                 <span className="text-[9px] font-black text-emerald-400 uppercase">{totalGoals} GOALS</span>
              </div>
           </div>
        </Card>
      </div>

      {activeTab === 'players' ? (
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
                   placeholder="O'yinchi yoki jamoa..."
                   className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border-2 border-slate-100 text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all shadow-sm italic"
                 />
              </div>
           </div>

           <Card className="p-0 overflow-hidden border-slate-200" variant="default">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] w-14">Rank</th>
                      <th className="px-3 py-3 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handlePlayerSort('name')}>
                         <div className="flex items-center gap-1 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                            O'yinchi <SortIcon column="name" activeKey={playerSort.key} direction={playerSort.direction} />
                         </div>
                      </th>
                      <th className="px-3 py-3 text-center cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handlePlayerSort('played')}>
                         <div className="flex items-center justify-center gap-1 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                            MP <SortIcon column="played" activeKey={playerSort.key} direction={playerSort.direction} />
                         </div>
                      </th>
                      <th className="px-3 py-3 text-center cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handlePlayerSort('goals')}>
                         <div className="flex items-center justify-center gap-1 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                            Gol <SortIcon column="goals" activeKey={playerSort.key} direction={playerSort.direction} />
                         </div>
                      </th>
                      <th className="px-3 py-3 text-center cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handlePlayerSort('assists')}>
                         <div className="flex items-center justify-center gap-1 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                            Ast <SortIcon column="assists" activeKey={playerSort.key} direction={playerSort.direction} />
                         </div>
                      </th>
                      <th className="px-3 py-3 text-center cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handlePlayerSort('discipline')}>
                         <div className="flex items-center justify-center gap-1 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                            Y/R <SortIcon column="discipline" activeKey={playerSort.key} direction={playerSort.direction} />
                         </div>
                      </th>
                      <th className="px-5 py-3 text-right cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handlePlayerSort('score')}>
                         <div className="flex items-center justify-end gap-1 text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em]">
                            Index <SortIcon column="score" activeKey={playerSort.key} direction={playerSort.direction} />
                         </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {sortedPlayers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-16 text-center">
                           <div className="space-y-2">
                              <Activity size={32} className="mx-auto text-slate-200" />
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">O'yinchilar topilmadi</p>
                           </div>
                        </td>
                      </tr>
                    ) : (
                      sortedPlayers.map((p, i) => {
                        const score = (p.goals * 3) + (p.assists * 1.5) - (p.yellowCards * 1) - (p.redCards * 3);
                        const team = teams.find(t => t.id === p.teamId);
                        const isCaptain = team?.captainName === p.name;
                        
                        return (
                          <tr key={i} className={`group hover:bg-indigo-50/20 transition-all ${isCaptain ? 'bg-amber-50/10' : ''}`}>
                            <td className="px-5 py-4">
                               <div className="flex items-center justify-center w-6 h-6 rounded-lg text-[10px] font-black transition-all">
                                  {i === 0 ? <div className="bg-amber-100 text-amber-700 w-full h-full rounded-lg flex items-center justify-center shadow-sm">1</div> :
                                   i === 1 ? <div className="bg-slate-100 text-slate-600 w-full h-full rounded-lg flex items-center justify-center">2</div> :
                                   i === 2 ? <div className="bg-orange-100 text-orange-700 w-full h-full rounded-lg flex items-center justify-center">3</div> :
                                   <span className="text-slate-300 tabular-nums">{i + 1}</span>}
                               </div>
                            </td>
                            <td className="px-3 py-4">
                               <div className="flex flex-col">
                                  <span className={`font-black text-xs group-hover:text-indigo-600 transition-colors flex items-center gap-1 uppercase italic ${isCaptain ? 'text-amber-900' : 'text-slate-900'}`}>
                                     {p.name}
                                     {isCaptain && <Crown size={10} className="text-amber-500" fill="currentColor" />}
                                  </span>
                                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{getTeamName(p.teamId)}</span>
                               </div>
                            </td>
                            <td className="px-3 py-4 text-center">
                               <span className="text-xs font-bold text-slate-400 tabular-nums">{p.matchesPlayed}</span>
                            </td>
                            <td className="px-3 py-4 text-center">
                               <span className={`text-base font-black tabular-nums ${p.goals > 0 ? 'text-indigo-600' : 'text-slate-200'}`}>{p.goals}</span>
                            </td>
                            <td className="px-3 py-4 text-center">
                               <span className={`text-base font-black tabular-nums ${p.assists > 0 ? 'text-emerald-600' : 'text-slate-200'}`}>{p.assists}</span>
                            </td>
                            <td className="px-3 py-4">
                               <div className="flex items-center justify-center gap-1.5">
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
                            <td className="px-5 py-4 text-right">
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
      ) : (
        <div className="space-y-4">
           <div className="px-1">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 uppercase italic tracking-tight">
                 <Shield size={18} className="text-indigo-600" /> Jamoalar Reytingi
              </h2>
           </div>

           <Card className="p-0 overflow-hidden border-slate-200" variant="default">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] w-14">№</th>
                      <th className="px-3 py-3 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleTeamSort('name')}>
                         <div className="flex items-center gap-1 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                            Jamoa <SortIcon column="name" activeKey={teamSort.key} direction={teamSort.direction} />
                         </div>
                      </th>
                      <th className="px-3 py-3 text-center">
                         <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">O'yin</div>
                      </th>
                      <th className="px-3 py-3 text-center cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleTeamSort('wins')}>
                         <div className="flex items-center justify-center gap-1 text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em]">
                            G'alaba <SortIcon column="wins" activeKey={teamSort.key} direction={teamSort.direction} />
                         </div>
                      </th>
                      <th className="px-3 py-3 text-center cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleTeamSort('goalsFor')}>
                         <div className="flex items-center justify-center gap-1 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                            Gollar <SortIcon column="goalsFor" activeKey={teamSort.key} direction={teamSort.direction} />
                         </div>
                      </th>
                      <th className="px-5 py-3 text-right cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleTeamSort('gd')}>
                         <div className="flex items-center justify-end gap-1 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                            Farq (GD) <SortIcon column="gd" activeKey={teamSort.key} direction={teamSort.direction} />
                         </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {sortedTeams.map((t, i) => {
                      const gd = t.goalsFor - t.goalsAgainst;
                      return (
                        <tr key={t.id} className="group hover:bg-indigo-50/20 transition-all">
                          <td className="px-5 py-4">
                             <span className="text-[10px] font-black text-slate-400">{i + 1}</span>
                          </td>
                          <td className="px-3 py-4">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-[10px] italic">
                                   {t.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-black text-xs uppercase italic text-slate-900">{t.name}</span>
                             </div>
                          </td>
                          <td className="px-3 py-4 text-center">
                             <span className="text-xs font-bold text-slate-400">{t.matches}</span>
                          </td>
                          <td className="px-3 py-4 text-center">
                             <span className="text-base font-black italic text-indigo-600">{t.wins}</span>
                          </td>
                          <td className="px-3 py-4 text-center">
                             <span className="text-xs font-bold text-slate-500">{t.goalsFor} : {t.goalsAgainst}</span>
                          </td>
                          <td className="px-5 py-4 text-right">
                             <span className={`text-sm font-black italic ${gd > 0 ? 'text-emerald-500' : gd < 0 ? 'text-rose-500' : 'text-slate-300'}`}>
                                {gd > 0 ? '+' : ''}{gd}
                             </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
           </Card>
        </div>
      )}

      {/* Stats Legend / Info */}
      <Card variant="flat" className="p-5 border-slate-100 bg-white/50">
        <div className="flex flex-col md:flex-row gap-8">
           <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-md shrink-0">
                 <BarChart3 size={16} />
              </div>
              <div>
                <h4 className="text-[10px] font-black text-slate-900 uppercase italic tracking-tight mb-1">Index Score Algoritmi</h4>
                <p className="text-[9px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest opacity-80">
                   Gol: <span className="text-indigo-600">+3.0</span> • Assist: <span className="text-emerald-600">+1.5</span> • Sariq: <span className="text-rose-400">-1.0</span> • Qizil: <span className="text-rose-600">-3.0</span>
                </p>
              </div>
           </div>
           <div className="flex items-start gap-3 border-l-0 md:border-l border-slate-100 md:pl-8">
              <div className="p-2 bg-slate-900 text-white rounded-lg shadow-md shrink-0">
                 <Clock size={16} />
              </div>
              <div>
                <h4 className="text-[10px] font-black text-slate-900 uppercase italic tracking-tight mb-1">Qisqartmalar</h4>
                <p className="text-[9px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest opacity-80">
                   MP: O'ynalgan o'yinlar • Ast: Assistlar • Y/R: Kartochkalar • GD: To'plar nisbati
                </p>
              </div>
           </div>
        </div>
      </Card>
    </div>
  );
};
