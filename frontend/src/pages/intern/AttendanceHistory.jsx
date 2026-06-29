import { useState, useEffect } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import Table from '../../components/ui/Table';
import { statusBadge } from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';

const AttendanceHistory = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/attendances/my-attendance')
      .then((res) => setAttendance(res.data.attendance || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <PageHeader title="Mes présences" />

      {attendance.length === 0 ? (
        <div className="bg-white border border-ocp-100 rounded-xl p-12 text-center">
          <p className="text-sm text-ocp-400">Aucune présence enregistrée pour le moment.</p>
        </div>
      ) : (
        <div className="bg-white border border-ocp-100 rounded-xl overflow-hidden">
          <Table>
            <Table.Head>
              <Table.Header>Date</Table.Header>
              <Table.Header>Heure d'arrivée</Table.Header>
              <Table.Header>Heure de départ</Table.Header>
              <Table.Header>Statut</Table.Header>
            </Table.Head>
            <Table.Body>
              {attendance.map((entry) => (
                <Table.Row key={entry.id}>
                  <Table.Cell className="font-medium text-ocp-800">
                    {entry.date ? new Date(entry.date).toLocaleDateString('fr-FR') : '—'}
                  </Table.Cell>
                  <Table.Cell className="text-ocp-500">
                    {entry.check_in_at ? new Date(entry.check_in_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '—'}
                  </Table.Cell>
                  <Table.Cell className="text-ocp-500">
                    {entry.check_out_at ? new Date(entry.check_out_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '—'}
                  </Table.Cell>
                  <Table.Cell>{statusBadge(entry.status).badge}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AttendanceHistory;


