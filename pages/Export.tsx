
import React from 'react';
import { useTournamentStore } from '../store';
import { Card } from '../shared/ui/Card';
import { Button } from '../shared/ui/Button';
import { 
  Copy, 
  Send, 
  Check, 
  AlertCircle, 
  Download, 
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
      description: 'Ishtirokchilar va jamoalar ro\'yxati',
      icon: <Terminal size={18} className="text-indigo-500" />,
      getMessage: () => formatTeamsMessage(teams),
      available: teams.length > 0
    },
    {
      id: 'current_round',
      title: 'Bosqich natijalari',
      description: 'Oxirgi o\'yinlar va g\'oliblar',
      icon: <Terminal size={18} className="text-emerald-500" />,
      getMessage: () => rounds.length > 0 ? formatRoundMessage(rounds[rounds.length - 1], teams) : '',
      available: rounds.length > 0
    },
    {
        id: 'champion',
        title: 'Chempionni eʼlon qilish',
        description: 'G\'olib jamoani tantanali tabriklash',
        icon: <Terminal size={18} className="text-amber-500" />,
        getMessage: () => {
          const champion = teams.find(t => t.id === tournament.championTeamId);
          return champion ? formatChampionMessage(champion.name, tournament.name) : '';
        },
        available: !!tournament.championTeamId
    }
  ];

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">E'lon va Arxiv</h1>
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
           <Button variant="outline" size="sm" className="rounded-xl" onClick={() => fileInputRef.current?.click()}>
              <Upload size={14} className="mr-2" /> Backupni ochish
           </Button>
        </div>
      </header>

      {/* Database/Export Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-slate-400 px-1">
           <Database size={14} />
           <h2 className="text-[10px] font-bold uppercase tracking-[0.2em]">Fayl ko'rinishida yuklash</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { title: 'O\'yinlar', ext: 'CSV', icon: <FileSpreadsheet />, action: () => exportMatchesToCSV(rounds, teams, tournament.name), disabled: rounds.length === 0 },
            { title: 'Jamoalar', ext: 'CSV', icon: <FileSpreadsheet />, action: () => exportTeamsToCSV(teams, tournament.name), disabled: teams.length === 0 },
            { title: 'To\'purarlar', ext: 'CSV', icon: <Medal />, action: () => exportScorersToCSV(rounds, teams, tournament.name), disabled: stats.topScorers.length === 0 },
            { title: 'Hisobot', ext: 'TXT', icon: <FileText />, action: () => downloadFile(formatTournamentSummary(tournament, teams, rounds), `${tournament.name}_Summary.txt`, 'text/plain'), disabled: false },
            { title: 'Backup', ext: 'JSON', icon: <FileJson />, action: () => exportToJSON({ tournament, teams, rounds }, tournament.name), disabled: false },
          ].map((item, i) => (
            <Card key={i} className="p-3 hover:bg-slate-50 transition-colors border-slate-200">
               <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                     <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                        {React.cloneElement(item.icon as React.ReactElement, { size: 14 })}
                     </div>
                     <span className="text-[9px] font-black text-slate-300 uppercase">{item.ext}</span>
                  </div>
                  <h4 className="text-[11px] font-bold text-slate-700 truncate">{item.title}</h4>
                  <Button variant="secondary" size="sm" className="w-full h-7 text-[9px] rounded-lg font-black" onClick={item.action} disabled={item.disabled}>
                     YUKLASH
                  </Button>
               </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Telegram Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-[#229ED9] px-1">
           <Send size={14} />
           <h2 className="text-[10px] font-bold uppercase tracking-[0.2em]">Telegram Publish Hub</h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {actions.map(action => {
            const fullMessage = action.getMessage();
            const parts = splitTelegramMessage(fullMessage);

            return (
              <Card key={action.id} className={`p-0 overflow-hidden ${!action.available ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                  {/* Info Column */}
                  <div className="p-6 lg:w-1/3 bg-slate-50/50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-slate-100">
                        {action.icon}
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 leading-none">{action.title}</h3>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">Xabar formati</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">{action.description}</p>
                    
                    {!action.available ? (
                      <div className="inline-flex items-center gap-2 text-[10px] font-bold text-amber-600 uppercase bg-amber-50 px-3 py-1 rounded-full">
                         <AlertCircle size={12} /> Ma'lumot yetarli emas
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-[10px] font-bold text-green-600 uppercase">
                         <Check size={12} /> Yuborishga tayyor
                      </div>
                    )}
                  </div>

                  {/* Message/Parts Column */}
                  <div className="p-6 flex-1 bg-white space-y-6">
                    {parts.map((part, pIdx) => (
                      <div key={pIdx} className="group relative space-y-3">
                        <div className="flex items-center justify-between px-1">
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                             {parts.length > 1 ? `Qism ${pIdx + 1} / ${parts.length}` : 'Xabar matni'}
                           </span>
                           <span className="text-[10px] font-bold text-slate-300">{part.length} belgi</span>
                        </div>
                        
                        <div className="relative">
                          <pre className="p-4 bg-slate-950 rounded-xl font-mono text-[12px] text-indigo-300 overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner border border-slate-800 scrollbar-hide">
                            {part}
                          </pre>
                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                             <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="flex-1 min-w-[120px] rounded-lg font-bold"
                            onClick={() => handleCopy(part, `${action.id}-${pIdx}`)}
                          >
                            {copiedId === `${action.id}-${pIdx}` ? (
                              <><Check size={14} className="mr-2 text-green-500" /> NUSXALANDI</>
                            ) : (
                              <><Copy size={14} className="mr-2" /> NUSXA OLISH</>
                            )}
                          </Button>
                          <Button 
                            size="sm"
                            className="flex-1 min-w-[120px] bg-[#229ED9] hover:bg-[#229ED9]/90 border-none rounded-lg font-bold"
                            onClick={() => handleShare(part)}
                          >
                            <Send size={14} className="mr-2" /> TELEGRAMGA
                            <ExternalLink size={12} className="ml-2 opacity-50" />
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
