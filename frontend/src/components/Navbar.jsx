import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/user-management', label: 'Kullanıcılar' },
  { path: '/review', label: 'İnceleme' },
  { path: '/device-panel', label: 'Cihaz Paneli' },
];

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4">
      <div className="relative group">
        {/* Arka plan parlama efekti */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
        
        <div className="relative flex items-center gap-4 md:gap-6 px-6 py-3 bg-white/[0.05] backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-white/20">
          
          {/* Logo - whitespace-nowrap eklendi */}
          <div className="flex items-center gap-3 pr-4 border-r border-white/10 shrink-0 whitespace-nowrap">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <span className="text-white font-black text-base">P</span>
            </div>
            <span className="text-lg font-extrabold tracking-tight text-white drop-shadow-md">
              Pati<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">Kampus</span>
            </span>
          </div>

          {/* Menü Elemanları */}
          <div className="flex items-center gap-1">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-xl transition-all duration-500 text-sm font-medium overflow-hidden whitespace-nowrap shrink-0
                  ${isActive 
                    ? 'text-white bg-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] border border-white/20' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`
                }
                end={item.path === '/'}
              >
                {({ isActive }) => (
                  <div className="flex flex-col items-center">
                    {item.label}
                    {/* Aktif olduğunda alt parıltı */}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-80" />
                    )}
                  </div>
                )}
              </NavLink>
            ))}
            
            {/* Çıkış Yap Butonu */}
            <button
              onClick={handleLogout}
              className="relative px-4 py-2 ml-2 rounded-xl transition-all duration-500 text-sm font-medium overflow-hidden whitespace-nowrap shrink-0 text-red-400 hover:text-white hover:bg-red-500/20"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;