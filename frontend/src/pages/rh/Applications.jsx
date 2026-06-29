import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../../api/axios';
import { statusBadge } from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Loading from '../../components/ui/Loading';
import Alert from '../../components/ui/Alert';
import SearchInput from '../../components/ui/SearchInput';

const cycleLabels = { licence: 'Licence', master: 'Master', ingeniorat: 'Ingéniorat', doctorat: 'Doctorat', autre: 'Autre' };
const niveauLabels = { bac1: 'Bac+1', bac2: 'Bac+2', bac3: 'Bac+3', bac4: 'Bac+4', bac5: 'Bac+5', bac6: 'Bac+6', autre: 'Autre' };
const ouiNon = (v) => (v ? 'Oui' : 'Non');

const badgeMap = {
  amber: 'bg-amber-100 text-amber-700',
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-emerald-100 text-emerald-700',
  red: 'bg-red-100 text-red-700',
  slate: 'bg-slate-100 text-slate-600',
  teal: 'bg-teal-100 text-teal-700',
  purple: 'bg-purple-100 text-purple-700',
};

const STATUS_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'pending', label: 'En attente' },
  { value: 'under_review', label: 'En cours d\'examen' },
  { value: 'approved', label: 'Approuvée' },
  { value: 'active', label: 'Active' },
  { value: 'rejected', label: 'Refusée' },
];

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [action, setAction] = useState('accept');
  const [form, setForm] = useState({ department_id: '', supervisor_id: '' });
  const [message, setMessage] = useState('');
  const [detailOpen, setDetailOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [visible, setVisible] = useState({});
  const initialized = useRef(false);
  const debounceRef = useRef(null);

  const fetchData = useCallback((searchTerm = search, statusVal = statusFilter) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (statusVal) params.append('status', statusVal);
    Promise.all([
      api.get(`/applications?${params}`).catch(() => ({ data: { data: [] } })),
      api.get('/departments').catch(() => ({ data: [] })),
      api.get('/users/supervisors/list').catch(() => ({ data: [] })),
    ]).then(([appsRes, deptRes, supRes]) => {
      setApplications(appsRes.data?.data || appsRes.data || []);
      setDepartments(Array.isArray(deptRes.data) ? deptRes.data : deptRes.data?.departments || []);
      setSupervisors(Array.isArray(supRes.data) ? supRes.data : supRes.data?.users || []);
    }).finally(() => setLoading(false));
  }, [search, statusFilter]);

  useEffect(() => { fetchData(); }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchData(val, statusFilter), 400);
  };

  const handleStatusChange = (e) => {
    const val = e.target.value;
    setStatusFilter(val);
    fetchData(search, val);
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    for (let i = 0; i < 4; i++) {
      setTimeout(() => setVisible((v) => ({ ...v, [i]: true })), 60 + i * 60);
    }
  }, []);

  const openModal = (app, act) => {
    setSelectedApp(app);
    setAction(act);
    setForm({ department_id: app.department_id?.toString() || '', supervisor_id: '' });
    setMessage('');
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!selectedApp) return;
    setMessage('');
    try {
      if (action === 'accept') {
        await api.post(`/applications/${selectedApp.id}/approve`, form);
      } else {
        await api.post(`/applications/${selectedApp.id}/reject`, { motif_refus: 'Refusé' });
      }
      setModalOpen(false);
      setSelectedApp(null);
      fetchData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur lors du traitement");
    }
  };

  const fadeCls = (id) =>
    `transition-all duration-600 ease-out ${visible[id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`;

  return (
    <div>
      <div className={fadeCls(0)}>
        <h1 className="font-cooper-medium text-3xl sm:text-4xl text-ocp-700 tracking-tight">Candidatures</h1>
        <p className="text-gray-500 text-sm mt-1">Gestion des candidatures de stage</p>
      </div>

      <div className={`flex flex-col sm:flex-row gap-3 mt-8 ${fadeCls(1)}`}>
        <SearchInput value={search} onChange={handleSearchChange} placeholder="Rechercher un candidat..." className="flex-1" />
        <select value={statusFilter} onChange={handleStatusChange}
          className="w-full sm:w-56 px-4 py-3 rounded-xl border border-ocp-200 text-sm bg-ocp-50 outline-none focus:border-ocp-500 focus:bg-white focus:ring-3 focus:ring-ocp-500/15 transition-all cursor-pointer">
          {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>

      {loading ? <Loading /> : (
        <div className={`bg-white border border-ocp-500/5 rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-200 hover:shadow-[0_16px_40px_rgba(2,66,29,0.08)] mt-4 ${fadeCls(2)}`}>
          {applications.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">Aucune candidature</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Candidat</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Téléphone</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Filière</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Statut</th>
                    <th className="text-right px-5 py-3.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => {
                    const sb = statusBadge(app.status);
                    const initial = (app.user?.prenom?.[0] || app.user?.nom?.[0] || '?').toUpperCase();
                    return (
                      <tr key={app.id} className="hover:bg-ocp-100 transition-colors">
                        <td className="px-5 py-3.5 border-b border-black/3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ocp-500 to-ocp-700 text-white flex items-center justify-center text-xs font-bold shadow-sm shrink-0">
                              {initial}
                            </div>
                            <div>
                              <div className="font-semibold text-ocp-700 text-sm">{app.user?.prenom} {app.user?.nom}</div>
                              <div className="text-[0.7rem] text-gray-500">{app.user?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-gray-500 border-b border-black/3">{app.user?.telephone || '—'}</td>
                        <td className="px-5 py-3.5 text-gray-600 border-b border-black/3">{app.specialite || '—'}</td>
                        <td className="px-5 py-3.5 border-b border-black/3">
                          <span className={`inline-block text-[0.7rem] font-semibold px-3 py-0.5 rounded-full ${badgeMap[sb.color] || badgeMap.slate}`}>
                            {sb.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right border-b border-black/3">
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => { setSelectedApp(app); setDetailOpen(true); }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-ocp-600 hover:bg-ocp-50 hover:border-ocp-200 transition-all">
                              <i className="fas fa-eye" /> Détails
                            </button>
                            {app.status === 'pending' && (
                              <>
                                <button onClick={() => openModal(app, 'accept')}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 transition-all">
                                  <i className="fas fa-check" /> Accepter
                                </button>
                                <button onClick={() => openModal(app, 'reject')}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-red-500 hover:bg-red-50 hover:border-red-200 transition-all">
                                  <i className="fas fa-times" /> Refuser
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Details Modal */}
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="Détails de la candidature">
        {selectedApp && (
          <div className="space-y-5">
            <div>
              <h4 className="text-xs font-semibold text-ocp-500 uppercase tracking-wider mb-3">Informations personnelles</h4>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Nom</span><span className="font-medium text-ocp-700">{selectedApp.user?.nom}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Prénom</span><span className="font-medium text-ocp-700">{selectedApp.user?.prenom}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-medium text-ocp-700">{selectedApp.user?.email}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Téléphone</span><span className="font-medium text-ocp-700">{selectedApp.user?.telephone || '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">CIN</span><span className="font-medium text-ocp-700">{selectedApp.user?.cin || '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Civilité</span><span className="font-medium text-ocp-700">{selectedApp.user?.civility || '—'}</span></div>
              </div>
            </div>
            <hr className="border-ocp-100" />
            <div>
              <h4 className="text-xs font-semibold text-ocp-500 uppercase tracking-wider mb-3">Détails du stage</h4>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Cycle</span><span className="font-medium text-ocp-700">{cycleLabels[selectedApp.cycle_formation] || selectedApp.cycle_formation}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Niveau</span><span className="font-medium text-ocp-700">{niveauLabels[selectedApp.niveau_etude] || selectedApp.niveau_etude}</span></div>
                <div className="flex justify-between col-span-2"><span className="text-gray-500">Établissement</span><span className="font-medium text-ocp-700">{selectedApp.nom_complet_etablissement || selectedApp.etablissement}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Ville</span><span className="font-medium text-ocp-700">{selectedApp.ville_etablissement}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Spécialité</span><span className="font-medium text-ocp-700">{selectedApp.specialite}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Date début</span><span className="font-medium text-ocp-700">{selectedApp.date_debut ? new Date(selectedApp.date_debut).toLocaleDateString('fr-FR') : '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Date fin</span><span className="font-medium text-ocp-700">{selectedApp.date_fin ? new Date(selectedApp.date_fin).toLocaleDateString('fr-FR') : '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Durée</span><span className="font-medium text-ocp-700">{selectedApp.duree} mois</span></div>
              </div>
            </div>
            <hr className="border-ocp-100" />
            <div>
              <h4 className="text-xs font-semibold text-ocp-500 uppercase tracking-wider mb-3">Statut</h4>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Candidature</span><span>{statusBadge(selectedApp.status).badge}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">WhatsApp confirmé</span><span className="font-medium text-ocp-700">{ouiNon(selectedApp.whatsapp_confirmed)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Dossier envoyé</span><span className="font-medium text-ocp-700">{ouiNon(selectedApp.dossier_envoye)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Conditions acceptées</span><span className="font-medium text-ocp-700">{ouiNon(selectedApp.conditions_acceptees)}</span></div>
                <div className="flex justify-between col-span-2"><span className="text-gray-500">Date de soumission</span><span className="font-medium text-ocp-700">{selectedApp.created_at ? new Date(selectedApp.created_at).toLocaleDateString('fr-FR') : '—'}</span></div>
              </div>
            </div>
            {selectedApp.motif_refus && (
              <>
                <hr className="border-ocp-100" />
                <div>
                  <h4 className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-2">Motif de refus</h4>
                  <p className="text-sm text-red-700 bg-red-50 px-4 py-3 rounded-xl">{selectedApp.motif_refus}</p>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Action Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={action === 'accept' ? "Accepter la candidature" : "Refuser la candidature"}
      >
        <Alert type="error">{message}</Alert>
        <p className="text-sm text-ocp-600 mb-4">
          {action === 'accept'
            ? `Affecter ${selectedApp?.user?.prenom} ${selectedApp?.user?.nom} à un département et un superviseur`
            : `Êtes-vous sûr de vouloir refuser la candidature de ${selectedApp?.user?.prenom} ${selectedApp?.user?.nom} ?`}
        </p>

        {action === 'accept' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ocp-700 mb-1.5">Département</label>
              <select value={form.department_id} onChange={(e) => setForm({ ...form, department_id: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-ocp-200 text-sm bg-ocp-50 outline-none focus:border-ocp-500 focus:bg-white focus:ring-3 focus:ring-ocp-500/15 transition-all cursor-pointer">
                <option value="">Sélectionner</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-ocp-700 mb-1.5">Superviseur</label>
              <select value={form.supervisor_id} onChange={(e) => setForm({ ...form, supervisor_id: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-ocp-200 text-sm bg-ocp-50 outline-none focus:border-ocp-500 focus:bg-white focus:ring-3 focus:ring-ocp-500/15 transition-all cursor-pointer">
                <option value="">Sélectionner</option>
                {supervisors.map((s) => <option key={s.id} value={s.id}>{s.nom} {s.prenom}</option>)}
              </select>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={() => setModalOpen(false)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-ocp-50 transition-all">
            Annuler
          </button>
          <button onClick={handleSubmit}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl text-white transition-all hover:-translate-y-0.5 hover:shadow-md ${action === 'accept' ? 'bg-ocp-500 hover:bg-ocp-600 hover:shadow-ocp-500/25' : 'bg-red-600 hover:bg-red-700 hover:shadow-red-600/25'}`}>
            <i className={`fas ${action === 'accept' ? 'fa-check' : 'fa-times'}`} />
            {action === 'accept' ? 'Accepter' : 'Refuser'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Applications;
