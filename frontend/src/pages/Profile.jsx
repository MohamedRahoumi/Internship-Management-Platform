import { useState } from 'react';
import useAuthStore from '../store/authStore';
import api from '../api/axios';
import Alert from '../components/ui/Alert';

const roleLabels = {
  administrator: 'Administrateur',
  rh: 'Ressources Humaines',
  supervisor: 'Encadrant',
  intern: 'Stagiaire',
};

const civilityLabels = {
  M: 'Monsieur',
  Mme: 'Madame',
};

const Profile = () => {
  const user = useAuthStore((s) => s.user);
  const fetchUser = useAuthStore((s) => s.fetchUser);

  const [form, setForm] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
  });
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const fd = new FormData();
      fd.append('_method', 'PUT');
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (password && password.length >= 8) {
        if (password !== passwordConfirm) {
          setAlert({ type: 'error', message: 'Les mots de passe ne correspondent pas.' });
          setLoading(false);
          return;
        }
        fd.append('password', password);
      }
      if (photoFile) fd.append('photo', photoFile);

      const res = await api.post(`/users/${user.id}`, fd);
      await fetchUser();
      setAlert({ type: 'success', message: 'Profil mis à jour avec succès.' });
      setPassword('');
      setPasswordConfirm('');
      setPhotoFile(null);
      setPhotoPreview(null);
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || "Erreur lors de la mise à jour du profil.",
      });
    } finally {
      setLoading(false);
    }
  };

  const initials = user ? `${user.prenom?.[0] || ''}${user.nom?.[0] || ''}`.toUpperCase() : '?';

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-[14px] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00843D, #02421D)' }}>
          <i className="fas fa-user text-white text-lg" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-ocp-800">Mon profil</h1>
          <p className="text-sm text-gray-500">Gérez vos informations personnelles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[20px] shadow-[0_8px_32px_rgba(0,132,61,0.08)] border border-ocp-100 p-6 text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <label className="cursor-pointer block w-full h-full">
                {photoPreview || user?.photo ? (
                  <img src={photoPreview || user?.photo} alt="Photo" className="w-24 h-24 rounded-full object-cover shadow-lg shadow-ocp-500/20" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-ocp-500 to-ocp-700 text-white flex items-center justify-center text-3xl font-bold shadow-lg shadow-ocp-500/20">
                    {initials}
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <i className="fas fa-camera text-white text-lg" />
                </div>
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>
            <h2 className="font-semibold text-ocp-800 text-lg">{user.prenom} {user.nom}</h2>
            <span className="inline-block mt-1.5 px-3 py-1 rounded-full text-xs font-medium bg-ocp-50 text-ocp-600 border border-ocp-200">
              {roleLabels[user.role] || user.role}
            </span>
            <hr className="my-4 border-ocp-100" />
            <div className="space-y-2.5 text-left text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">CIN</span>
                <span className="font-medium text-ocp-700">{user.cin || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Civilité</span>
                <span className="font-medium text-ocp-700">{civilityLabels[user.civility] || user.civility || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Département</span>
                <span className="font-medium text-ocp-700">{user.department?.name || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Membre depuis</span>
                <span className="font-medium text-ocp-700">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : '—'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-[20px] shadow-[0_8px_32px_rgba(0,132,61,0.08)] border border-ocp-100 p-6 sm:p-8">
            <h3 className="font-semibold text-ocp-800 text-base mb-6 flex items-center gap-2">
              <i className="fas fa-pen text-ocp-500 text-sm" />
              Informations générales
            </h3>

            {alert && (
              <div className="mb-5">
                <Alert type={alert.type}>{alert.message}</Alert>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-ocp-700 mb-1.5">Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={form.nom}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-ocp-200 text-sm transition-all outline-none bg-ocp-50 focus:bg-white focus:border-ocp-500 focus:ring-3 focus:ring-ocp-500/15 text-ocp-700"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ocp-700 mb-1.5">Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  value={form.prenom}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-ocp-200 text-sm transition-all outline-none bg-ocp-50 focus:bg-white focus:border-ocp-500 focus:ring-3 focus:ring-ocp-500/15 text-ocp-700"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ocp-700 mb-1.5">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-ocp-200 text-sm transition-all outline-none bg-ocp-50 focus:bg-white focus:border-ocp-500 focus:ring-3 focus:ring-ocp-500/15 text-ocp-700"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ocp-700 mb-1.5">Téléphone</label>
                <input
                  type="text"
                  name="telephone"
                  value={form.telephone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-ocp-200 text-sm transition-all outline-none bg-ocp-50 focus:bg-white focus:border-ocp-500 focus:ring-3 focus:ring-ocp-500/15 text-ocp-700"
                />
              </div>
            </div>

            <hr className="my-6 border-ocp-100" />

            <h3 className="font-semibold text-ocp-800 text-base mb-6 flex items-center gap-2">
              <i className="fas fa-lock text-ocp-500 text-sm" />
              Modifier le mot de passe
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-ocp-700 mb-1.5">
                  Nouveau mot de passe <span className="text-gray-400 font-normal">(optionnel)</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 caractères"
                  className="w-full px-4 py-3 rounded-xl border border-ocp-200 text-sm transition-all outline-none bg-ocp-50 focus:bg-white focus:border-ocp-500 focus:ring-3 focus:ring-ocp-500/15 text-ocp-700"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ocp-700 mb-1.5">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="Retaper le mot de passe"
                  className="w-full px-4 py-3 rounded-xl border border-ocp-200 text-sm transition-all outline-none bg-ocp-50 focus:bg-white focus:border-ocp-500 focus:ring-3 focus:ring-ocp-500/15 text-ocp-700"
                />
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-ocp-500 to-ocp-700 text-white font-semibold py-3 px-8 rounded-[12px] text-sm transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><i className="fas fa-spinner fa-spin" /> Enregistrement...</>
                ) : (
                  <><i className="fas fa-save" /> Enregistrer</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
