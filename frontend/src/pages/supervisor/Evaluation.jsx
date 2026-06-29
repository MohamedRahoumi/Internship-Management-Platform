import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import Loading from '../../components/ui/Loading';

const ratingLevels = [
  { value: 1, label: 'Faible' },
  { value: 2, label: 'Passable' },
  { value: 3, label: 'A.Bien' },
  { value: 4, label: 'Bien' },
  { value: 5, label: 'T.Bien' },
];

const categories = [
  {
    label: 'Compétence Techniques',
    color: 'from-blue-600 to-blue-700',
    criteria: [
      { key: 'connaissance_theoriques', label: 'Connaissance Théoriques' },
      { key: 'connaissance_pratiques', label: 'Connaissance pratiques' },
    ],
  },
  {
    label: 'Discipline',
    color: 'from-amber-600 to-amber-700',
    criteria: [
      { key: 'assiduite', label: 'Assiduité' },
      { key: 'relation_hierarchie', label: 'Relation avec la hiérarchie' },
    ],
  },
  {
    label: 'Comportement',
    color: 'from-emerald-600 to-emerald-700',
    criteria: [
      { key: 'esprit_initiative', label: "Esprit d'initiative" },
      { key: 'dynamisme', label: 'Dynamisme' },
      { key: 'sens_responsabilites', label: 'Sens des responsabilités' },
      { key: 'sens_organisation', label: "Sens de l'organisation" },
    ],
  },
  {
    label: 'Adaptation',
    color: 'from-purple-600 to-purple-700',
    criteria: [
      { key: 'esprit_equipe', label: "Esprit d'équipe" },
      { key: 'adaptabilite', label: 'Adaptabilité' },
      { key: 'habilite', label: 'Habilité' },
      { key: 'motivation_profession', label: 'Motivation et intérêt pour la profession' },
    ],
  },
];

const allKeys = categories.flatMap((c) => c.criteria.map((cr) => cr.key));

const initScores = () => Object.fromEntries(allKeys.map((k) => [k, null]));

const Evaluation = () => {
  const [interns, setInterns] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState('');
  const [scores, setScores] = useState(initScores());
  const [observations, setObservations] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState({});
  const initialized = useRef(false);

  useEffect(() => {
    api.get('/interns')
      .then((res) => setInterns(res.data?.data || res.data || []))
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    for (let i = 0; i < 4; i++) {
      setTimeout(() => setVisible((v) => ({ ...v, [i]: true })), 60 + i * 60);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedIntern) return;
    setLoading(true);
    setSubmitted(false);
    setError('');
    try {
      await api.post(`/evaluations/intern/${selectedIntern}`, { scores, observations, recommandation: 'neutral' });
      setSubmitted(true);
      setSelectedIntern('');
      setObservations('');
      setScores(initScores());
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally { setLoading(false); }
  };

  if (fetching) return <Loading />;

  const fadeCls = (id) =>
    `transition-all duration-600 ease-out ${visible[id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`;

  const allFilled = selectedIntern && allKeys.every((k) => scores[k] !== null);

  return (
    <div>
      <div className={fadeCls(0)}>
        <h1 className="font-cooper-medium text-3xl sm:text-4xl text-ocp-700 tracking-tight">Évaluations</h1>
        <p className="text-gray-500 text-sm mt-1">Grille d'évaluation des stagiaires</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`bg-white border border-ocp-500/5 rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-[0_16px_40px_rgba(2,66,29,0.08)] mt-8 ${fadeCls(1)}`}
      >
        {/* Stagiaire */}
        <div className="p-6 pb-0">
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
                  {intern.user?.prenom} {intern.user?.nom}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grille d'évaluation */}
        {categories.map((cat) => (
          <div key={cat.label} className="px-6 pt-6">
            <div className={`bg-gradient-to-r ${cat.color} rounded-[14px] px-5 py-3 mb-3`}>
              <h3 className="text-white font-semibold text-sm tracking-wide">{cat.label}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left px-3 py-2.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200 min-w-[180px]">
                      Critère
                    </th>
                    {ratingLevels.map((r) => (
                      <th
                        key={r.value}
                        className="text-center px-3 py-2.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200 w-[70px]"
                      >
                        {r.label}
                      </th>
                    ))}
                    <th className="text-center px-3 py-2.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200 w-[100px]">
                      Note
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cat.criteria.map((criterion) => (
                    <tr key={criterion.key} className="hover:bg-ocp-100 transition-colors">
                      <td className="px-3 py-2.5 text-ocp-700 font-medium border-b border-black/3">
                        {criterion.label}
                      </td>
                      {ratingLevels.map((r) => (
                        <td key={r.value} className="text-center px-3 py-2.5 border-b border-black/3">
                          <label className="inline-flex items-center justify-center cursor-pointer">
                            <input
                              type="radio"
                              name={criterion.key}
                              value={r.value}
                              checked={scores[criterion.key] === r.value}
                              onChange={() => setScores((prev) => ({ ...prev, [criterion.key]: r.value }))}
                              className="w-4 h-4 accent-ocp-500 cursor-pointer"
                            />
                          </label>
                        </td>
                      ))}
                      <td className="text-center px-3 py-2.5 border-b border-black/3">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                          scores[criterion.key] ? 'bg-ocp-100 text-ocp-700' : 'bg-gray-100 text-gray-300'
                        }`}>
                          {scores[criterion.key] ?? '—'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* Observations */}
        <div className="p-6">
          <div>
            <label className="label-field">Observations</label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              rows={3}
              className="input-field"
              placeholder="Observations générales sur le stagiaire..."
            />
          </div>
        </div>

        {/* Messages */}
        <div className="px-6 pb-2">
          {error && (
            <div className="flex items-center gap-2 text-sm font-medium px-4 py-3 rounded-[12px] bg-red-100 text-red-700 mb-3">
              <i className="fas fa-exclamation-circle" />
              {error}
            </div>
          )}
          {submitted && (
            <div className="flex items-center gap-2 text-sm font-medium px-4 py-3 rounded-[12px] bg-emerald-100 text-emerald-700 mb-3">
              <i className="fas fa-check-circle" />
              Évaluation enregistrée avec succès.
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="px-6 pb-6">
          <button
            type="submit"
            disabled={loading || !allFilled}
            className="w-full bg-gradient-to-r from-ocp-500 to-ocp-700 text-white font-semibold py-2.5 rounded-[12px] text-sm transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin" />
                Envoi...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane" />
                Soumettre l'évaluation
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Evaluation;


