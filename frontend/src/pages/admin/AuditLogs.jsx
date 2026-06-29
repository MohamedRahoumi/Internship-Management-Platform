import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import Loading from '../../components/ui/Loading';

const actionLabels = {
  login: 'Connexion', logout: 'Déconnexion', create: 'Création', update: 'Modification',
  delete: 'Suppression', approve: 'Approbation', reject: 'Rejet', generate: 'Génération', scan: 'Scan QR',
};

const actionColors = {
  login: 'blue', logout: 'purple', create: 'green', update: 'amber',
  delete: 'red', approve: 'green', reject: 'red', generate: 'blue', scan: 'purple',
};

const roleLabels = { administrator: 'Administrateur', rh: 'RH', supervisor: 'Superviseur', intern: 'Stagiaire' };
const roleColors = { administrator: 'red', rh: 'blue', supervisor: 'purple', intern: 'green' };

const modelLabels = {
  User: 'Utilisateur', InternshipApplication: 'Candidature', Intern: 'Stagiaire',
  Attendance: 'Présence', InternshipReport: 'Rapport', Evaluation: 'Évaluation',
  Certificate: 'Attestation', Department: 'Département',
};

const badgeMap = {
  blue: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  green: 'bg-emerald-100 text-emerald-700',
  amber: 'bg-amber-100 text-amber-700',
  red: 'bg-red-100 text-red-700',
  slate: 'bg-slate-100 text-slate-600',
};

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');
  const [meta, setMeta] = useState(null);
  const [visible, setVisible] = useState({});
  const initialized = useRef(false);

  const fetchLogs = (page = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ page, per_page: 25, sort: sortField, dir: sortDir });
    if (search) params.append('search', search);
    if (actionFilter) params.append('action', actionFilter);
    if (roleFilter) params.append('role', roleFilter);
    api.get(`/audit-logs?${params}`)
      .then((res) => { setLogs(res.data.data || []); setMeta(res.data.meta || null); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { const t = setTimeout(() => fetchLogs(), 300); return () => clearTimeout(t); }, [search, actionFilter, roleFilter]);
  useEffect(() => { fetchLogs(); }, [sortField, sortDir]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    [0, 1, 2].forEach((id, i) => setTimeout(() => setVisible((v) => ({ ...v, [id]: true })), 60 + i * 60));
  }, []);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('desc'); }
  };

  const fadeCls = (id) =>
    `transition-all duration-600 ease-out ${visible[id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`;

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <i className="fas fa-sort text-gray-300 ml-1 text-[0.6rem]" />;
    return <i className={`fas fa-sort-${sortDir === 'asc' ? 'up' : 'down'} text-ocp-500 ml-1 text-[0.6rem]`} />;
  };

  return (
    <div>
      {/* Header */}
      <div className={fadeCls(0)}>
        <h1 className="font-cooper-medium text-3xl sm:text-4xl text-ocp-700 tracking-tight">Journal d'audit</h1>
        <p className="text-gray-500 text-sm mt-1">Traçabilité des actions sur la plateforme</p>
      </div>

      {/* Filters */}
      <div className={`bg-white border border-ocp-500/5 rounded-[20px] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.04)] mt-8 mb-6 ${fadeCls(1)}`}>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-ocp-700 mb-1.5">Recherche</label>
            <div className="flex items-center gap-2 bg-ocp-50 px-3.5 py-2 rounded-xl border border-ocp-200 focus-within:border-ocp-500 focus-within:bg-white transition-all">
              <i className="fas fa-search text-gray-400 text-sm" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Utilisateur, email, action..."
                className="border-none bg-transparent outline-none text-sm py-0.5 w-full placeholder:text-gray-400 text-ocp-700"
              />
            </div>
          </div>
          <div className="w-full sm:w-44">
            <label className="block text-xs font-semibold text-ocp-700 mb-1.5">Rôle</label>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-[10px] rounded-xl border border-ocp-200 text-sm bg-ocp-50 outline-none focus:border-ocp-500 focus:bg-white focus:ring-3 focus:ring-ocp-500/15 transition-all cursor-pointer">
              <option value="">Tous les rôles</option>
              {Object.entries(roleLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="w-full sm:w-44">
            <label className="block text-xs font-semibold text-ocp-700 mb-1.5">Action</label>
            <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}
              className="w-full px-4 py-[10px] rounded-xl border border-ocp-200 text-sm bg-ocp-50 outline-none focus:border-ocp-500 focus:bg-white focus:ring-3 focus:ring-ocp-500/15 transition-all cursor-pointer">
              <option value="">Toutes les actions</option>
              {Object.entries(actionLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <a href={`${api.defaults.baseURL}/export/audit-logs`}
            className="bg-white border border-ocp-200 text-ocp-600 font-semibold py-[10px] px-4 rounded-[12px] text-sm transition-all duration-200 hover:bg-ocp-50 hover:border-ocp-500 flex items-center gap-2 shrink-0"
            download>
            <i className="fas fa-file-excel text-sm" /> Export CSV
          </a>
        </div>
      </div>

      {/* Table */}
      <div className={`bg-white border border-ocp-500/5 rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-200 hover:shadow-[0_16px_40px_rgba(2,66,29,0.08)] ${fadeCls(2)}`}>
        {loading ? <Loading /> : (
          logs.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">Aucun journal d'audit trouvé</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left px-4 py-3.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Utilisateur</th>
                    <th className="text-left px-4 py-3.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Email</th>
                    <th className="text-left px-4 py-3.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Rôle</th>
                    <th className="text-left px-4 py-3.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200 cursor-pointer select-none" onClick={() => toggleSort('action')}>
                      Action <SortIcon field="action" />
                    </th>
                    <th className="text-left px-4 py-3.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Module</th>
                    <th className="text-left px-4 py-3.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200 cursor-pointer select-none" onClick={() => toggleSort('created_at')}>
                      Date & Heure <SortIcon field="created_at" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-ocp-100 transition-colors">
                      <td className="px-4 py-3 border-b border-black/3">
                        <span className="font-semibold text-ocp-700">{log.user ? `${log.user.nom} ${log.user.prenom}` : 'Système'}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 border-b border-black/3">{log.user?.email || '—'}</td>
                      <td className="px-4 py-3 border-b border-black/3">
                        {log.user && (
                          <span className={`inline-block text-[0.7rem] font-semibold px-3 py-0.5 rounded-full ${badgeMap[roleColors[log.user.role]] || badgeMap.slate}`}>
                            {roleLabels[log.user.role] || log.user.role}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 border-b border-black/3">
                        <span className={`inline-block text-[0.7rem] font-semibold px-3 py-0.5 rounded-full ${badgeMap[actionColors[log.action]] || badgeMap.slate}`}>
                          {actionLabels[log.action] || log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-ocp-600 border-b border-black/3">{modelLabels[log.model_type?.split('\\').pop()] || log.model_type?.split('\\').pop() || '—'}</td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap border-b border-black/3">
                        {log.created_at ? new Date(log.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 text-sm text-gray-500">
            <span>Page {meta.current_page} / {meta.last_page} ({meta.total} entrées)</span>
            <div className="flex gap-2">
              <button
                disabled={meta.current_page <= 1}
                onClick={() => fetchLogs(meta.current_page - 1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-ocp-50 hover:border-ocp-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <i className="fas fa-chevron-left" /> Précédent
              </button>
              <button
                disabled={meta.current_page >= meta.last_page}
                onClick={() => fetchLogs(meta.current_page + 1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-ocp-50 hover:border-ocp-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Suivant <i className="fas fa-chevron-right" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
