import React from 'react';

const GlassCard = ({ children, className = "", hover = true }) => {
  return (
    <div className={`
      bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl transition-all duration-300
      ${hover ? 'hover:bg-white/[0.06] hover:border-white/20' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default GlassCard;