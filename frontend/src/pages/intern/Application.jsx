import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import { statusBadge } from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import Alert from '../../components/ui/Alert';

const CYCLES = [
  'OFPPT', 'HSE Centre de formation privé', 'YouCode', 'B.T.S',
  'D.U.T (E.S.T, ENSET...)', 'D.E.U.G', 'Tronc Commun', 'Classes Préparatoires',
  'Licence', "Licence d'excellence", 'Bachelor 3rd year', 'Bachelor 4th year EL AKHAWAYN',
  'Cycle Supérieur (Écoles de Gestion et Commerce)', 'Master', "Cycle d'Ingénieur", 'Doctorant',
];

const NIVEAUX = ['Doctorant', 'Bac+5', 'Bac+4', 'Bac+3', '2ème Année', '1ère Année'];

const fieldClass = (err) => `input-field ${err ? 'input-error' : ''}`;

const Application = () => {
  const [existing, setExisting] = useState(null);
  const [canApply, setCanApply] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    cin: '', civility: '', nom: '', prenom: '', telephone: '', email: '',
    cycle_formation: '', niveau_etude: '', ville_etablissement: '', type_etablissement: '',
    nom_complet_etablissement: '', specialite: '',
    date_debut: '', date_fin: '', duree: '',
    whatsapp_confirmed: false, dossier_envoye: false, conditions_acceptees: false,
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    api.get('/my-applications')
      .then((res) => {
        const apps = res.data.data || res.data.applications || [];
        if (apps.length > 0) setExisting(apps[0]);
        if (res.data.can_apply !== undefined) setCanApply(res.data.can_apply);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (existing) return;
    api.get('/user').then((res) => {
      const u = res.data.user || res.data;
      if (u) setForm((f) => ({ ...f, cin: u.cin || '', nom: u.nom || '', prenom: u.prenom || '', telephone: u.telephone || '', email: u.email || '' }));
    }).catch(() => {});
  }, [existing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'nom') setForm((f) => ({ ...f, nom: value.toUpperCase() }));
    else setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowed.includes(file.type)) { setErrors((e) => ({ ...e, photo: 'Format accepté : JPG, JPEG ou PNG' })); return; }
    if (file.size > 2 * 1024 * 1024) { setErrors((e) => ({ ...e, photo: 'La photo ne doit pas dépasser 2 Mo' })); return; }
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
    setErrors((e) => ({ ...e, photo: undefined }));
  };

  const validate = () => {
    const errs = {};
    const fields = ['cin', 'civility', 'nom', 'prenom', 'telephone', 'email', 'cycle_formation', 'niveau_etude', 'ville_etablissement', 'type_etablissement', 'nom_complet_etablissement', 'specialite', 'date_debut', 'date_fin', 'duree'];
    fields.forEach((f) => { if (!form[f]) errs[f] = 'Champ requis'; });
    ['whatsapp_confirmed', 'dossier_envoye', 'conditions_acceptees'].forEach((c) => { if (!form[c]) errs[c] = 'Confirmation requise'; });
    if (form.date_debut) { const d = new Date(form.date_debut); if (d.getDay() !== 1) errs.date_debut = 'La date de début doit être un lundi'; }
    if (form.date_debut && form.date_fin && form.date_fin <= form.date_debut) errs.date_fin = 'La date de fin doit être après la date de début';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (['whatsapp_confirmed', 'dossier_envoye', 'conditions_acceptees'].includes(k)) { if (v) fd.append(k, '1'); }
        else fd.append(k, v);
      });
      if (photo) fd.append('photo', photo);
      await api.post('/applications', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSubmitted(true);
    } catch (err) {
      if (err.response?.status === 409) {
        setServerError(err.response.data?.message || "Vous avez déjà un stage en cours.");
      } else {
        const serverErrors = err.response?.data?.errors;
        if (serverErrors) { const mapped = {}; Object.entries(serverErrors).forEach(([key, msgs]) => { mapped[key] = msgs[0]; }); setErrors(mapped); }
        setServerError("Erreur lors de l'envoi de la candidature");
      }
    }
  };

  if (loading) return <Loading />;

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="bg-white border border-ocp-100 rounded-xl p-8">
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-lg font-bold text-ocp-800 mb-2">Candidature soumise !</h2>
          <p className="text-sm text-ocp-500">Votre demande de stage a été envoyée avec succès. Vous recevrez une réponse sous peu.</p>
        </div>
      </div>
    );
  }

  if (!canApply && !existing) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="bg-white border border-ocp-100 rounded-xl p-8">
          <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
          </div>
          <h2 className="text-lg font-bold text-ocp-800 mb-2">Stage déjà en cours</h2>
          <p className="text-sm text-ocp-500">
            Vous avez déjà un stage en cours. Vous ne pouvez pas déposer une nouvelle candidature tant que votre stage actuel n'est pas terminé.
          </p>
        </div>
      </div>
    );
  }

  if (existing) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="bg-white border border-ocp-100 rounded-xl p-8">
          <div className="w-14 h-14 bg-ocp-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-ocp-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <h2 className="text-lg font-bold text-ocp-800 mb-2">Demande déjà soumise</h2>
          <p className="text-sm text-ocp-500 mb-4">
            Vous avez déjà une demande de stage avec le statut :{' '}
            {statusBadge(existing.status).badge}
          </p>
          {existing.motif_refus && (
            <Alert type="error"><strong>Motif de refus :</strong> {existing.motif_refus}</Alert>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Demande de stage" />

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="page-card">
          <h2 className="text-sm font-semibold text-ocp-800 mb-4 pb-3 border-b border-ocp-100">Informations Personnelles</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-field">C.I.N</label>
                <input type="text" name="cin" value={form.cin} onChange={handleChange} className={fieldClass(errors.cin)} />
                {errors.cin && <p className="error-text">{errors.cin}</p>}
              </div>
              <div>
                <label className="label-field">Civilité</label>
                <select name="civility" value={form.civility} onChange={handleChange} className={`select-field ${errors.civility ? 'input-error' : ''}`}>
                  <option value="">Sélectionner</option>
                  <option value="Monsieur">Monsieur</option>
                  <option value="Madame">Madame</option>
                  <option value="Mademoiselle">Mademoiselle</option>
                </select>
                {errors.civility && <p className="error-text">{errors.civility}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-field">Nom (en MAJUSCULES)</label>
                <input type="text" name="nom" value={form.nom} onChange={handleChange} className={fieldClass(errors.nom)} placeholder="EXEMPLE" />
                {errors.nom && <p className="error-text">{errors.nom}</p>}
              </div>
              <div>
                <label className="label-field">Prénom</label>
                <input type="text" name="prenom" value={form.prenom} onChange={handleChange} className={fieldClass(errors.prenom)} />
                {errors.prenom && <p className="error-text">{errors.prenom}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-field">Téléphone</label>
                <input type="tel" name="telephone" value={form.telephone} onChange={handleChange} className={fieldClass(errors.telephone)} />
                {errors.telephone && <p className="error-text">{errors.telephone}</p>}
              </div>
              <div>
                <label className="label-field">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className={fieldClass(errors.email)} />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>
            </div>
            <div>
              <label className="label-field">Photo d'identité</label>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => fileRef.current?.click()} className="btn-secondary btn-sm">
                  Choisir un fichier
                </button>
                <span className="text-sm text-ocp-400">{photo ? photo.name : 'JPG, JPEG ou PNG (max 2 Mo)'}</span>
              </div>
              <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png" onChange={handlePhoto} className="hidden" />
              {preview && <img src={preview} alt="Aperçu" className="mt-2 w-20 h-20 object-cover rounded border border-ocp-100" />}
              {errors.photo && <p className="error-text">{errors.photo}</p>}
            </div>
          </div>
        </div>

        <div className="page-card">
          <h2 className="text-sm font-semibold text-ocp-800 mb-4 pb-3 border-b border-ocp-100">Informations Académiques</h2>
          <div className="space-y-4">
            <div>
              <label className="label-field">Cycle de formation</label>
              <select name="cycle_formation" value={form.cycle_formation} onChange={handleChange} className={`select-field ${errors.cycle_formation ? 'input-error' : ''}`}>
                <option value="">Sélectionner le cycle</option>
                {CYCLES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.cycle_formation && <p className="error-text">{errors.cycle_formation}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-field">Niveau d'étude</label>
                <select name="niveau_etude" value={form.niveau_etude} onChange={handleChange} className={`select-field ${errors.niveau_etude ? 'input-error' : ''}`}>
                  <option value="">Sélectionner le niveau</option>
                  {NIVEAUX.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
                {errors.niveau_etude && <p className="error-text">{errors.niveau_etude}</p>}
              </div>
              <div>
                <label className="label-field">Ville de l'établissement</label>
                <input type="text" name="ville_etablissement" value={form.ville_etablissement} onChange={handleChange} className={fieldClass(errors.ville_etablissement)} />
                {errors.ville_etablissement && <p className="error-text">{errors.ville_etablissement}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-field">Type d'établissement</label>
                <select name="type_etablissement" value={form.type_etablissement} onChange={handleChange} className={`select-field ${errors.type_etablissement ? 'input-error' : ''}`}>
                  <option value="">Sélectionner</option>
                  <option value="Public">Public</option>
                  <option value="Privé">Privé</option>
                </select>
                {errors.type_etablissement && <p className="error-text">{errors.type_etablissement}</p>}
              </div>
              <div>
                <label className="label-field">Nom de l'établissement</label>
                <input type="text" name="nom_complet_etablissement" value={form.nom_complet_etablissement} onChange={handleChange} className={fieldClass(errors.nom_complet_etablissement)} />
                {errors.nom_complet_etablissement && <p className="error-text">{errors.nom_complet_etablissement}</p>}
              </div>
            </div>
            <div>
              <label className="label-field">Spécialité</label>
              <input type="text" name="specialite" value={form.specialite} onChange={handleChange} className={fieldClass(errors.specialite)} />
              {errors.specialite && <p className="error-text">{errors.specialite}</p>}
            </div>
          </div>
        </div>

        <div className="page-card">
          <h2 className="text-sm font-semibold text-ocp-800 mb-4 pb-3 border-b border-ocp-100">Informations de Stage</h2>
          <div className="space-y-4">
            <div>
              <label className="label-field">Durée (en mois)</label>
              <input type="number" name="duree" value={form.duree} onChange={handleChange} min="1" max="12" className={fieldClass(errors.duree)} />
              {errors.duree && <p className="error-text">{errors.duree}</p>}
              <p className="mt-1 text-xs text-ocp-400">La durée maximale dépend de votre cycle de formation.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-field">Date début (doit être un lundi)</label>
                <input type="date" name="date_debut" value={form.date_debut} onChange={handleChange} className={fieldClass(errors.date_debut)} />
                {errors.date_debut && <p className="error-text">{errors.date_debut}</p>}
              </div>
              <div>
                <label className="label-field">Date fin</label>
                <input type="date" name="date_fin" value={form.date_fin} onChange={handleChange} className={fieldClass(errors.date_fin)} />
                {errors.date_fin && <p className="error-text">{errors.date_fin}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="page-card">
          <h2 className="text-sm font-semibold text-ocp-800 mb-4 pb-3 border-b border-ocp-100">Confirmation</h2>
          <div className="space-y-3">
            {[
              ['whatsapp_confirmed', 'Je confirme mon adhésion au groupe WhatsApp dédié aux stagiaires.'],
              ['dossier_envoye', 'Je confirme avoir déposé mon dossier papier complet.'],
              ['conditions_acceptees', "J'accepte les conditions générales de stage."],
            ].map(([name, label]) => (
              <div key={name}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} className="mt-0.5" />
                  <span className="text-sm text-ocp-700">{label}</span>
                </label>
                {errors[name] && <p className="error-text ml-7">{errors[name]}</p>}
              </div>
            ))}
          </div>
        </div>

        <Alert type="error">{serverError}</Alert>

        <Button type="submit" className="w-full justify-center">
          Soumettre ma demande
        </Button>
      </form>
    </div>
  );
};

export default Application;


