import React from 'react';

const GlassButton = ({ children, onClick, variant = "primary", className = "" }) => {
  const variants = {
    primary: "bg-white/10 hover:bg-white/20 text-white border-white/10",
    success: "bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30",
    danger: "bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30",
    outline: "bg-transparent hover:bg-white/5 text-white/70 border-white/10"
  };

  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 rounded-xl border font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default GlassButton;