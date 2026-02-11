
import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Trophy, 
  Users, 
  LayoutDashboard, 
  Share2, 
  BarChart3, 
  ArrowLeft, 
  Zap,
  Bell,
  Menu,
  ChevronLeft
} from 'lucide-react';

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { to: '/', icon: <LayoutDashboard size={22} />, label: 'Asosiy' },
    { to: '/teams', icon: <Users size={22} />, label: 'Jamoalar' },
    { to: '/bracket', icon: <Trophy size={22} />, label: 'Jadval' },
    { to: '/stats', icon: <BarChart3 size={22} />, label: 'Statistika' },
    { to: '/export', icon: <Share2 size={22} />, label: 'Eksport' },
  ];

  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200/60 z-[60] flex-col">
        <div className="h-20 flex items-center px-8 shrink-0">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 rotate-3 shrink-0">
            <Trophy size={22} fill="currentColor" />
          </div>
          <div className="flex flex-col ml-3 overflow-hidden">
            <span className="font-black text-xl text-slate-900 tracking-tight uppercase italic leading-none pr-2">EduCup</span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1 whitespace-nowrap">Manager Pro</span>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto scrollbar-hide">
          <p className="mb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">Asosiy Menyu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                relative flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group
                ${isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="uppercase italic tracking-tight whitespace-nowrap pr-2">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100">
           <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100/50">
              <div className="flex items-center gap-2 mb-1">
                 <Zap size={14} className="text-amber-500" fill="currentColor" />
                 <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Tizim Online</span>
              </div>
              <p className="text-[10px] font-bold text-slate-500">Barcha ma'lumotlar avto-saqlanadi.</p>
           </div>
        </div>
      </aside>

      {/* --- STICKY HEADER (Mobile & Desktop) --- */}
      <header className="sticky top-0 z-[50] h-16 sm:h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-4 sm:px-8 lg:ml-72 transition-all">
        <div className="flex items-center gap-3">
          {/* Back Button for mobile when not on home */}
          {!isHome && (
            <button 
              onClick={() => navigate(-1)} 
              className="lg:hidden p-2 bg-slate-100 text-slate-600 rounded-xl active:scale-90 transition-transform"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          
          <div className="flex flex-col">
            <h2 className="text-sm sm:text-lg font-black text-slate-900 uppercase italic tracking-tight leading-none">
              {navItems.find(item => item.to === location.pathname)?.label || 'Boshqaruv'}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">LIVE STATUS</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 border border-white rounded-full"></span>
          </button>
          
          <div className="h-6 w-px bg-slate-200 hidden xs:block"></div>
          
          <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-slate-900 uppercase italic pr-1">Admin</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-[10px] shadow-lg shrink-0">
              AD
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 lg:ml-72 transition-all">
        <div className="p-4 sm:p-8 max-w-[1400px] mx-auto pb-24 lg:pb-8">
          <Outlet />
        </div>
      </main>

      {/* --- MOBILE BOTTOM NAVIGATION --- */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-[60] bg-white/90 backdrop-blur-2xl border-t border-slate-200/60 pb-safe-area">
        <div className="flex items-center justify-around h-16 sm:h-20 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all relative
                  ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}
              >
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-indigo-50 scale-110 shadow-sm' : ''}`}>
                  {React.cloneElement(item.icon as React.ReactElement, { 
                    size: isActive ? 22 : 20,
                    strokeWidth: isActive ? 2.5 : 2
                  })}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest transition-opacity ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                  {item.label === 'Asosiy' ? 'Dashboard' : item.label}
                </span>
                {isActive && (
                  <div className="absolute top-0 inset-x-0 flex justify-center">
                    <div className="w-8 h-1 bg-indigo-600 rounded-b-full shadow-[0_2px_10px_rgba(79,70,229,0.5)]"></div>
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Mobile specific Safe Area helper for notch phones */}
      <style>{`
        .pb-safe-area {
          padding-bottom: env(safe-area-inset-bottom, 0);
        }
      `}</style>
    </div>
  );
};
