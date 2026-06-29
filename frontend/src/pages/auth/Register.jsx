import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useAuthStore from '../../store/authStore';
import Alert from '../../components/ui/Alert';

const schema = z
  .object({
    cin: z.string().min(1, 'CIN requis').max(20, 'CIN trop long'),
    civility: z.enum(['Monsieur', 'Madame', 'Mademoiselle'], { required_error: 'Civilité requise' }),
    nom: z.string().min(1, 'Nom requis'),
    prenom: z.string().min(1, 'Prénom requis'),
    telephone: z.string().min(1, 'Téléphone requis'),
    email: z.string().min(1, 'Email requis').email('Email invalide'),
    password: z.string().min(6, '6 caractères minimum'),
    password_confirmation: z.string().min(1, 'Confirmation requise'),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['password_confirmation'],
  });

const Register = () => {
  const navigate = useNavigate();
  const registerUser = useAuthStore((s) => s.register);
  const loading = useAuthStore((s) => s.loading);
  const [error, setError] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState({});
  const videoRef = useRef(null);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    const ids = ['card', 'card-0', 'card-1', 'card-2'];
    ids.forEach((id, i) => {
      const delay = id === 'card' ? 150 : 400 + i * 100;
      setTimeout(() => setVisible((v) => ({ ...v, [id]: true })), 80 + delay);
    });
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const onSubmit = async (data) => {
    setError('');
    try {
      const user = await registerUser(data);
      const redirect = {
        administrator: '/admin/dashboard',
        rh: '/rh/dashboard',
        supervisor: '/supervisor/dashboard',
        intern: '/intern/dashboard',
      }[user.role] || '/';
      navigate(redirect, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message;
      if (typeof msg === 'object') {
        setError(Object.values(msg).flat().join(', '));
      } else {
        setError(msg || "Erreur lors de l'inscription");
      }
    }
  };

  const fadeCls = (id) =>
    `transition-all duration-700 ease-out ${
      visible[id] ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-6 blur-sm'
    }`;

  const inputCls = (field) =>
    `w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none bg-ocp-50 focus:bg-white focus:border-ocp-500 focus:ring-3 focus:ring-ocp-500/15 ${errors[field] ? 'border-red-400' : 'border-ocp-200'}`;

  const selectCls = (field) =>
    `w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none bg-ocp-50 focus:bg-white focus:border-ocp-500 focus:ring-3 focus:ring-ocp-500/15 cursor-pointer ${errors[field] ? 'border-red-400' : 'border-ocp-200'}`;

  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col bg-white">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full scale-105 origin-center z-0">
        <video
          ref={videoRef}
          muted
          playsInline
          crossOrigin="anonymous"
          className="w-full h-full object-cover"
          src="/back.mp4"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/92 via-white/75 to-ocp-50/90 z-10" />

      <div className="relative z-20 flex-1 flex flex-col justify-between min-h-screen">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-5 sm:px-10 lg:px-16 py-6">
          <div className="flex items-center gap-2.5">
            <img src="/ocp.svg" alt="OCP" className="h-8 w-auto rounded-md" />
            
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-sm font-medium text-ocp-700/80 hover:text-ocp-500 transition-colors">Accueil</a>
            <a href="/" className="text-sm font-medium text-ocp-700/80 hover:text-ocp-500 transition-colors">À propos</a>
            <a href="/" className="text-sm font-medium text-ocp-700/80 hover:text-ocp-500 transition-colors">Fonctionnalités</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <a href="/login" className="inline-flex items-center gap-2 bg-ocp-700 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-ocp-600 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-ocp-700/20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L12 22M5 9L12 2 19 9" strokeLinejoin="round"/></svg>
              Se connecter
            </a>
          </div>
          <button className="md:hidden p-1" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#02421D" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#02421D" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
          {mobileOpen && (
            <div className="absolute top-[76px] left-4 right-4 z-30 bg-white/98 backdrop-blur-xl rounded-2xl shadow-xl shadow-ocp-500/10 border border-ocp-500/10 p-5 flex flex-col gap-3.5 md:hidden">
              <a href="/" className="text-base font-medium text-ocp-700 py-2" onClick={() => setMobileOpen(false)}>Accueil</a>
              <a href="/" className="text-base font-medium text-ocp-700 py-2" onClick={() => setMobileOpen(false)}>À propos</a>
              <a href="/" className="text-base font-medium text-ocp-700 py-2" onClick={() => setMobileOpen(false)}>Fonctionnalités</a>
              <a href="/login" className="inline-flex items-center justify-center gap-2 bg-ocp-700 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-ocp-600 transition-all" onClick={() => setMobileOpen(false)}>Se connecter</a>
            </div>
          )}
        </nav>

        {/* Register Card */}
        <div className="flex-1 flex items-center justify-center px-5 py-10">
          <div className={`bg-white/96 backdrop-blur-xl rounded-3xl shadow-[0_30px_80px_rgba(2,66,29,0.12),0_10px_30px_rgba(0,0,0,0.04)] border border-ocp-500/10 p-8 sm:p-12 lg:p-14 w-full max-w-lg transition-all duration-300 hover:-translate-y-1 ${fadeCls('card')}`}>
            <div className="flex justify-center mb-3">
              <img src="/ocp.svg" alt="OCP" className="h-10 w-auto" />
            </div>
            <h2 className="font-cooper-medium text-ocp-700 text-3xl mb-1 text-center">Créer un compte</h2>
            <p className="text-ocp-600/80 text-sm mb-7 text-center">Inscrivez-vous pour accéder au portail des stages.</p>

            <Alert type="error">{error}</Alert>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ocp-700 mb-1.5">CIN</label>
                  <input type="text" {...register('cin')} className={inputCls('cin')} placeholder="Numéro CIN" />
                  {errors.cin && <p className="text-red-500 text-xs mt-1">{errors.cin.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ocp-700 mb-1.5">Civilité</label>
                  <select {...register('civility')} className={selectCls('civility')}>
                    <option value="">Sélectionner</option>
                    <option value="Monsieur">Monsieur</option>
                    <option value="Madame">Madame</option>
                    <option value="Mademoiselle">Mademoiselle</option>
                  </select>
                  {errors.civility && <p className="text-red-500 text-xs mt-1">{errors.civility.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ocp-700 mb-1.5">Nom</label>
                  <input type="text" {...register('nom')} className={inputCls('nom')} placeholder="Votre nom" />
                  {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ocp-700 mb-1.5">Prénom</label>
                  <input type="text" {...register('prenom')} className={inputCls('prenom')} placeholder="Votre prénom" />
                  {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ocp-700 mb-1.5">Téléphone</label>
                  <input type="text" {...register('telephone')} className={inputCls('telephone')} placeholder="06 XX XX XX XX" />
                  {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ocp-700 mb-1.5">Email</label>
                  <input type="email" {...register('email')} className={inputCls('email')} placeholder="vous@exemple.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ocp-700 mb-1.5">Mot de passe</label>
                  <input type="password" {...register('password')} className={inputCls('password')} placeholder="••••••••" />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ocp-700 mb-1.5">Confirmer le mot de passe</label>
                  <input type="password" {...register('password_confirmation')} className={inputCls('password_confirmation')} placeholder="••••••••" />
                  {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation.message}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-ocp-500 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-ocp-600 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-ocp-500/25 disabled:opacity-60 mt-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L12 22M5 9L12 2 19 9" strokeLinejoin="round"/></svg>
                {loading ? "Inscription..." : "S'inscrire"}
              </button>
            </form>

            <p className="text-center mt-6 text-sm text-ocp-600">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-ocp-500 font-semibold hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        {/* Floating KPI Cards */}
        <div className="flex items-end justify-center gap-3 px-4 pb-12 flex-wrap">
          {[
            { label: 'Stages Actifs', badge: '+12%', badgeCls: 'text-emerald-600 bg-emerald-50', main: '1 240', extra: ['Jan', 'Fév', 'Mar', 'Avr'] },
            { label: 'Candidatures', badge: '2 854', badgeCls: 'text-ocp-500 bg-ocp-50', main: null, extra2: ['UM6P / Écoles', '64%', 'Universités', '28%'] },
            { label: 'Satisfaction', badge: '94.5%', badgeCls: 'text-emerald-600 bg-emerald-50', main: 'Attestation', extra: 'Génération immédiate' },
          ].map((card, i) => (
            <div
              key={i}
              className={`bg-white/96 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_rgba(2,66,29,0.08)] border border-ocp-500/6 p-5 min-w-[140px] flex-1 basis-[160px] max-w-[220px] ${fadeCls('card-' + i)}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ocp-700">{card.label}</span>
                <span className={`text-[0.72rem] font-semibold px-2.5 py-1 rounded-full ${card.badgeCls}`}>{card.badge}</span>
              </div>
              {card.main && <div className="font-cooper-medium text-2xl font-bold text-ocp-700 my-1.5">{card.main}</div>}
              {card.extra && Array.isArray(card.extra) && (
                <div className="flex justify-between text-[0.65rem] text-ocp-600 mt-1.5">
                  {card.extra.map((m, j) => <span key={j}>{m}</span>)}
                </div>
              )}
              {card.extra2 && card.extra2.map((item, j) => (
                <div key={j} className="flex justify-between text-[0.75rem] text-ocp-600 my-1.5">
                  {j % 2 === 0 && <span>{item}</span>}
                  {j % 2 === 1 && <b className="text-ocp-700">{item}</b>}
                </div>
              ))}
              {typeof card.extra === 'string' && (
                <div className="text-[0.7rem] text-ocp-600 mt-1">{card.extra}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-ocp-900 text-white/60 py-8 px-5 text-xs text-center border-t border-white/5">
        &copy; 2026 OCP Group — Portail des Stages
        <a href="#" className="text-white/50 hover:text-white ml-2 mr-2 transition-colors">Mentions légales</a>
        <a href="#" className="text-white/50 hover:text-white mr-2 transition-colors">Confidentialité</a>
        <a href="#" className="text-white/50 hover:text-white transition-colors">Support</a>
      </footer>
    </section>
  );
};

export default Register;
