import { useState, useEffect } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import Loading from '../../components/ui/Loading';
import { statusBadge } from '../../components/ui/Badge';

const criteriaLabels = {
  respect_deadlines: 'Respect des délais',
  quality_work: 'Qualité du travail',
  initiative: "Esprit d'initiative",
  teamwork: 'Travail en équipe',
  communication: 'Communication',
  technical_skills: 'Compétences techniques',
};

const MyEvaluation = () => {
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/intern/evaluation')
      .then((res) => setEvaluation(res.data.evaluation || res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  if (!evaluation) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="bg-white border border-slate-200 rounded-md p-8">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
          </div>
          <h2 className="text-base font-semibold text-slate-900 mb-1">Pas encore évalué</h2>
          <p className="text-sm text-slate-500">Votre évaluation n'est pas encore disponible.</p>
        </div>
      </div>
    );
  }

  const scores = evaluation.scores || {};
  const criteriaKeys = Object.keys(criteriaLabels);

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Mon évaluation" />

      <div className="bg-white border border-slate-200 rounded-md p-6 space-y-5">
        {criteriaKeys.map((key) => {
          const value = scores[key] || 0;
          const color = value >= 75 ? 'bg-emerald-500' : value >= 50 ? 'bg-amber-500' : 'bg-red-500';
          return (
            <div key={key}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm font-medium text-slate-700">{criteriaLabels[key]}</span>
                <span className="text-sm font-bold text-slate-800">{value}/100</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full transition-all ${color}`} style={{ width: `${value}%` }} />
              </div>
            </div>
          );
        })}

        {evaluation.comment && (
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Commentaire</h3>
            <p className="text-sm text-slate-700 bg-slate-50 rounded-md p-3 border border-slate-200">{evaluation.comment}</p>
          </div>
        )}

        {evaluation.recommendation && (
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Recommandation</h3>
            <div>{statusBadge(evaluation.recommendation).badge}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvaluation;


