
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Team, Round, Tournament, TournamentState, Match } from './types';
import { buildRound1Matches, buildNextRoundMatches } from './utils';

interface TournamentActions {
  initTournament: (name: string, playersPerTeam: number, date?: string) => void;
  resetTournament: () => void;
  addTeam: (name: string) => void;
  seedTeams: () => void;
  removeTeam: (id: string) => void;
  updateTeamPlayers: (id: string, players: string[]) => void;
  startTournament: () => void;
  reShuffleRound1: () => void;
  updateMatch: (roundIdx: number, matchId: string, updates: Partial<Match>) => void;
  generateNextRound: () => void;
  resetDownstream: (roundIdx: number) => void;
  importTournamentData: (data: TournamentState) => void;
}

export const useTournamentStore = create<TournamentState & TournamentActions>()(
  persist(
    (set, get) => ({
      tournament: null,
      teams: [],
      rounds: [],

      initTournament: (name, playersPerTeam, date) => set({
        tournament: { 
          id: uuidv4(), 
          name, 
          playersPerTeam: Math.max(1, playersPerTeam || 5), 
          date, 
          createdAt: Date.now() 
        },
        teams: [],
        rounds: [],
      }),

      resetTournament: () => set({ tournament: null, teams: [], rounds: [] }),

      addTeam: (name) => {
        const { teams, rounds } = get();
        if (rounds.length > 0) return;
        if (teams.length >= 10) return;
        if (teams.some(t => t.name.toLowerCase() === name.toLowerCase())) return;
        const newTeam: Team = { id: uuidv4(), name, players: [] };
        set({ teams: [...teams, newTeam] });
      },

      seedTeams: () => {
        const { rounds, tournament } = get();
        if (rounds.length > 0 || !tournament) return;
        
        const demoTeamNames = ['Barcelona', 'Real Madrid', 'Man City', 'Bayern', 'Arsenal', 'Liverpool', 'PSG', 'Inter'];
        const commonSurnames = ['Aliyev', 'Valiyev', 'Gulyamov', 'Karimov', 'Sultonov', 'Rahimov', 'Azimov', 'Toshpo\'latov', 'Ismoilov', 'Rustamov', 'Yusupov'];
        
        const newTeams: Team[] = demoTeamNames.map((name, teamIdx) => {
          const players: string[] = [];
          for (let i = 0; i < tournament.playersPerTeam; i++) {
            const surname = commonSurnames[(teamIdx + i) % commonSurnames.length];
            players.push(`${surname} #${i + 1}`);
          }
          return {
            id: uuidv4(),
            name: name,
            players: players
          };
        });
        set({ teams: newTeams });
      },

      removeTeam: (id) => set(state => {
        if (state.rounds.length > 0) return state;
        return { teams: state.teams.filter(t => t.id !== id) };
      }),

      updateTeamPlayers: (id, players) => set(state => ({
        teams: state.teams.map(t => t.id === id ? { ...t, players } : t)
      })),

      startTournament: () => {
        const { teams, tournament } = get();
        if (!tournament) return;
        
        const isIncomplete = teams.some(t => t.players.length < tournament.playersPerTeam);
        if (isIncomplete || teams.length < 2) return;

        const round1Matches = buildRound1Matches(teams);
        set({ 
          rounds: [{ index: 0, matches: round1Matches }], 
          tournament: { ...tournament, championTeamId: undefined } 
        });
      },

      reShuffleRound1: () => {
        const { teams, rounds } = get();
        if (rounds.length === 0) return;
        const hasStarted = rounds[0].matches.some(m => m.status === 'finished');
        if (hasStarted) return;
        
        const round1Matches = buildRound1Matches(teams);
        set({ rounds: [{ index: 0, matches: round1Matches }] });
      },

      updateMatch: (roundIdx, matchId, updates) => set(state => {
        const newRounds = state.rounds.map((round, idx) => {
          if (idx !== roundIdx) return round;
          return {
            ...round,
            matches: round.matches.map(m => m.id === matchId ? { ...m, ...updates } : m)
          };
        });

        const updatedRound = newRounds[roundIdx];
        const updatedMatch = updatedRound.matches.find(m => m.id === matchId);
        
        let newChampionId = state.tournament?.championTeamId;
        
        // Check for champion in final round
        if (updatedRound.matches.length === 1) {
             newChampionId = updatedMatch?.winnerTeamId;
        }

        return { 
          rounds: newRounds, 
          tournament: state.tournament ? { ...state.tournament, championTeamId: newChampionId } : null 
        };
      }),

      generateNextRound: () => {
        const { rounds } = get();
        const lastRound = rounds[rounds.length - 1];
        
        if (lastRound.matches.some(m => !m.winnerTeamId)) return;
        if (lastRound.matches.length === 1) return;

        const nextMatches = buildNextRoundMatches(lastRound);
        set({ rounds: [...rounds, { index: lastRound.index + 1, matches: nextMatches }] });
      },

      resetDownstream: (roundIdx) => set(state => ({
        rounds: state.rounds.slice(0, roundIdx + 1),
        tournament: state.tournament ? { ...state.tournament, championTeamId: undefined } : null
      })),

      importTournamentData: (data) => set({
        tournament: data.tournament,
        teams: data.teams,
        rounds: data.rounds
      })
    }),
    { name: 'educup-storage' }
  )
);
