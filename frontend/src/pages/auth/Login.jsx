import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useAuthStore from '../../store/authStore';
import Alert from '../../components/ui/Alert';

const schema = z.object({
  email: z.string().min(1, 'Email requis').email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setError('');
    try {
      const user = await login(data.email, data.password);
      const redirect = {
        administrator: '/admin/dashboard',
        rh: '/rh/dashboard',
        supervisor: '/supervisor/dashboard',
        intern: '/intern/dashboard',
      }[user.role] || '/';
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Identifiants incorrects');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-700 rounded-md mb-4">
            <span className="text-white text-lg font-bold">OCP</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Gestion Stagiaires</h1>
          <p className="text-sm text-slate-500 mt-1">Connectez-vous à votre compte</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-6">
          <Alert type="error">{error}</Alert>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label-field">Email</label>
              <input
                type="email"
                {...register('email')}
                className={`input-field ${errors.email ? 'input-error' : ''}`}
                placeholder="vous@exemple.com"
              />
              {errors.email && <p className="error-text">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label-field">Mot de passe</label>
              <input
                type="password"
                {...register('password')}
                className={`input-field ${errors.password ? 'input-error' : ''}`}
                placeholder="••••••••"
              />
              {errors.password && <p className="error-text">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-500">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-blue-700 hover:text-blue-800 font-medium">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;


