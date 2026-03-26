import React from 'react';

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    success: "border-green-500/30 text-green-400 bg-green-500/10",
    error: "border-red-500/30 text-red-400 bg-red-500/10",
    warning: "border-yellow-500/30 text-yellow-400 bg-yellow-500/10",
    info: "border-blue-500/30 text-blue-400 bg-blue-500/10",
    purple: "border-purple-500/30 text-purple-400 bg-purple-500/10",
    default: "border-white/10 text-white/60 bg-white/5"
  };

  return (
    <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;