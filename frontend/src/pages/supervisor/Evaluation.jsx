import { useState, useEffect } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';
import Alert from '../../components/ui/Alert';

const criteria = [
  { key: 'respect_deadlines', label: 'Respect des délais' },
  { key: 'quality_work', label: 'Qualité du travail' },
  { key: 'initiative', label: "Esprit d'initiative" },
  { key: 'teamwork', label: 'Travail en équipe' },
  { key: 'communication', label: 'Communication' },
  { key: 'technical_skills', label: 'Compétences techniques' },
];

const Evaluation = () => {
  const [interns, setInterns] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState('');
  const [scores, setScores] = useState({});
  const [comment, setComment] = useState('');
  const [recommendation, setRecommendation] = useState('neutral');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/interns')
      .then((res) => setInterns(res.data?.data || res.data || []))
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  useEffect(() => {
    setScores(criteria.reduce((acc, c) => { acc[c.key] = 50; return acc; }, {}));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedIntern) return;
    setLoading(true);
    setSubmitted(false);
    setError('');
    try {
      await api.post(`/evaluations/intern/${selectedIntern}`, { scores, comment, recommendation });
      setSubmitted(true);
      setSelectedIntern('');
      setComment('');
      setRecommendation('neutral');
      setScores(criteria.reduce((acc, c) => { acc[c.key] = 50; return acc; }, {}));
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally { setLoading(false); }
  };

  if (fetching) return <Loading />;

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Évaluation de stagiaire" />

      <form onSubmit={handleSubmit} className="bg-white border border-ocp-100 rounded-xl p-6 space-y-5">
        <div>
          <label className="label-field">Stagiaire</label>
          <select
            value={selectedIntern}
            onChange={(e) => setSelectedIntern(e.target.value)}
            className="select-field"
            required
          >
            <option value="">Sélectionner un stagiaire</option>
            {interns.map((intern) => (
              <option key={intern.id} value={intern.id}>
                {intern.user?.nom} {intern.user?.prenom}
              </option>
            ))}
          </select>
        </div>

        {criteria.map((criterion) => (
          <div key={criterion.key}>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-medium text-ocp-700">{criterion.label}</label>
              <span className="text-sm font-bold text-ocp-500">{scores[criterion.key] || 0}/100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={scores[criterion.key] || 50}
              onChange={(e) => setScores({ ...scores, [criterion.key]: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-700"
            />
            <div className="flex justify-between text-xs text-ocp-400">
              <span>0</span>
              <span>100</span>
            </div>
          </div>
        ))}

        <div>
          <label className="label-field">Commentaire</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="input-field"
            placeholder="Commentaires sur le stage..."
          />
        </div>

        <div>
          <label className="label-field">Recommandation</label>
          <select value={recommendation} onChange={(e) => setRecommendation(e.target.value)} className="select-field">
            <option value="positive">Positive</option>
            <option value="neutral">Neutre</option>
            <option value="negative">Négative</option>
          </select>
        </div>

        <Alert type="error">{error}</Alert>
        <Alert type="success">{submitted && 'Évaluation enregistrée avec succès.'}</Alert>

        <Button type="submit" disabled={loading || !selectedIntern} className="w-full justify-center">
          {loading ? 'Envoi...' : "Soumettre l'évaluation"}
        </Button>
      </form>
    </div>
  );
};

export default Evaluation;


