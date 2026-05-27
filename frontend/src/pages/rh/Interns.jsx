import { useState, useEffect } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import Table from '../../components/ui/Table';
import { statusBadge } from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';

const Interns = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/interns')
      .then((res) => setInterns(res.data?.data || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <PageHeader title="Stagiaires" />

      {interns.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-md p-12 text-center text-slate-400 text-sm">
          Aucun stagiaire pour le moment.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
          <Table>
            <Table.Head>
              <Table.Header>Stagiaire</Table.Header>
              <Table.Header>CIN</Table.Header>
              <Table.Header>Email</Table.Header>
              <Table.Header>Département</Table.Header>
              <Table.Header>Superviseur</Table.Header>
              <Table.Header>Période</Table.Header>
              <Table.Header>Statut</Table.Header>
            </Table.Head>
            <Table.Body>
              {interns.map((intern) => (
                <Table.Row key={intern.id}>
                  <Table.Cell className="font-medium text-slate-800">{intern.user?.nom} {intern.user?.prenom}</Table.Cell>
                  <Table.Cell className="text-slate-500">{intern.user?.cin || '—'}</Table.Cell>
                  <Table.Cell className="text-slate-500">{intern.user?.email}</Table.Cell>
                  <Table.Cell className="text-slate-600">{intern.department?.name || '—'}</Table.Cell>
                  <Table.Cell className="text-slate-600">{intern.supervisor ? `${intern.supervisor.nom} ${intern.supervisor.prenom}` : '—'}</Table.Cell>
                  <Table.Cell className="text-slate-500 whitespace-nowrap">
                    {intern.date_debut ? new Date(intern.date_debut).toLocaleDateString('fr-FR') : '—'}
                    {' → '}
                    {intern.date_fin ? new Date(intern.date_fin).toLocaleDateString('fr-FR') : '—'}
                  </Table.Cell>
                  <Table.Cell>{statusBadge(intern.status).badge}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Interns;


