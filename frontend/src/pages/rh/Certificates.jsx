import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../../api/axios';
import { statusBadge } from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import Alert from '../../components/ui/Alert';
import SearchInput from '../../components/ui/SearchInput';

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
  { value: 'active', label: 'Actif' },
  { value: 'completed', label: 'Terminé' },
  { value: 'suspended', label: 'Suspendu' },
];

const Certificates = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(null);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [visible, setVisible] = useState({});
  const initialized = useRef(false);
  const debounceRef = useRef(null);

  const fetchInterns = useCallback((searchTerm = search, statusVal = statusFilter) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (statusVal) params.append('status', statusVal);
    api.get(`/interns?${params}`)
      .then((res) => setInterns(res.data?.data || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, statusFilter]);

  useEffect(() => { fetchInterns(); }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchInterns(val, statusFilter), 400);
  };

  const handleStatusChange = (e) => {
    const val = e.target.value;
    setStatusFilter(val);
    fetchInterns(search, val);
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    for (let i = 0; i < 4; i++) {
      setTimeout(() => setVisible((v) => ({ ...v, [i]: true })), 60 + i * 60);
    }
  }, []);

  const handleGenerate = async (internId) => {
    setGenerating(internId);
    setMessage('');
    try {
      await api.post(`/certificates/generate/${internId}`);
      setMessage('Certificat généré avec succès.');
      fetchInterns();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de la génération.');
    } finally { setGenerating(null); }
  };

  if (loading) return <Loading />;

  const fadeCls = (id) =>
    `transition-all duration-600 ease-out ${visible[id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`;

  return (
    <div>
      <div className={fadeCls(0)}>
        <h1 className="font-cooper-medium text-3xl sm:text-4xl text-ocp-700 tracking-tight">Attestations</h1>
        <p className="text-gray-500 text-sm mt-1">Génération des attestations de stage</p>
      </div>

      <div className="mt-8">
        <Alert type="success">{message}</Alert>
      </div>

      <div className={`flex flex-col sm:flex-row gap-3 mt-4 ${fadeCls(1)}`}>
        <SearchInput value={search} onChange={handleSearchChange} placeholder="Rechercher un stagiaire..." className="flex-1" />
        <select value={statusFilter} onChange={handleStatusChange}
          className="w-full sm:w-56 px-4 py-3 rounded-xl border border-ocp-200 text-sm bg-ocp-50 outline-none focus:border-ocp-500 focus:bg-white focus:ring-3 focus:ring-ocp-500/15 transition-all cursor-pointer">
          {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>

      {interns.length === 0 ? (
        <div className={`bg-white border border-ocp-500/5 rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.04)] py-16 text-center text-gray-400 text-sm mt-4 ${fadeCls(2)}`}>
          Aucun stagiaire pour le moment.
        </div>
      ) : (
        <div className={`bg-white border border-ocp-500/5 rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-200 hover:shadow-[0_16px_40px_rgba(2,66,29,0.08)] mt-4 ${fadeCls(2)}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Stagiaire</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Période</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Statut</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Évaluation</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Certificat</th>
                  <th className="text-right px-5 py-3.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Action</th>
                </tr>
              </thead>
              <tbody>
                {interns.map((intern) => {
                  const sb = statusBadge(intern.status);
                  const initial = (intern.user?.prenom?.[0] || intern.user?.nom?.[0] || '?').toUpperCase();
                  return (
                    <tr key={intern.id} className="hover:bg-ocp-100 transition-colors">
                      <td className="px-5 py-3.5 border-b border-black/3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ocp-500 to-ocp-700 text-white flex items-center justify-center text-xs font-bold shadow-sm shrink-0">
                            {initial}
                          </div>
                          <div>
                            <div className="font-semibold text-ocp-700 text-sm">{intern.user?.prenom} {intern.user?.nom}</div>
                            <div className="text-[0.7rem] text-gray-500">{intern.user?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 border-b border-black/3 whitespace-nowrap">
                        {intern.date_debut ? new Date(intern.date_debut).toLocaleDateString('fr-FR') : '—'}
                        {' → '}
                        {intern.date_fin ? new Date(intern.date_fin).toLocaleDateString('fr-FR') : '—'}
                      </td>
                      <td className="px-5 py-3.5 border-b border-black/3">
                        <span className={`inline-block text-[0.7rem] font-semibold px-3 py-0.5 rounded-full ${badgeMap[sb.color] || badgeMap.slate}`}>
                          {sb.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 border-b border-black/3">
                        {intern.evaluation
                          ? <span className="inline-flex items-center text-xs font-semibold px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-700"><i className="fas fa-check mr-1 text-[0.6rem]" /> Complétée</span>
                          : <span className="text-xs text-gray-400">Non évalué</span>}
                      </td>
                      <td className="px-5 py-3.5 border-b border-black/3">
                        {intern.certificate
                          ? <span className="inline-flex items-center text-xs font-semibold px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-700"><i className="fas fa-check mr-1 text-[0.6rem]" /> Généré</span>
                          : <span className="text-xs text-gray-400">Non généré</span>}
                      </td>
                      <td className="px-5 py-3.5 text-right border-b border-black/3">
                        {!intern.certificate && intern.evaluation ? (
                          <button onClick={() => handleGenerate(intern.id)} disabled={generating === intern.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-ocp-500 hover:bg-ocp-50 hover:border-ocp-200 transition-all disabled:opacity-50">
                            {generating === intern.id ? <>
                              <i className="fas fa-spinner fa-spin" /> Génération...
                            </> : <>
                              <i className="fas fa-file-pdf" /> Générer
                            </>}
                          </button>
                        ) : intern.certificate ? (
                          <span className="text-xs text-gray-400"><i className="fas fa-check mr-1" /> Déjà généré</span>
                        ) : (
                          <span className="text-xs text-gray-400"><i className="fas fa-times mr-1" /> Évaluation requise</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;
