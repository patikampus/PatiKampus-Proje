import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { FaPaw } from 'react-icons/fa';

function Login() {
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await login(email, sifre);
      if (response.success && response.data) {
        localStorage.setItem('token', response.data.accessToken);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        localStorage.setItem('user', JSON.stringify(response.data.kullanici));
        
        navigate('/');
      } else {
        setError(response.message || 'Giriş başarısız.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0f0c29] selection:bg-purple-500/30 overflow-hidden">
      
      {/* Arka Plan Dekoratif Objeler */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[600px] h-[600px] bg-indigo-900/40 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 transition-transform duration-500 hover:rotate-0 mb-4">
            <FaPaw className="text-white text-3xl" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
            Pati<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">Kampus</span>
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Yönetim Paneline Giriş Yapın
          </p>
        </div>

        <div className="bg-white/[0.05] backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/20 rounded-2xl p-8">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-md">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-200">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                E-posta Adresi
              </label>
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl shadow-sm placeholder-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="sifre" className="block text-sm font-medium text-white/80 mb-2">
                Şifre
              </label>
              <div>
                <input
                  id="sifre"
                  name="sifre"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={sifre}
                  onChange={(e) => setSifre(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl shadow-sm placeholder-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.4)] text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0f0c29] focus:ring-purple-500 transition-all ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm pt-2">
              <Link to="/forgot-password" className="text-white/60 hover:text-white">
                Şifremi unuttum
              </Link>
              <Link to="/register" className="text-purple-300 hover:text-purple-200 font-medium">
                Kayıt Ol
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
