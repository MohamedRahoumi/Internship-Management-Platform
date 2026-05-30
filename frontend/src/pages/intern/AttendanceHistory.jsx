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
    api.get('/intern/attendance')
      .then((res) => setAttendance(res.data.attendance || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <PageHeader title="Mes présences" />

      {attendance.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-md p-12 text-center">
          <p className="text-sm text-slate-400">Aucune présence enregistrée pour le moment.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
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
                  <Table.Cell className="font-medium text-slate-800">
                    {entry.date ? new Date(entry.date).toLocaleDateString('fr-FR') : '—'}
                  </Table.Cell>
                  <Table.Cell className="text-slate-500">
                    {entry.check_in ? new Date(entry.check_in).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '—'}
                  </Table.Cell>
                  <Table.Cell className="text-slate-500">
                    {entry.check_out ? new Date(entry.check_out).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '—'}
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


