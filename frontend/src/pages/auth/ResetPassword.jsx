import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return; }
    if (password.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères.'); return; }
    setLoading(true);
    setError('');
    try {
      await api.post('/reset-password', { email, token, password });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la réinitialisation.');
    } finally { setLoading(false); }
  };

  if (!email || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative">
        <div className="fixed inset-0 w-full h-full scale-105 origin-center z-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover" src="/back.mp4" />
        </div>
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 z-10" />
        <div className="relative z-20 bg-white/95 backdrop-blur-xl rounded-[20px] shadow-[0_25px_60px_rgba(0,0,0,0.15)] p-8 sm:p-10 max-w-md mx-4 text-center">
          <div className="w-14 h-14 rounded-[14px] flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
            <i className="fas fa-exclamation-triangle text-white text-xl" />
          </div>
          <h2 className="font-cooper-medium text-2xl text-ocp-700 mb-2">Lien invalide</h2>
          <p className="text-gray-500 text-sm mb-6">Ce lien de réinitialisation est invalide ou a expiré.</p>
          <Link to="/forgot-password" className="text-ocp-500 font-semibold text-sm hover:underline">Demander un nouveau lien</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative">
      <div className="fixed inset-0 w-full h-full scale-105 origin-center z-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover" src="/back.mp4" />
      </div>
      <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 z-10" />

      <div className="relative z-20 w-full max-w-md mx-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-[20px] shadow-[0_25px_60px_rgba(0,0,0,0.15)] p-8 sm:p-10 border border-white/20">
          {done ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-[16px] flex items-center justify-center mx-auto mb-5" style={{ background: 'linear-gradient(135deg, #00843D, #02421D)' }}>
                <i className="fas fa-check-circle text-white text-2xl" />
              </div>
              <h2 className="font-cooper-medium text-2xl text-ocp-700 mb-2">Mot de passe réinitialisé</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter.</p>
              <button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-ocp-500 to-ocp-700 text-white font-semibold py-3 px-8 rounded-[12px] text-sm transition-all duration-200 hover:opacity-90"
              >
                Se connecter
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-[14px] flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #00843D, #02421D)' }}>
                  <i className="fas fa-key text-white text-xl" />
                </div>
                <h1 className="font-cooper-medium text-2xl sm:text-3xl text-ocp-700">Nouveau mot de passe</h1>
                <p className="text-gray-500 text-sm mt-2">Choisissez un nouveau mot de passe pour <strong className="text-ocp-600">{email}</strong></p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-ocp-700 mb-1.5">Nouveau mot de passe</label>
                  <div className="flex items-center gap-2 bg-ocp-50 px-4 py-3 rounded-xl border border-ocp-200 focus-within:border-ocp-500 focus-within:bg-white transition-all">
                    <i className="fas fa-lock text-gray-400 text-sm" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 caractères"
                      className="border-none bg-transparent outline-none text-sm w-full placeholder:text-gray-400 text-ocp-700"
                      autoFocus
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ocp-700 mb-1.5">Confirmer le mot de passe</label>
                  <div className="flex items-center gap-2 bg-ocp-50 px-4 py-3 rounded-xl border border-ocp-200 focus-within:border-ocp-500 focus-within:bg-white transition-all">
                    <i className="fas fa-lock text-gray-400 text-sm" />
                    <input
                      type="password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Retaper le mot de passe"
                      className="border-none bg-transparent outline-none text-sm w-full placeholder:text-gray-400 text-ocp-700"
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
                  disabled={loading || !password || !confirm}
                  className="w-full bg-gradient-to-r from-ocp-500 to-ocp-700 text-white font-semibold py-3 rounded-[12px] text-sm transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><i className="fas fa-spinner fa-spin" /> Réinitialisation...</>
                  ) : (
                    <><i className="fas fa-save" /> Réinitialiser</>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs text-white/60 mt-6">
          &copy; {new Date().getFullYear()} Gestion des Stages OCP
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
