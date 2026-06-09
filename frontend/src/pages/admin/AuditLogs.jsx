import { useState, useEffect } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import SearchInput from '../../components/ui/SearchInput';
import Pagination from '../../components/ui/Pagination';

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

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');
  const [meta, setMeta] = useState(null);

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

  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('desc'); }
  };

  return (
    <div>
      <PageHeader title="Journal d'audit" />

      <div className="bg-white border border-slate-200 rounded-md p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="label-field">Recherche</label>
            <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Utilisateur, email, action..." />
          </div>
          <div className="w-44">
            <label className="label-field">Rôle</label>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="select-field">
              <option value="">Tous les rôles</option>
              {Object.entries(roleLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="w-44">
            <label className="label-field">Action</label>
            <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="select-field">
              <option value="">Toutes les actions</option>
              {Object.entries(actionLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading ? <Loading /> : (
        <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
          <Table>
            <Table.Head>
              <Table.Header>Utilisateur</Table.Header>
              <Table.Header>Email</Table.Header>
              <Table.Header>Rôle</Table.Header>
              <Table.Header sortable onClick={() => toggleSort('action')}>Action</Table.Header>
              <Table.Header>Module</Table.Header>
              <Table.Header>Description</Table.Header>
              <Table.Header sortable onClick={() => toggleSort('created_at')}>Date & Heure</Table.Header>
            </Table.Head>
            <Table.Body>
              {logs.length === 0 ? <Table.Empty colSpan={7} message="Aucun journal d'audit trouvé" /> : (
                logs.map((log) => (
                  <Table.Row key={log.id}>
                    <Table.Cell className="font-medium text-slate-800">{log.user ? `${log.user.nom} ${log.user.prenom}` : 'Système'}</Table.Cell>
                    <Table.Cell className="text-slate-500">{log.user?.email || '—'}</Table.Cell>
                    <Table.Cell>
                      {log.user && <Badge color={roleColors[log.user.role] || 'slate'}>{roleLabels[log.user.role] || log.user.role}</Badge>}
                    </Table.Cell>
                    <Table.Cell><Badge color={actionColors[log.action] || 'slate'}>{actionLabels[log.action] || log.action}</Badge></Table.Cell>
                    <Table.Cell className="text-slate-600">{modelLabels[log.model_type] || log.model_type || '—'}</Table.Cell>
                    <Table.Cell className="text-slate-500 max-w-xs truncate" title={log.description}>{log.description}</Table.Cell>
                    <Table.Cell className="text-slate-500 whitespace-nowrap">
                      {log.created_at ? new Date(log.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
          <Pagination meta={meta} onPageChange={fetchLogs} />
        </div>
      )}
    </div>
  );
};

export default AuditLogs;


