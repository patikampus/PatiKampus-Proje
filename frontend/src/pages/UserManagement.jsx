import React, { useEffect, useState } from 'react';
import { FiUsers, FiActivity, FiMessageSquare, FiTrendingUp, FiClock, FiMail, FiChevronRight, FiUser, FiInfo } from 'react-icons/fi';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import GlassButton from '../components/GlassButton';
import { getAllUsers } from '../api/user';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getAllUsers();
        setUsers(data.data || []);
      } catch (e) {
        console.error("Kullanıcılar alınamadı", e);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const feedbacks = []; // API entegre edilene kadar boş bırakılabilir


  return (
    <div className="w-full max-w-7xl animate-fade-in space-y-6 md:space-y-10 pb-8 md:pb-10">
      {/* Üst Başlık ve Sekme Navigasyonu */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 px-2 md:px-4">
        <div className="text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tighter">Kullanıcı & Geri Bildirim</h2>
          <p className="text-sm md:text-base text-white/60 mt-1 font-medium italic">Topluluk verilerini ve kullanıcı deneyimini yönetin.</p>
        </div>
        {/* Cam Sekme Menüsü */}
        <div className="flex w-full md:w-auto bg-white/[0.05] backdrop-blur-2xl border border-white/10 p-1 md:p-1.5 rounded-2xl shadow-2xl ring-1 ring-white/10">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex flex-1 md:flex-none items-center justify-center gap-2 px-3 sm:px-6 md:px-8 py-2.5 md:py-3 rounded-xl transition-all duration-500 font-bold text-xs sm:text-sm tracking-wide ${activeTab === 'users' ? 'bg-white/10 text-white shadow-lg border border-white/10' : 'text-white/40 hover:text-white'}`}
          >
            <FiUsers size={16} className="md:w-[18px] md:h-[18px]" /> Kullanıcılar
          </button>
          <button
            onClick={() => setActiveTab('feedbacks')}
            className={`flex flex-1 md:flex-none items-center justify-center gap-2 px-3 sm:px-6 md:px-8 py-2.5 md:py-3 rounded-xl transition-all duration-500 font-bold text-xs sm:text-sm tracking-wide ${activeTab === 'feedbacks' ? 'bg-white/10 text-white shadow-lg border border-white/10' : 'text-white/40 hover:text-white'}`}
          >
            <FiMessageSquare size={16} className="md:w-[18px] md:h-[18px]" /> Geri Bildirimler
          </button>
        </div>
      </div>
      {/* Kullanıcılar Tabı */}
      {activeTab === 'users' && (
        <GlassCard className="p-4 md:p-8">
          {loading ? (
            <div className="text-white text-center py-10">Yükleniyor...</div>
          ) : (
            <>
              {/* Mobil: Kart görünümü */}
              <div className="md:hidden space-y-3">
                {users.map(user => (
                  <div key={user.KullaniciId} className="p-4 bg-white/[0.04] border border-white/10 rounded-2xl">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="font-bold text-white text-base truncate">{user.AdSoyad}</div>
                      <Badge variant={user.AktifMi ? 'success' : 'error'}>{user.AktifMi ? 'Aktif' : 'Pasif'}</Badge>
                    </div>
                    <div className="text-xs text-white/60 break-all mb-1.5">{user.Email}</div>
                    <div className="text-xs text-white/40 font-bold uppercase tracking-wider">
                      Rol: <span className="text-white/70 normal-case">{user.Rol?.RolAdi || '-'}</span>
                    </div>
                  </div>
                ))}
                {users.length === 0 && (
                  <div className="text-center text-white/40 py-8">Kullanıcı bulunamadı.</div>
                )}
              </div>

              {/* Tablet/Desktop: Tablo */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full text-white/90 text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-2 px-4 text-left">Ad Soyad</th>
                      <th className="py-2 px-4 text-left">Email</th>
                      <th className="py-2 px-4 text-left">Rol</th>
                      <th className="py-2 px-4 text-left">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.KullaniciId} className="border-b border-white/5 hover:bg-white/5 transition-all">
                        <td className="py-2 px-4 font-bold">{user.AdSoyad}</td>
                        <td className="py-2 px-4">{user.Email}</td>
                        <td className="py-2 px-4">{user.Rol?.RolAdi || '-'}</td>
                        <td className="py-2 px-4">
                          <Badge variant={user.AktifMi ? 'success' : 'error'}>{user.AktifMi ? 'Aktif' : 'Pasif'}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </GlassCard>
      )}
      {/* Geri Bildirimler Tabı */}
      {activeTab === 'feedbacks' && (
        <GlassCard className="p-4 md:p-8">
          <div className="space-y-3 md:space-y-4">
            {feedbacks.map(fb => (
              <div key={fb.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <Badge variant={fb.variant} className="self-start sm:self-auto">{fb.status}</Badge>
                <div className="min-w-0 flex-grow">
                  <div className="font-bold text-white">{fb.user}</div>
                  <div className="text-white/60 text-xs">{fb.subject}</div>
                  <div className="text-white/80 mt-1 text-sm break-words">{fb.message}</div>
                </div>
                <div className="sm:ml-auto text-xs text-white/40 italic shrink-0">{fb.date}</div>
              </div>
            ))}
            {feedbacks.length === 0 && (
              <div className="text-center text-white/40 py-8">Geri bildirim bulunmuyor.</div>
            )}
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default UserManagement;