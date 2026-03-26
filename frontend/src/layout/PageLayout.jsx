import React from 'react';
import Navbar from '../components/Navbar';

const PageLayout = ({ children }) => {
  return (
    // Tüm ekranı kaplayan ana kapsayıcı
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0f0c29] selection:bg-purple-500/30">
      
      {/* Arka Plan Dekoratif Objeler (Glass Etkisini Gösterenler Bunlar) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Sol Üst Mor Küre */}
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] animate-pulse" />
        {/* Sağ Orta Mavi Küre */}
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px]" />
        {/* Alt Orta Indigo Küre */}
        <div className="absolute bottom-[-10%] left-[30%] w-[600px] h-[600px] bg-indigo-900/40 rounded-full blur-[150px]" />
      </div>

      {/* Navbar (Z-Index ile en üstte) */}
      <Navbar />

      {/* İçerik Alanı */}
      <main className="relative z-10 pt-32 pb-12 px-6 flex flex-col items-center min-h-screen">
        <div className="w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default PageLayout;