import { useState, useEffect } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import { statusBadge } from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Loading from '../../components/ui/Loading';
import Alert from '../../components/ui/Alert';

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

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      api.get('/applications').catch(() => ({ data: { data: [] } })),
      api.get('/departments').catch(() => ({ data: [] })),
      api.get('/users/supervisors/list').catch(() => ({ data: [] })),
    ]).then(([appsRes, deptRes, supRes]) => {
      setApplications(appsRes.data?.data || appsRes.data || []);
      setDepartments(Array.isArray(deptRes.data) ? deptRes.data : deptRes.data?.departments || []);
      setSupervisors(Array.isArray(supRes.data) ? supRes.data : supRes.data?.users || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

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

  return (
    <div>
      <PageHeader title="Candidatures" />

      {loading ? <Loading /> : (
        <div className="page-card">
          <Table>
            <Table.Head>
              <Table.Header>Stagiaire</Table.Header>
              <Table.Header>Email</Table.Header>
              <Table.Header>Téléphone</Table.Header>
              <Table.Header>Filière</Table.Header>
              <Table.Header>Statut</Table.Header>
              <Table.Header className="text-right">Actions</Table.Header>
            </Table.Head>
            <Table.Body>
              {applications.length === 0 ? <Table.Empty colSpan={6} message="Aucune candidature" /> : (
                applications.map((app) => (
                  <Table.Row key={app.id}>
                    <Table.Cell className="font-medium text-ocp-800">{app.user?.nom} {app.user?.prenom}</Table.Cell>
                    <Table.Cell className="text-ocp-500">{app.user?.email}</Table.Cell>
                    <Table.Cell className="text-ocp-500">{app.user?.telephone}</Table.Cell>
                    <Table.Cell className="text-ocp-600">{app.specialite}</Table.Cell>
                    <Table.Cell>{statusBadge(app.status).badge}</Table.Cell>
                    <Table.Cell className="text-right">
                      {app.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <Button variant="primary" size="sm" onClick={() => openModal(app, 'accept')}>Accepter</Button>
                          <Button variant="danger" size="sm" onClick={() => openModal(app, 'reject')}>Refuser</Button>
                        </div>
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        </div>
      )}

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
              <label className="label-field">Département</label>
              <select value={form.department_id} onChange={(e) => setForm({ ...form, department_id: e.target.value })} className="select-field">
                <option value="">Sélectionner</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Superviseur</label>
              <select value={form.supervisor_id} onChange={(e) => setForm({ ...form, supervisor_id: e.target.value })} className="select-field">
                <option value="">Sélectionner</option>
                {supervisors.map((s) => <option key={s.id} value={s.id}>{s.nom} {s.prenom}</option>)}
              </select>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Annuler</Button>
          <Button variant={action === 'accept' ? 'primary' : 'danger'} onClick={handleSubmit}>
            {action === 'accept' ? 'Accepter' : 'Refuser'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Applications;


