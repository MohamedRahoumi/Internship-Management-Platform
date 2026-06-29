import { useState, useEffect } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import Loading from '../../components/ui/Loading';
import { statusBadge } from '../../components/ui/Badge';

const criteriaLabels = {
  connaissance_theoriques: 'Connaissance Théoriques',
  connaissance_pratiques: 'Connaissance pratiques',
  assiduite: 'Assiduité',
  relation_hierarchie: 'Relation avec la hiérarchie',
  esprit_initiative: "Esprit d'initiative",
  dynamisme: 'Dynamisme',
  sens_responsabilites: 'Sens des responsabilités',
  sens_organisation: "Sens de l'organisation",
  esprit_equipe: "Esprit d'équipe",
  adaptabilite: 'Adaptabilité',
  habilite: 'Habilité',
  motivation_profession: 'Motivation et intérêt pour la profession',
};

const noteLabels = { 1: 'Faible', 2: 'Passable', 3: 'A.Bien', 4: 'Bien', 5: 'T.Bien' };
const noteColors = { 1: 'bg-red-500', 2: 'bg-amber-500', 3: 'bg-blue-500', 4: 'bg-emerald-500', 5: 'bg-green-600' };

const MyEvaluation = () => {
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/evaluations/my-evaluation')
      .then((res) => setEvaluation(res.data.evaluation || res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  if (!evaluation) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="bg-white border border-ocp-100 rounded-xl p-8">
          <div className="w-14 h-14 bg-ocp-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-ocp-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
          </div>
          <h2 className="text-base font-semibold text-ocp-800 mb-1">Pas encore évalué</h2>
          <p className="text-sm text-ocp-500">Votre évaluation n'est pas encore disponible.</p>
        </div>
      </div>
    );
  }

  const scores = evaluation.scores || {};
  const maxScore = 5;

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Mon évaluation" />

      <div className="bg-white border border-ocp-100 rounded-xl p-6 space-y-5">
        {/* Note finale */}
        <div className="text-center pb-4 border-b border-ocp-100">
          <span className="text-4xl font-bold text-ocp-700">{evaluation.note_finale}</span>
          <span className="text-gray-400 text-sm ml-1">/ 5</span>
          <p className="text-xs text-gray-500 mt-1">Note finale</p>
        </div>

        {Object.entries(criteriaLabels).map(([key, label]) => {
          const value = scores[key] || 0;
          const color = noteColors[value] || 'bg-gray-300';
          return (
            <div key={key}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm font-medium text-ocp-700">{label}</span>
                <span className="flex items-center gap-1.5">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${color}`}>
                    {value}
                  </span>
                  <span className="text-xs text-gray-400">/5</span>
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all ${color}`} style={{ width: `${(value / maxScore) * 100}%` }} />
              </div>
            </div>
          );
        })}

        {evaluation.observations && (
          <div className="pt-4 border-t border-ocp-100">
            <h3 className="text-xs font-semibold text-ocp-500 uppercase tracking-wider mb-2">Observations</h3>
            <p className="text-sm text-ocp-700 bg-ocp-50 rounded-xl p-3 border border-ocp-100">{evaluation.observations}</p>
          </div>
        )}

        {evaluation.recommandation && (
          <div className="pt-4 border-t border-ocp-100">
            <h3 className="text-xs font-semibold text-ocp-500 uppercase tracking-wider mb-2">Recommandation</h3>
            <div>{statusBadge(evaluation.recommandation).badge}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvaluation;


