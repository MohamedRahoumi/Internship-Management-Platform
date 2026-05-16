import { useState } from 'react';
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

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-700 rounded-md mb-4">
            <span className="text-white text-lg font-bold">OCP</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Gestion Stagiaires</h1>
          <p className="text-sm text-slate-500 mt-1">Créez votre compte</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-6">
          <Alert type="error">{error}</Alert>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-field">CIN</label>
                <input type="text" {...register('cin')} className={`input-field ${errors.cin ? 'input-error' : ''}`} placeholder="Numéro CIN" />
                {errors.cin && <p className="error-text">{errors.cin.message}</p>}
              </div>
              <div>
                <label className="label-field">Civilité</label>
                <select {...register('civility')} className={`select-field ${errors.civility ? 'input-error' : ''}`}>
                  <option value="">Sélectionner</option>
                  <option value="Monsieur">Monsieur</option>
                  <option value="Madame">Madame</option>
                  <option value="Mademoiselle">Mademoiselle</option>
                </select>
                {errors.civility && <p className="error-text">{errors.civility.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-field">Nom</label>
                <input type="text" {...register('nom')} className={`input-field ${errors.nom ? 'input-error' : ''}`} placeholder="Votre nom" />
                {errors.nom && <p className="error-text">{errors.nom.message}</p>}
              </div>
              <div>
                <label className="label-field">Prénom</label>
                <input type="text" {...register('prenom')} className={`input-field ${errors.prenom ? 'input-error' : ''}`} placeholder="Votre prénom" />
                {errors.prenom && <p className="error-text">{errors.prenom.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-field">Téléphone</label>
                <input type="text" {...register('telephone')} className={`input-field ${errors.telephone ? 'input-error' : ''}`} placeholder="06 XX XX XX XX" />
                {errors.telephone && <p className="error-text">{errors.telephone.message}</p>}
              </div>
              <div>
                <label className="label-field">Email</label>
                <input type="email" {...register('email')} className={`input-field ${errors.email ? 'input-error' : ''}`} placeholder="vous@exemple.com" />
                {errors.email && <p className="error-text">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-field">Mot de passe</label>
                <input type="password" {...register('password')} className={`input-field ${errors.password ? 'input-error' : ''}`} placeholder="••••••••" />
                {errors.password && <p className="error-text">{errors.password.message}</p>}
              </div>
              <div>
                <label className="label-field">Confirmer le mot de passe</label>
                <input type="password" {...register('password_confirmation')} className={`input-field ${errors.password_confirmation ? 'input-error' : ''}`} placeholder="••••••••" />
                {errors.password_confirmation && <p className="error-text">{errors.password_confirmation.message}</p>}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? "Inscription..." : "S'inscrire"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-500">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-blue-700 hover:text-blue-800 font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;


