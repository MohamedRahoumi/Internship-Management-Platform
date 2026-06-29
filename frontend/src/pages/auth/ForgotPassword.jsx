import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError('');
    try {
      await api.post('/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Email introuvable.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative">
      <div className="absolute inset-0 w-full h-full scale-105 origin-center z-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover" src="/back.mp4" />
      </div>
      <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 z-10" />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-[20px] shadow-[0_25px_60px_rgba(0,0,0,0.15)] p-8 sm:p-10 border border-white/20">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-[16px] flex items-center justify-center mx-auto mb-5" style={{ background: 'linear-gradient(135deg, #00843D, #02421D)' }}>
                <i className="fas fa-envelope text-white text-2xl" />
              </div>
              <h2 className="font-cooper-medium text-2xl text-ocp-700 mb-2">Email envoyé</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Si un compte existe avec l'adresse <strong className="text-ocp-600">{email}</strong>, vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.
              </p>
              <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-ocp-500 hover:text-ocp-700 transition-colors">
                <i className="fas fa-arrow-left text-xs" /> Retour à la connexion
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-[14px] flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #00843D, #02421D)' }}>
                  <i className="fas fa-lock text-white text-xl" />
                </div>
                <h1 className="font-cooper-medium text-2xl sm:text-3xl text-ocp-700">Mot de passe oublié</h1>
                <p className="text-gray-500 text-sm mt-2">Saisissez votre email pour recevoir un lien de réinitialisation</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-ocp-700 mb-1.5">Adresse email</label>
                  <div className="flex items-center gap-2 bg-ocp-50 px-4 py-3 rounded-xl border border-ocp-200 focus-within:border-ocp-500 focus-within:bg-white transition-all">
                    <i className="fas fa-envelope text-gray-400 text-sm" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="exemple@ocp.com"
                      className="border-none bg-transparent outline-none text-sm w-full placeholder:text-gray-400 text-ocp-700"
                      autoFocus
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm font-medium px-4 py-3 rounded-[12px] bg-red-100 text-red-700">
                    <i className="fas fa-exclamation-circle" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full bg-gradient-to-r from-ocp-500 to-ocp-700 text-white font-semibold py-3 rounded-[12px] text-sm transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><i className="fas fa-spinner fa-spin" /> Envoi...</>
                  ) : (
                    <><i className="fas fa-paper-plane" /> Envoyer le lien</>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="text-sm text-ocp-500 font-medium hover:text-ocp-600 hover:underline">
                  <i className="fas fa-arrow-left mr-1.5" /> Retour à la connexion
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-white/60 mt-6">
          &copy; {new Date().getFullYear()} Gestion des Stages OCP
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
