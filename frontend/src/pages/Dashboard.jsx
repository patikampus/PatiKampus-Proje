import React from 'react';
import { FiCpu, FiUsers, FiShield, FiArrowRight, FiActivity, FiMessageCircle, FiAlertTriangle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import GlassButton from '../components/GlassButton';

const Dashboard = () => {
  const stats = [
    { label: "Aktif Cihazlar", value: "12", icon: <FiCpu />, color: "text-blue-400", trend: "+2 bu ay" },
    { label: "Toplam Kullanıcı", value: "1,240", icon: <FiUsers />, color: "text-purple-400", trend: "%15 artış" },
    { label: "Onay Bekleyen", value: "8", icon: <FiShield />, color: "text-pink-400", trend: "Acil" },
  ];

  return (
    <div className="w-full max-w-7xl animate-fade-in space-y-10 pb-10">
      
      {/* Hero Section */}
      <GlassCard className="p-12 relative overflow-hidden border-white/10 shadow-2xl" hover={false}>
        {/* Glow Süslemeleri */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full -mr-32 -mt-32" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-center md:text-left space-y-6">
            <Badge variant="purple" className="px-5 py-2 text-white border-purple-500/40">
              SİSTEM YÖNETİM PANELİ
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight">
              Hoş Geldiniz, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-400">
                PatiKampus
              </span>
            </h1>

            <p className="text-white/70 text-lg md:text-xl max-w-xl font-medium leading-relaxed italic">
              "Sokaktaki dostlarımızın beslenmesini dijital bir dokunuşla takip edin."
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-5 pt-6">
              <Link to="/device-panel">
                <GlassButton variant="success" className="px-10 py-4 text-white group shadow-lg shadow-green-500/10">
                  Cihazları Yönet <FiArrowRight className="group-hover:translate-x-2 transition-transform text-white" />
                </GlassButton>
              </Link>
              <Link to="/review">
                <GlassButton variant="primary" className="px-10 py-4 text-white border-white/20">
                  İnceleme Bekleyenler
                </GlassButton>
              </Link>
            </div>
          </div>

          {/* Sağ taraf: Widget */}
          <div className="hidden lg:block w-80">
            <div className="p-8 bg-white/[0.05] border border-white/10 rounded-[2.5rem] backdrop-blur-3xl space-y-6">
              <div className="flex items-center justify-between text-white">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Sunucu Durumu</span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                  <span className="text-[10px] font-bold text-green-400 uppercase">Aktif</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] text-white/80 font-bold">
                  <span>İŞLEMCİ YÜKÜ</span>
                  <span>%24</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[24%] bg-white rounded-full shadow-[0_0_10px_white]" />
                </div>
              </div>
              <p className="text-[11px] text-white/60 leading-relaxed font-medium italic">
                Sistem optimize edildi, veri akışı stabil.
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* İstatistik Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <GlassCard key={i} className="p-8 group relative overflow-hidden">
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${stat.color} text-3xl`}>
                {stat.icon}
              </div>
              <Badge variant="default" className="text-white/60 border-white/10">{stat.trend}</Badge>
            </div>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">{stat.label}</p>
            <h3 className="text-5xl font-black text-white tracking-tighter">{stat.value}</h3>
          </GlassCard>
        ))}
      </div>

      {/* Alt Bölüm */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sistem Akışı */}
        <GlassCard className="lg:col-span-7 p-8" hover={false}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <FiActivity className="text-indigo-400 text-2xl" />
              <h3 className="text-xl font-extrabold text-white tracking-tight">Sistem Akışı</h3>
            </div>
            <button className="text-[10px] text-white/40 hover:text-white uppercase font-black">TÜMÜ</button>
          </div>
          
          <div className="space-y-4">
            {[
              { text: "Cihaz-04 doluluk uyarısı verdi.", time: "12:45", icon: <FiAlertTriangle className="text-orange-400" /> },
              { text: "Yeni kullanıcı kaydı: Ece Karaman", time: "11:20", icon: <FiUsers className="text-blue-400" /> },
              { text: "Geri bildirim çözüldü: #102", time: "09:15", icon: <FiShield className="text-green-400" /> }
            ].map((log, index) => (
              <div key={index} className="flex items-center gap-5 p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                <div className="p-2 bg-white/5 rounded-lg text-white">{log.icon}</div>
                <div className="flex-grow">
                  <p className="text-sm text-white font-bold">{log.text}</p>
                </div>
                <span className="text-[10px] font-bold text-white/30">{log.time}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Hızlı Aksiyonlar */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <GlassCard className="p-8 bg-indigo-600/10 border-indigo-500/20" hover={true}>
            <h4 className="text-white font-bold text-lg mb-2">Admin Destek</h4>
            <p className="text-sm text-white/60 mb-6 leading-relaxed">
              Teknik ekibe anında ulaşın.
            </p>
            <GlassButton variant="primary" className="w-full text-white font-black text-[10px] tracking-widest">
              MESAJ GÖNDER
            </GlassButton>
          </GlassCard>
          
          <div className="grid grid-cols-2 gap-4">
             <GlassCard className="p-6 text-center border-white/5">
                <span className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1 block">Talepler</span>
                <h5 className="text-white font-black text-3xl">24</h5>
             </GlassCard>
             <GlassCard className="p-6 text-center border-white/5">
                <span className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1 block">Bildirim</span>
                <h5 className="text-white font-black text-3xl">128</h5>
             </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;