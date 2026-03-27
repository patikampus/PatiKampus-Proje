import React, { useEffect, useState } from 'react';
import { FiUsers, FiActivity, FiMessageSquare, FiTrendingUp, FiClock, FiMail, FiChevronRight, FiUser, FiInfo } from 'react-icons/fi';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import GlassButton from '../components/GlassButton';
import { getAllUsers } from '../api/user';
import { usersMock } from '../utils/mockData/usersMock';

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
        // API'den veri gelmezse mock datayı kullan
        setUsers(usersMock);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  // Dummy feedbacks (API ile bağlanınca değiştirilebilir)
  const feedbacks = [
    { id: 101, user: "Mehmet Can", subject: "Mama Haznesi", message: "Mekanizma bazen ses çıkarıyor.", status: "Açık", date: "2 saat önce", variant: "error" },
    { id: 102, user: "Ece Su", subject: "Mobil Uygulama", message: "Bağlantı hızı harika!", status: "Çözüldü", date: "1 gün önce", variant: "success" },
  ];

  return (
    <div className="w-full max-w-7xl animate-fade-in space-y-10 pb-10">
      {/* Üst Başlık ve Sekme Navigasyonu */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4">
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-black text-white tracking-tighter">Kullanıcı & Geri Bildirim</h2>
          <p className="text-white/60 mt-1 font-medium italic">Topluluk verilerini ve kullanıcı deneyimini yönetin.</p>
        </div>
        {/* Cam Sekme Menüsü */}
        <div className="flex bg-white/[0.05] backdrop-blur-2xl border border-white/10 p-1.5 rounded-2xl shadow-2xl ring-1 ring-white/10">
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl transition-all duration-500 font-bold text-sm tracking-wide ${activeTab === 'users' ? 'bg-white/10 text-white shadow-lg border border-white/10' : 'text-white/40 hover:text-white'}`}
          >
            <FiUsers size={18} /> Kullanıcılar
          </button>
          <button 
            onClick={() => setActiveTab('feedbacks')}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl transition-all duration-500 font-bold text-sm tracking-wide ${activeTab === 'feedbacks' ? 'bg-white/10 text-white shadow-lg border border-white/10' : 'text-white/40 hover:text-white'}`}
          >
            <FiMessageSquare size={18} /> Geri Bildirimler
          </button>
        </div>
      </div>
      {/* Kullanıcılar Tabı */}
      {activeTab === 'users' && (
        <GlassCard className="p-8">
          {loading ? (
            <div className="text-white text-center py-10">Yükleniyor...</div>
          ) : (
            <div className="overflow-x-auto">
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
          )}
        </GlassCard>
      )}
      {/* Geri Bildirimler Tabı */}
      {activeTab === 'feedbacks' && (
        <GlassCard className="p-8">
          <div className="space-y-4">
            {feedbacks.map(fb => (
              <div key={fb.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <Badge variant={fb.variant}>{fb.status}</Badge>
                <div>
                  <div className="font-bold text-white">{fb.user}</div>
                  <div className="text-white/60 text-xs">{fb.subject}</div>
                  <div className="text-white/80 mt-1">{fb.message}</div>
                </div>
                <div className="ml-auto text-xs text-white/40 italic">{fb.date}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default UserManagement;