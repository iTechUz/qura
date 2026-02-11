
import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Trophy, Users, LayoutDashboard, Share2, Menu, Bell, BarChart3, ArrowLeft } from 'lucide-react';

export const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
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
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex bg-slate-50/50">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm">
              <Trophy size={18} />
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">EduCup</span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeSidebar}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <span className="shrink-0">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 mt-auto border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tizim Faol</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">Barcha ma'lumotlar avtomatik saqlanmoqda.</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-30 sticky top-0">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 lg:hidden">
                <Menu size={20} />
             </button>
             
             {!isHome && (
               <button 
                 onClick={() => navigate(-1)} 
                 className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 rounded-xl text-slate-600 transition-all border border-transparent hover:border-slate-100 group"
               >
                 <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                 <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">Ortga</span>
               </button>
             )}
             
             {isHome && <h2 className="text-sm font-bold text-slate-700 hidden sm:block">Tournament Manager Pro</h2>}
          </div>
          
          <div className="flex items-center gap-3">
             <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
                <Bell size={20} />
             </button>
             <div className="h-8 w-px bg-slate-200 mx-1"></div>
             <div className="flex items-center gap-2 pl-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                  A
                </div>
                <span className="text-xs font-bold text-slate-700 hidden md:block">Administrator</span>
             </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
