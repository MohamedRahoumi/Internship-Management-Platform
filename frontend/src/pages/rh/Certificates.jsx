import { useState, useEffect } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Badge, { statusBadge } from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import Alert from '../../components/ui/Alert';

const Certificates = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(null);
  const [message, setMessage] = useState('');

  const fetchInterns = () => {
    setLoading(true);
    api.get('/interns')
      .then((res) => setInterns(res.data?.data || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchInterns(); }, []);

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

  return (
    <div>
      <PageHeader title="Attestations" />

      <Alert type="success">{message}</Alert>

      {interns.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-md p-12 text-center text-slate-400 text-sm">
          Aucun stagiaire pour le moment.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
          <Table>
            <Table.Head>
              <Table.Header>Stagiaire</Table.Header>
              <Table.Header>Période</Table.Header>
              <Table.Header>Statut</Table.Header>
              <Table.Header>Évaluation</Table.Header>
              <Table.Header>Certificat</Table.Header>
              <Table.Header className="text-right">Action</Table.Header>
            </Table.Head>
            <Table.Body>
              {interns.map((intern) => (
                <Table.Row key={intern.id}>
                  <Table.Cell className="font-medium text-slate-800">{intern.user?.nom} {intern.user?.prenom}</Table.Cell>
                  <Table.Cell className="text-slate-500 whitespace-nowrap">
                    {intern.date_debut ? new Date(intern.date_debut).toLocaleDateString('fr-FR') : '—'}
                    {' → '}
                    {intern.date_fin ? new Date(intern.date_fin).toLocaleDateString('fr-FR') : '—'}
                  </Table.Cell>
                  <Table.Cell>{statusBadge(intern.status).badge}</Table.Cell>
                  <Table.Cell>
                    {intern.evaluation
                      ? <Badge color="green">Complétée</Badge>
                      : <span className="text-slate-400 text-xs">Non évalué</span>}
                  </Table.Cell>
                  <Table.Cell>
                    {intern.certificate
                      ? <Badge color="green">Généré</Badge>
                      : <span className="text-slate-400 text-xs">Non généré</span>}
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    {!intern.certificate && intern.evaluation ? (
                      <Button size="sm" onClick={() => handleGenerate(intern.id)} disabled={generating === intern.id}>
                        {generating === intern.id ? 'Génération...' : 'Générer'}
                      </Button>
                    ) : intern.certificate ? (
                      <span className="text-xs text-slate-400">Déjà généré</span>
                    ) : (
                      <span className="text-xs text-slate-400">Évaluation requise</span>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Certificates;


