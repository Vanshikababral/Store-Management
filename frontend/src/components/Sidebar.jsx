import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Box, ShoppingCart, 
  History, Users, ChevronLeft, ChevronRight, LogOut, UserCog, Layers
} from 'lucide-react';

const Sidebar = ({ onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const username = localStorage.getItem('username') || 'User';

  const linkClass = ({ isActive }) => 
    `flex items-center gap-3 ${isCollapsed ? 'justify-center px-0' : 'px-8'} py-4 text-[10px] font-black uppercase tracking-widest transition-all ${
      isActive ? 'bg-primary text-secondary border-r-4 border-accent' : 'text-primary/60 hover:bg-primary/5'
    }`;

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-72'} bg-secondary border-r border-primary/10 flex flex-col h-screen sticky top-0 transition-all duration-300`}>
      <div className={`p-8 border-b border-primary/5 relative ${isCollapsed ? 'px-4 text-center' : ''}`}>
        {!isCollapsed ? (
          <>
            <h1 className="text-xl font-black text-primary italic uppercase">M Core</h1>
            <div className="mt-4">
              <p className="text-[11px] font-bold text-primary uppercase">{username}</p>
              <div className={`inline-block px-2 py-1 rounded text-[8px] font-black uppercase mt-1 ${
                isAdmin ? 'bg-accent/20 text-primary' : 'bg-neutral/40 text-primary'
              }`}>
                {isAdmin ? 'Access: Manager' : 'Access: Staff'}
              </div>
            </div>
          </>
        ) : (
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-secondary font-black italic mx-auto">
            M
          </div>
        )}
        
        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-primary/10 rounded-full flex items-center justify-center text-primary shadow-sm hover:bg-primary hover:text-white transition-all z-50 md:flex hidden"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
      
      <nav className="flex-grow py-6">
        <NavLink to="/" className={linkClass}>
          <LayoutDashboard size={18} />
          {!isCollapsed && <span>Dashboard</span>}
        </NavLink>
        <NavLink to="/inventory" className={linkClass}>
          <Box size={18} />
          {!isCollapsed && <span>Inventory Matrix</span>}
        </NavLink>
        <NavLink to="/departments" className={linkClass}>
          <Layers size={18} />
          {!isCollapsed && <span>Department Matrix</span>}
        </NavLink>
        <NavLink to="/pos" className={linkClass}>
          <ShoppingCart size={18} />
          {!isCollapsed && <span>Sales Terminal</span>}
        </NavLink>
        <NavLink to="/transactions" className={linkClass}>
          <History size={18} />
          {!isCollapsed && <span>Audit Log</span>}
        </NavLink>
        <NavLink to="/profile" className={linkClass}>
          <UserCog size={18} />
          {!isCollapsed && <span>My Profile</span>}
        </NavLink>
        {isAdmin && (
          <NavLink to="/users" className={linkClass}>
            <Users size={18} />
            {!isCollapsed && <span>Employee Network</span>}
          </NavLink>
        )}
      </nav>

      <div className={`p-6 border-t border-primary/5 ${isCollapsed ? 'px-4' : ''}`}>
        <button 
          onClick={onLogout} 
          title="Terminate Session"
          className={`group flex items-center justify-center gap-2 w-full py-3 text-[10px] font-black uppercase text-accent border border-accent/20 rounded-xl hover:bg-accent hover:text-white transition-all`}
        >
          <LogOut size={16} />
          {!isCollapsed && <span>Terminate</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;