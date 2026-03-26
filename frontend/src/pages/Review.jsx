import React, { useEffect, useState } from 'react';
import { FiCheck, FiX, FiMessageCircle, FiCamera, FiUser, FiInfo, FiMaximize2, FiClock, FiTrash2 } from 'react-icons/fi';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import GlassButton from '../components/GlassButton';
import { getPendingPhotoRequests, approvePhoto, rejectPhoto } from '../api/review';
import { getFeedbacks } from '../api/feedback';

const Review = () => {
  const [photoRequests, setPhotoRequests] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const photoData = await getPendingPhotoRequests();
        setPhotoRequests(photoData.data || []);
        const feedbackData = await getFeedbacks();
        setFeedbacks(feedbackData.data || []);
      } catch (e) {
        setPhotoRequests([]);
        setFeedbacks([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handlePhotoAction = async (id, action) => {
    if (action === 'approve') await approvePhoto(id);
    if (action === 'reject') await rejectPhoto(id);
    setPhotoRequests(photoRequests.filter(req => req.id !== id || req.FotoId !== id));
  };

  return (
    <div className="w-full max-w-7xl animate-fade-in space-y-10 pb-10">
      {/* Üst Başlık Bölümü */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4">
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-black text-white tracking-tighter">İnceleme & Onay Merkezi</h2>
          <p className="text-white/60 mt-1 font-medium italic">Gelen görsel kanıtları doğrulayın ve talepleri yanıtlayın.</p>
        </div>
        <div className="flex gap-4">
          <Badge variant="purple" className="py-2 px-5 bg-purple-500/20 text-white border-purple-500/30 shadow-lg shadow-purple-500/10">
            {photoRequests.length} BEKLEYEN ONAY
          </Badge>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* SOL: Fotoğraf Onay Modülü */}
        <div className="lg:col-span-7 space-y-8">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20 text-purple-400">
              <FiCamera size={20} />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-widest italic">Hazne Kanıtları</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loading ? <div className="text-white">Yükleniyor...</div> : photoRequests.map(req => (
              <GlassCard key={req.id || req.FotoId} className="group overflow-hidden border-white/10 flex flex-col h-full shadow-2xl">
                {/* Fotoğraf Alanı */}
                <div className="relative h-60 overflow-hidden">
                  <img 
                    src={req.img || req.FotoUrl} 
                    alt="Mama Haznesi" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1" 
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />
                  {/* Floating ID Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-black bg-black/40 backdrop-blur-md text-white/80 px-2 py-1 rounded border border-white/10 uppercase">
                      ID: {req.id || req.FotoId}
                    </span>
                  </div>
                  <button className="absolute top-4 right-4 p-2.5 bg-white/10 backdrop-blur-xl rounded-xl text-white hover:bg-white/30 transition-all border border-white/10 shadow-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                    <FiMaximize2 size={18} />
                  </button>
                </div>
                {/* Bilgi ve Butonlar */}
                <div className="p-6 bg-gradient-to-b from-white/[0.02] to-transparent flex-grow flex flex-col">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-11 h-11 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl border border-white/10 flex items-center justify-center text-indigo-300 shadow-inner">
                      <FiUser size={20} />
                    </div>
                    <div>
                      <p className="text-base font-black text-white tracking-wide">{req.user || req.KullaniciAdi || req.YukleyenKullaniciId}</p>
                      <p className="text-[11px] text-white/40 flex items-center gap-1.5 mt-1 font-bold">
                        <FiClock className="text-purple-400" /> {req.date || req.YuklemeZamani} yüklendi
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-auto">
                    <GlassButton 
                      variant="success" 
                      className="flex-1 py-3 text-white font-black text-xs uppercase tracking-widest border-green-500/20 hover:bg-green-500/20" 
                      onClick={() => handlePhotoAction(req.id || req.FotoId, 'approve')}
                    >
                      <FiCheck size={16} /> Onayla
                    </GlassButton>
                    <GlassButton 
                      variant="danger" 
                      className="flex-1 py-3 text-white font-black text-xs uppercase tracking-widest border-red-500/20 hover:bg-red-500/20" 
                      onClick={() => handlePhotoAction(req.id || req.FotoId, 'reject')}
                    >
                      <FiX size={16} /> Red
                    </GlassButton>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
          {photoRequests.length === 0 && !loading && (
            <GlassCard className="p-20 border-dashed border-white/10 text-center flex flex-col items-center gap-4" hover={false}>
               <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white/20">
                  <FiCamera size={32} />
               </div>
               <p className="text-white/40 font-bold italic">Bekleyen fotoğraf onayı bulunmuyor.</p>
            </GlassCard>
          )}
        </div>
        {/* SAĞ: Geri Bildirim Paneli */}
        <div className="lg:col-span-5 space-y-8">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-400">
              <FiMessageCircle size={20} />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-widest italic">Bildirim Akışı</h3>
          </div>
          <div className="space-y-5">
            {loading ? <div className="text-white">Yükleniyor...</div> : feedbacks.map(fb => (
              <GlassCard key={fb.id || fb.AnomaliId} className="p-8 border-white/10 relative overflow-hidden group" hover={true}>
                {/* Background Glow */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 blur-[60px] opacity-10 rounded-full ${fb.status === 'Açık' || fb.Durum === 'ACIK' ? 'bg-red-500' : 'bg-green-500'}`} />
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <Badge variant={fb.variant || (fb.Durum === 'ACIK' ? 'error' : 'success')} className="text-white border-white/20 font-black">
                    {(fb.status || fb.Durum)?.toUpperCase()}
                  </Badge>
                  <div className="text-right">
                    <p className="text-sm font-black text-white tracking-wide">{fb.user || fb.KullaniciAdi || fb.MamaKabiId}</p>
                    <p className="text-[10px] text-indigo-300 font-black uppercase tracking-widest mt-1 italic">{fb.subject || fb.AnomaliId}</p>
                  </div>
                </div>
                <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5 mb-6 shadow-inner group-hover:bg-white/[0.05] transition-all">
                   <p className="text-sm text-white/70 leading-relaxed font-medium italic">
                    "{fb.message || `Ağırlık: ${fb.Agirlik ?? '-'}kg, Yükseklik: ${fb.Yukseklik ?? '-'}cm`}"
                  </p>
                </div>
                <div className="flex justify-end gap-3 relative z-10">
                  <GlassButton variant="outline" className="text-[10px] py-2 border-white/10 text-white/60 hover:text-white font-black tracking-widest uppercase">
                    <FiInfo size={14} /> DETAY
                  </GlassButton>
                  {(fb.status === 'Açık' || fb.Durum === 'ACIK') ? (
                    <GlassButton variant="primary" className="text-[10px] py-2 px-6 font-black tracking-widest uppercase shadow-xl shadow-indigo-500/10">
                      ÇÖZÜLDÜ
                    </GlassButton>
                  ) : (
                    <button className="p-2 text-white/20 hover:text-red-400 transition-colors">
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;