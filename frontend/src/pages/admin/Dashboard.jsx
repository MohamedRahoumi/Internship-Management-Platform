import { useState, useEffect } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import Loading from '../../components/ui/Loading';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import { IconUsers, IconBuilding, IconGraduate, IconClipboard } from '../../components/ui/Icons';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/admin')
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const cards = [
    { label: 'RH', value: stats?.rh_count ?? 0, icon: IconUsers },
    { label: 'Encadrants', value: stats?.supervisor_count ?? 0, icon: IconUsers },
    { label: 'Stagiaires', value: stats?.intern_count ?? 0, icon: IconGraduate },
    { label: 'Départements', value: stats?.department_count ?? 0, icon: IconBuilding },
    { label: 'En attente', value: stats?.applications_pending ?? 0, icon: IconClipboard },
    { label: 'Approuvées', value: stats?.applications_approved ?? 0, icon: IconClipboard },
    { label: 'Refusées', value: stats?.applications_rejected ?? 0, icon: IconClipboard },
    { label: 'Stagiaires actifs', value: stats?.active_interns ?? 0, icon: IconGraduate },
  ];

  const actionLabels = {
    login: 'Connexion', logout: 'Déconnexion', create: 'Création', update: 'Modification',
    delete: 'Suppression', approve: 'Approbation', reject: 'Rejet', generate: 'Génération', scan: 'Scan QR',
  };

  const actionColors = {
    login: 'blue', logout: 'purple', create: 'green', update: 'amber',
    delete: 'red', approve: 'green', reject: 'red', generate: 'blue', scan: 'purple',
  };

  return (
    <div>
      <PageHeader title="Tableau de bord" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="icon-box">
                <card.icon />
              </div>
            </div>
            <p className="text-2xl font-bold text-ocp-800">{card.value}</p>
            <p className="text-xs text-ocp-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="text-sm font-semibold text-ocp-800">Activité récente</h2>
        </div>
        {stats?.recent_audit_logs?.length > 0 ? (
          <Table>
            <Table.Head>
              <Table.Header>Utilisateur</Table.Header>
              <Table.Header>Action</Table.Header>
              <Table.Header>Module</Table.Header>
              <Table.Header>Date</Table.Header>
            </Table.Head>
            <Table.Body>
              {stats.recent_audit_logs.map((log) => (
                <Table.Row key={log.id}>
                  <Table.Cell className="font-medium text-ocp-800">{log.user}</Table.Cell>
                  <Table.Cell>
                    <Badge color={actionColors[log.action] || 'slate'}>
                      {actionLabels[log.action] || log.action}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="text-ocp-500">{log.model_type}</Table.Cell>
                  <Table.Cell className="text-ocp-500 whitespace-nowrap">{log.created_at}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <div className="p-12 text-center text-ocp-400 text-sm">Aucune activité récente</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
