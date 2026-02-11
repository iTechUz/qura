
import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Trophy, 
  Users, 
  LayoutDashboard, 
  Share2, 
  Menu, 
  Bell, 
  BarChart3, 
  ArrowLeft, 
  LogOut, 
  Zap,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

export const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/teams', icon: <Users size={20} />, label: 'Jamoalar' },
    { to: '/bracket', icon: <Trophy size={20} />, label: 'Jadval' },
    { to: '/stats', icon: <BarChart3 size={20} />, label: 'Statistika' },
    { to: '/export', icon: <Share2 size={20} />, label: 'Telegram Hub' },
  ];

  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const isHome = location.pathname === '/';

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  React.useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  return (
    <div className="min-h-screen flex bg-slate-50/50 overflow-x-hidden">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden transition-all duration-300" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] bg-white border-r border-slate-200/60 transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}
        w-72 shadow-2xl lg:shadow-none
      `}>
        <div className="h-full flex flex-col relative">
          {/* Mobile Close Button */}
          <button onClick={closeSidebar} className="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-500">
            <X size={24} />
          </button>

          {/* Collapse Toggle Button (Desktop Only) */}
          <button 
            onClick={toggleCollapse}
            className="hidden lg:flex absolute -right-3 top-24 w-6 h-6 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 shadow-sm z-50 transition-all"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          {/* Logo Section */}
          <div className={`h-20 flex items-center transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'px-8'} shrink-0`}>
            <div className={`w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 rotate-3 shrink-0`}>
              <Trophy size={22} fill="currentColor" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col ml-3 animate-in fade-in duration-500 overflow-hidden">
                <span className="font-black text-xl text-slate-900 tracking-tight uppercase italic leading-none pr-2">EduCup</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1 whitespace-nowrap">Manager Pro</span>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className={`flex-1 py-6 overflow-y-auto space-y-1.5 scrollbar-hide transition-all ${isCollapsed ? 'px-2' : 'px-4'}`}>
            <p className={`mb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] transition-all ${isCollapsed ? 'text-center' : 'px-4'}`}>
              {isCollapsed ? '•••' : 'Asosiy Menyu'}
            </p>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeSidebar}
                title={isCollapsed ? item.label : ''}
                className={({ isActive }) => `
                  relative flex items-center rounded-2xl text-sm font-bold transition-all group
                  ${isCollapsed ? 'justify-center p-3.5' : 'gap-3 px-4 py-3.5'}
                  ${isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                {({ isActive }) => (
                  <>
                    <span className={`shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span className="uppercase italic tracking-tight animate-in fade-in slide-in-from-left-2 duration-300 whitespace-nowrap pr-2">
                        {item.label}
                      </span>
                    )}
                    {isActive && !isCollapsed && (
                      <div className="absolute left-[-1rem] w-1.5 h-8 bg-indigo-600 rounded-r-full"></div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className={`mt-auto border-t border-slate-100 transition-all ${isCollapsed ? 'p-2' : 'p-6'} space-y-4`}>
            {!isCollapsed ? (
              <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100/50 relative overflow-hidden group animate-in fade-in zoom-in duration-300">
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Zap size={80} />
                </div>
                <div className="flex items-center gap-2 mb-2 relative z-10">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Tizim Online</span>
                </div>
                <p className="text-[11px] font-bold text-slate-500 leading-tight relative z-10">Ma'lumotlar real-vaqtda saqlanmoqda.</p>
              </div>
            ) : (
              <div className="flex justify-center py-2 text-emerald-500" title="Tizim Online">
                <Zap size={18} fill="currentColor" />
              </div>
            )}
            
            <button className={`flex items-center text-slate-400 hover:text-rose-500 transition-colors text-xs font-black uppercase tracking-widest w-full ${isCollapsed ? 'justify-center py-2' : 'gap-3 px-4 py-2'}`}>
              <LogOut size={16} />
              {!isCollapsed && <span className="animate-in fade-in duration-300">Chiqish</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-4 sm:px-8 shrink-0 z-[40] sticky top-0">
          <div className="flex items-center gap-2 sm:gap-4">
             <button onClick={() => setIsSidebarOpen(true)} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 lg:hidden transition-colors">
                <Menu size={20} />
             </button>
             
             {!isHome && (
               <button 
                 onClick={() => navigate(-1)} 
                 className="flex items-center gap-2 px-3 sm:px-4 py-2 hover:bg-slate-50 rounded-xl text-slate-700 transition-all border border-slate-100 shadow-sm group"
               >
                 <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden sm:inline pr-1">Ortga</span>
               </button>
             )}
             
             {isHome && (
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 hidden xs:block"></div>
                 <h2 className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] truncate max-w-[100px] sm:max-w-none">Boshqaruv Paneli</h2>
               </div>
             )}
          </div>
          
          <div className="flex items-center gap-1 sm:gap-3">
             <button 
                onClick={toggleFullScreen}
                title={isFullScreen ? "Kichraytirish" : "To'liq ekran"}
                className="hidden sm:flex p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
             >
                {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
             </button>
             
             <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
             </button>
             
             <div className="h-8 w-px bg-slate-200 mx-0.5 sm:mx-1"></div>
             
             <div className="flex items-center gap-2 sm:gap-3 pl-1 sm:pl-2 group cursor-pointer">
                <div className="text-right hidden sm:block">
                   <p className="text-xs font-black text-slate-900 leading-none mb-1 italic pr-2">Admin</p>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">EduStaff</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-[10px] sm:text-xs shadow-lg shadow-slate-200 transition-transform group-hover:scale-105 shrink-0">
                  AD
                </div>
             </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10">
          <div className="w-full max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
