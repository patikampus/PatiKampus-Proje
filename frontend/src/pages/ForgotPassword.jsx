import { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../api/auth';
import { FaPaw } from 'react-icons/fa';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await requestPasswordReset(email);
      if (response.success) {
        setSuccess(
          response.message ||
            'Şifre sıfırlama talimatları email adresinize gönderildi.'
        );
      } else {
        setError(response.message || 'İstek başarısız.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'İstek gönderilirken bir hata oluştu. Lütfen tekrar deneyin.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0f0c29] selection:bg-purple-500/30 overflow-hidden">

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
            Şifremi <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">Unuttum</span>
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Email adresinizi girin, sıfırlama bağlantısı gönderelim
          </p>
        </div>

        <div className="bg-white/[0.05] backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/20 rounded-2xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-md">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}
            {success && (
              <div className="bg-emerald-500/10 border-l-4 border-emerald-500 p-4 rounded-md">
                <p className="text-sm text-emerald-200">{success}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                E-posta Adresi
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl shadow-sm placeholder-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="ornek@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.4)] text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0f0c29] focus:ring-purple-500 transition-all ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
            </button>

            <div className="flex items-center justify-between text-sm">
              <Link to="/login" className="text-white/60 hover:text-white">
                Girişe dön
              </Link>
              <Link to="/reset-password" className="text-purple-300 hover:text-purple-200">
                Token'ım var
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
