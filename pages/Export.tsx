
import React from 'react';
import { useTournamentStore } from '../store';
import { Card } from '../shared/ui/Card';
import { Button } from '../shared/ui/Button';
import { 
  Copy, 
  Send, 
  Check, 
  AlertCircle, 
  FileJson, 
  FileSpreadsheet, 
  Database, 
  Upload, 
  FileText, 
  Medal,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { 
  formatTeamsMessage, 
  formatRoundMessage, 
  formatChampionMessage, 
  buildTelegramShareUrl,
  splitTelegramMessage,
  exportToJSON,
  exportMatchesToCSV,
  exportTeamsToCSV,
  exportScorersToCSV,
  formatTournamentSummary,
  downloadFile,
  getTournamentStats
} from '../utils';

export const Export: React.FC = () => {
  const { tournament, teams, rounds, importTournamentData } = useTournamentStore();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!tournament) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = (text: string) => {
    window.open(buildTelegramShareUrl(text), '_blank');
  };

  const stats = getTournamentStats(rounds, teams);

  const actions = [
    {
      id: 'teams',
      title: 'Jamoalar tarkibi',
      description: 'Ishtirokchilar va jamoalar ro\'yxati xabari.',
      icon: <Terminal size={18} className="text-indigo-500" />,
      getMessage: () => formatTeamsMessage(teams),
      available: teams.length > 0
    },
    {
      id: 'current_round',
      title: 'Bosqich natijalari',
      description: 'Oxirgi o\'yinlar va g\'oliblar xabari.',
      icon: <Terminal size={18} className="text-emerald-500" />,
      getMessage: () => rounds.length > 0 ? formatRoundMessage(rounds[rounds.length - 1], teams) : '',
      available: rounds.length > 0
    },
    {
        id: 'champion',
        title: 'Chempionni eʼlon qilish',
        description: 'G\'olib jamoani tantanali tabriklash xabari.',
        icon: <Terminal size={18} className="text-amber-500" />,
        getMessage: () => {
          const champion = teams.find(t => t.id === tournament.championTeamId);
          return champion ? formatChampionMessage(champion.name, tournament.name) : '';
        },
        available: !!tournament.championTeamId
    }
  ];

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Telegram Hub</h1>
          <p className="text-sm text-slate-500">Ma'lumotlarni Telegramga yuborish va nusxalash markazi.</p>
        </div>
        
        <div className="flex gap-2">
           <input type="file" ref={fileInputRef} onChange={(e) => {
             const file = e.target.files?.[0];
             if (file) {
               const reader = new FileReader();
               reader.onload = (ev) => {
                 try {
                   const json = JSON.parse(ev.target?.result as string);
                   if (confirm('Joriy ma\'lumotlar o\'chiriladi. Davom etasizmi?')) importTournamentData(json);
                 } catch (err) { alert('Xato format'); }
               };
               reader.readAsText(file);
             }
           }} accept=".json" className="hidden" />
           <Button variant="outline" size="sm" className="rounded-xl font-bold" onClick={() => fileInputRef.current?.click()}>
              <Upload size={14} className="mr-2" /> Backup ochish
           </Button>
        </div>
      </header>

      {/* File Export Grid */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 px-1">
           <Database size={16} className="text-slate-400" />
           <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Arxiv fayllarini yuklash</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { title: 'O\'yinlar', ext: 'CSV', icon: <FileSpreadsheet />, action: () => exportMatchesToCSV(rounds, teams, tournament.name), disabled: rounds.length === 0 },
            { title: 'Jamoalar', ext: 'CSV', icon: <FileSpreadsheet />, action: () => exportTeamsToCSV(teams, tournament.name), disabled: teams.length === 0 },
            { title: 'To\'purarlar', ext: 'CSV', icon: <Medal />, action: () => exportScorersToCSV(rounds, teams, tournament.name), disabled: stats.topScorers.length === 0 },
            { title: 'Hisobot', ext: 'TXT', icon: <FileText />, action: () => downloadFile(formatTournamentSummary(tournament, teams, rounds), `${tournament.name}_Summary.txt`, 'text/plain'), disabled: false },
            { title: 'Backup', ext: 'JSON', icon: <FileJson />, action: () => exportToJSON({ tournament, teams, rounds }, tournament.name), disabled: false },
          ].map((item, i) => (
            <Card key={i} className="p-4 text-center border-slate-200 hover:border-indigo-200">
               <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-slate-50 text-slate-400 rounded-xl">
                     {React.cloneElement(item.icon as React.ReactElement, { size: 20 })}
                  </div>
                  <h4 className="text-[11px] font-black text-slate-900">{item.title}</h4>
                  <Button variant="secondary" size="sm" className="w-full text-[10px] font-black h-8 rounded-lg" onClick={item.action} disabled={item.disabled}>
                     YUKLASH
                  </Button>
               </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Telegram Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 px-1">
           <Send size={16} className="text-[#229ED9]" />
           <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Publishing Hub</h2>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {actions.map(action => {
            const fullMessage = action.getMessage();
            const parts = splitTelegramMessage(fullMessage);

            return (
              <Card key={action.id} className={`${!action.available ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="lg:w-1/3 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                        {action.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900 leading-tight">{action.title}</h3>
                        <p className="text-xs text-slate-500 font-medium">{action.description}</p>
                      </div>
                    </div>
                    {!action.available && (
                      <div className="flex items-center gap-2 text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-2 rounded-xl">
                         <AlertCircle size={14} /> Ma'lumot yetarli emas
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-6">
                    {parts.map((part, pIdx) => (
                      <div key={pIdx} className="space-y-3">
                        <div className="flex items-center justify-between text-[10px] font-black text-slate-400 px-1">
                           <span>{parts.length > 1 ? `Qism ${pIdx + 1} / ${parts.length}` : 'Xabar matni'}</span>
                           <span>{part.length} belgi</span>
                        </div>
                        <div className="p-5 bg-slate-950 rounded-2xl font-mono text-xs text-indigo-300 whitespace-pre-wrap leading-relaxed border border-slate-800 shadow-inner">
                          {part}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" className="flex-1 rounded-xl font-bold h-11" onClick={() => handleCopy(part, `${action.id}-${pIdx}`)}>
                            {copiedId === `${action.id}-${pIdx}` ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                            <span className="ml-2">{copiedId === `${action.id}-${pIdx}` ? 'NUSXALANDI' : 'NUSXA OLISH'}</span>
                          </Button>
                          <Button size="sm" className="flex-1 bg-[#229ED9] hover:bg-[#229ED9]/90 border-none rounded-xl font-bold h-11" onClick={() => handleShare(part)}>
                            <Send size={16} className="mr-2" /> TELEGRAM
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
};
