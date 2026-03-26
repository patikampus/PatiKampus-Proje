import React, { useEffect, useState } from 'react';
import { FiWifi, FiDatabase, FiActivity, FiMapPin, FiCpu, FiZap, FiInfo } from 'react-icons/fi';
import { GiEmptyWoodBucket } from 'react-icons/gi';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import GlassButton from '../components/GlassButton';
import { getMamaKaplari, getSonSensorVerisi, getSensorVerileri } from '../api/device';

const DevicePanel = () => {
  const [mamaKaplari, setMamaKaplari] = useState([]);
  const [selectedKapi, setSelectedKapi] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const [sensorLogs, setSensorLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const kaplar = await getMamaKaplari();
      setMamaKaplari(kaplar);
      if (kaplar.length > 0) {
        setSelectedKapi(kaplar[0]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedKapi) return;
    const fetchSensor = async () => {
      const sonVeri = await getSonSensorVerisi(selectedKapi.MamaKabiId);
      setSensorData(sonVeri);
      const logs = await getSensorVerileri(selectedKapi.MamaKabiId);
      setSensorLogs(logs);
    };
    fetchSensor();
  }, [selectedKapi]);

  if (loading) return <div className="text-white text-center py-20">Yükleniyor...</div>;
  if (!selectedKapi) return <div className="text-white text-center py-20">Hiç mama kabı bulunamadı.</div>;

  // Dummy fallbacklar
  const deviceStats = {
    id: selectedKapi.MamaKabiId,
    name: selectedKapi.KapAdi || 'Mama Kabı',
    fillLevel: sensorData?.İçHazneAgirlik ? Math.round((sensorData.İçHazneAgirlik / 10) * 100) : 0,
    isOnline: true,
    signalStrength: 'Güçlü',
    location: selectedKapi.Konum || '-',
    temp: sensorData?.Yukseklik ? `${sensorData.Yukseklik}°C` : '-',
  };

  const errorLogs = sensorLogs.slice(0, 5).map((log, i) => ({
    id: log.SensorId || i,
    type: 'Bilgi',
    msg: `Ağırlık: ${log.İçHazneAgirlik ?? '-'}kg, Yükseklik: ${log.Yukseklik ?? '-'}cm`,
    time: new Date(log.OlcumZamani).toLocaleString('tr-TR'),
    variant: 'info',
  }));

  return (
    <div className="w-full max-w-7xl animate-fade-in space-y-10 pb-10">
      
      {/* Üst Başlık ve Genel Durum */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4">
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Cihaz Yönetimi</h2>
          <p className="text-white/60 mt-1 font-medium italic">IOT sensör verileri ve donanım sağlığı analizi.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 shadow-2xl">
          <Badge variant="success" className="py-2.5 px-6 flex items-center gap-3 text-white font-black tracking-widest bg-green-500/20 border-green-500/30 shadow-lg shadow-green-500/10">
            <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_#4ade80]" />
            SİSTEM AKTİF
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SOL: Cihaz Ana Kartı (Genişletilmiş) */}
        <div className="lg:col-span-4">
          <GlassCard className="p-10 h-full relative overflow-hidden group" hover={false}>
            {/* Arka Plan Glow */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div className="p-5 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-white/10 rounded-[2rem] shadow-2xl text-indigo-300">
                  <FiCpu size={32} />
                </div>
                <div className="text-right">
                  <code className="text-[10px] text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 font-black tracking-widest">
                    {deviceStats.id}
                  </code>
                  <p className="text-[9px] text-white/30 mt-2 font-black uppercase tracking-widest">Hardware v4.2</p>
                </div>
              </div>
              
              <h3 className="text-3xl font-black text-white mb-3 tracking-tighter group-hover:text-indigo-300 transition-colors">
                {deviceStats.name}
              </h3>
              
              <p className="text-sm text-white/50 mb-10 flex items-center gap-2 font-medium italic">
                <FiMapPin className="text-indigo-400" />
                {deviceStats.location}
              </p>

              <div className="space-y-8">
                <div className="p-6 bg-white/[0.03] rounded-[2rem] border border-white/5 shadow-inner">
                  <div className="flex justify-between text-xs mb-4 font-black tracking-widest">
                    <span className="text-white/40 uppercase">Doluluk Oranı</span>
                    <span className="text-white">%{deviceStats.fillLevel}</span>
                  </div>
                  <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden p-[2px] shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(99,102,241,0.6)]"
                      style={{ width: `${deviceStats.fillLevel}%` }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-white/30 font-black uppercase mb-1">Sıcaklık</p>
                    <p className="text-xl font-black text-white">{deviceStats.temp}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-white/30 font-black uppercase mb-1">Güç</p>
                    <p className="text-xl font-black text-white flex items-center gap-1"><FiZap className="text-yellow-400 text-sm" /> 220V</p>
                  </div>
                </div>

                <GlassButton variant="primary" className="w-full py-5 text-xs font-black tracking-[0.2em] uppercase shadow-xl shadow-indigo-500/10 border-white/10">
                  DONANIMI RESETLE
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* ORTA: Sensör Matrisi */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* WiFi Durumu */}
          <GlassCard className="p-8 flex items-center gap-8 group" hover={true}>
            <div className={`p-5 rounded-[2rem] border transition-all duration-500 ${deviceStats.isOnline ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.1)]' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
              <FiWifi size={36} className="group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Bağlantı</p>
              <p className="text-2xl font-black text-white tracking-tight">{deviceStats.isOnline ? 'ÇEVRİMİÇİ' : 'OFFLINE'}</p>
              <Badge variant="info" className="mt-2 text-[9px] py-0.5 border-none bg-blue-500/20 text-blue-300 font-black tracking-widest">{deviceStats.signalStrength} SİNYAL</Badge>
            </div>
          </GlassCard>

          {/* Dönen Mekanizma */}
          <GlassCard className="p-8 flex items-center gap-8 group" hover={true}>
            <div className="p-5 rounded-[2rem] bg-orange-500/10 border border-orange-500/20 text-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.1)] transition-all duration-500">
              <GiEmptyWoodBucket size={36} className="group-hover:rotate-12 transition-transform" />
            </div>
            <div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Mekanizma</p>
              <p className="text-2xl font-black text-white tracking-tight italic uppercase">Stabil</p>
              <p className="text-[11px] text-orange-300/60 mt-2 font-bold italic">Rotor Devri: 60 RPM</p>
            </div>
          </GlassCard>

          {/* Aktivite Özeti */}
          <GlassCard className="p-8 flex items-center gap-8 group" hover={true}>
            <div className="p-5 rounded-[2rem] bg-purple-500/10 border border-purple-500/20 text-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.1)] transition-all duration-500">
              <FiActivity size={36} className="group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Verimlilik</p>
              <p className="text-2xl font-black text-white tracking-tight">%98.2</p>
              <p className="text-[11px] text-purple-300/60 mt-2 font-bold italic">Hatasız Log Kaydı</p>
            </div>
          </GlassCard>
        </div>

        {/* SAĞ: Gelişmiş Log Akışı */}
        <div className="lg:col-span-4">
          <GlassCard className="p-8 h-full border-white/10 flex flex-col" hover={false}>
            <div className="flex items-center justify-between mb-10 px-2">
              <div className="flex items-center gap-3">
                <FiDatabase className="text-indigo-400 text-xl" />
                <h3 className="text-lg font-black text-white uppercase tracking-widest">Log Akışı</h3>
              </div>
              <Badge variant="default" className="text-[9px] border-white/10 text-white/40">LIVE</Badge>
            </div>
            
            <div className="space-y-5 flex-grow">
              {errorLogs.map(log => (
                <div key={log.id} className="p-5 bg-white/[0.03] border border-white/5 rounded-[1.5rem] hover:bg-white/[0.06] transition-all group border-l-4 border-l-indigo-500/50 shadow-inner">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant={log.variant} className="text-[9px] font-black tracking-widest px-2.5 py-0.5">
                      {log.type.toUpperCase()}
                    </Badge>
                    <span className="text-[10px] text-white/30 font-black tracking-tighter italic">{log.time}</span>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed font-semibold italic">
                    "{log.msg}"
                  </p>
                </div>
              ))}
            </div>

            <GlassButton variant="outline" className="w-full text-[10px] mt-8 py-3 font-black tracking-[0.2em] uppercase border-white/10 text-white/40 hover:text-white transition-all">
              <FiInfo size={14} className="mr-2" /> ARŞİVİ GÖRÜNTÜLE
            </GlassButton>
          </GlassCard>
        </div>

      </div>
    </div>
  );
};

export default DevicePanel;