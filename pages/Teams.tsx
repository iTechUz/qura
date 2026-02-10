
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTournamentStore } from '../store';
import { Card } from '../shared/ui/Card';
import { Button } from '../shared/ui/Button';
import { 
  Plus, 
  X, 
  Trash2, 
  Users, 
  UserPlus, 
  Info, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

export const Teams: React.FC = () => {
  const { tournament, teams, addTeam, seedTeams, removeTeam, updateTeamPlayers, rounds } = useTournamentStore();
  const navigate = useNavigate();
  const [newTeamName, setNewTeamName] = React.useState('');
  const [activePlayerInputs, setActivePlayerInputs] = React.useState<Record<string, string>>({});

  if (!tournament) return null;

  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim() || teams.length >= 10) return;
    addTeam(newTeamName.trim());
    setNewTeamName('');
  };

  const handleAddPlayer = (teamId: string) => {
    const playerName = activePlayerInputs[teamId];
    if (!playerName?.trim()) return;
    
    const team = teams.find(t => t.id === teamId);
    if (!team || team.players.length >= tournament.playersPerTeam) return;

    if (!team.players.includes(playerName.trim())) {
      updateTeamPlayers(teamId, [...team.players, playerName.trim()]);
    }
    setActivePlayerInputs(prev => ({ ...prev, [teamId]: '' }));
  };

  const removePlayer = (teamId: string, playerName: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    updateTeamPlayers(teamId, team.players.filter(p => p !== playerName));
  };

  const isTournamentStarted = rounds.length > 0;

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Jamoalar Tarkibi</h1>
          <p className="text-sm text-slate-500">Ishtirokchilarni qo'shing va har bir jamoada <b className="text-indigo-600">{tournament.playersPerTeam} ta</b> o'yinchi bo'lishini ta'minlang.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-slate-100 rounded-xl text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jamoalar: </span>
              <span className="text-sm font-black text-slate-900">{teams.length} / 10</span>
           </div>
           {!isTournamentStarted && teams.length === 0 && (
            <Button variant="secondary" size="sm" className="rounded-xl" onClick={seedTeams}>
              <Sparkles size={14} className="mr-2" /> Demo Seeding
            </Button>
           )}
        </div>
      </header>

      {!isTournamentStarted && (
        <form onSubmit={handleAddTeam} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
          <input 
            disabled={teams.length >= 10}
            type="text" 
            value={newTeamName}
            onChange={e => setNewTeamName(e.target.value)}
            placeholder="Yangi jamoa nomi..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-base transition-all"
          />
          <Button type="submit" disabled={teams.length >= 10 || !newTeamName.trim()} className="rounded-xl px-8">
            <Plus size={18} className="mr-2" /> Qo'shish
          </Button>
        </form>
      )}

      {teams.length === 0 ? (
        <Card className="py-20 text-center border-dashed border-2 border-slate-200 bg-transparent shadow-none">
          <div className="max-w-xs mx-auto space-y-4">
            <Users size={48} className="mx-auto text-slate-300" />
            <p className="text-slate-500 font-medium">Hali jamoalar qo'shilmadi. Yuqoridagi maydon orqali boshlang.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team) => {
            const isFull = team.players.length >= tournament.playersPerTeam;
            
            return (
              <Card key={team.id} className={`relative transition-all ${isFull ? 'border-green-100 bg-green-50/20' : ''}`}>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${isFull ? 'bg-green-600' : 'bg-slate-900'}`}>
                        {team.name.charAt(0).toUpperCase()}
                     </div>
                     <div>
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                          {team.name}
                          {isFull && <CheckCircle2 size={16} className="text-green-500" />}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {team.players.length} / {tournament.playersPerTeam} O'yinchi
                        </p>
                     </div>
                  </div>
                  {!isTournamentStarted && (
                    <button onClick={() => removeTeam(team.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {!isFull && !isTournamentStarted && (
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={activePlayerInputs[team.id] || ''}
                        onChange={e => setActivePlayerInputs(prev => ({ ...prev, [team.id]: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddPlayer(team.id))}
                        placeholder="O'yinchi ismi..."
                        className="flex-1 px-3 py-2 bg-slate-50 rounded-lg text-sm border-none focus:ring-1 focus:ring-indigo-500 outline-none font-medium"
                      />
                      <Button size="sm" variant="secondary" className="rounded-lg" onClick={() => handleAddPlayer(team.id)}>
                        <Plus size={14} />
                      </Button>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {team.players.map(player => (
                      <div key={player} className="group flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-lg text-xs font-bold shadow-sm">
                        <span className="text-slate-700">{player}</span>
                        {!isTournamentStarted && (
                          <button onClick={() => removePlayer(team.id, player)} className="text-slate-300 hover:text-rose-500">
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                    {team.players.length === 0 && (
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider py-2 italic">Tarkib bo'sh...</p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {!isTournamentStarted && teams.length >= 2 && teams.every(t => t.players.length >= tournament.playersPerTeam) && (
        <div className="flex justify-center pt-10">
           <Button size="lg" className="rounded-xl px-12 py-6 text-xl shadow-lg hover:scale-105 transition-all" onClick={() => navigate('/bracket')}>
             Turnirni boshlash <ArrowRight size={20} className="ml-3" />
           </Button>
        </div>
      )}
    </div>
  );
};
