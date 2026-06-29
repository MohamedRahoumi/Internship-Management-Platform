import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Loading from '../../components/ui/Loading';
import Alert from '../../components/ui/Alert';

const statusLabels = { submitted: 'Soumis', under_review: 'En cours', approved: 'Approuvé', rejected: 'Refusé' };
const statusColors = { submitted: 'bg-yellow-100 text-yellow-800', under_review: 'bg-blue-100 text-blue-800', approved: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800' };

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState({});
  const initialized = useRef(false);

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/supervisor'),
      api.get('/reports/supervisor/all'),
    ])
      .then(([s, r]) => {
        setStats(s.data);
        setReports(r.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const ids = [...Array(10).keys()];
    ids.forEach((id, i) => {
      setTimeout(() => setVisible((v) => ({ ...v, [id]: true })), 60 + i * 60);
    });
  }, []);

  if (loading) return <Loading />;

  const cards = [
    { label: 'Mes stagiaires', value: stats?.my_interns_count ?? 0, icon: 'fa-users', color: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
    { label: 'Stagiaires actifs', value: stats?.active_interns ?? 0, icon: 'fa-user-check', color: 'linear-gradient(135deg, #00843D, #02421D)' },
    { label: 'Présences', value: stats?.total_attendances ?? 0, icon: 'fa-calendar-check', color: 'linear-gradient(135deg, #10b981, #059669)' },
    { label: 'Rapports soumis', value: stats?.reports_submitted ?? 0, icon: 'fa-file-alt', color: 'linear-gradient(135deg, #f59e0b, #d97706)' },
    { label: 'Évaluations', value: stats?.evaluations_done ?? 0, icon: 'fa-star', color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
  ];

  return (
    <div>
      {/* Header */}
      <div
        className={`transition-all duration-600 ease-out ${
          visible[0] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
      >
        <h1 className="font-cooper-medium text-3xl sm:text-4xl text-ocp-700 tracking-tight">Tableau de bord</h1>
        <p className="text-gray-500 text-sm mt-1">Vue d'ensemble de vos stagiaires et activités</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-8 mb-8">
        {cards.map((card, i) => (
          <div
            key={card.label}
            className={`bg-white border border-ocp-500/5 rounded-[20px] p-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(2,66,29,0.08)] hover:border-ocp-500/10 ${
              visible[i + 1] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
            style={{ transitionDelay: '0s', transitionProperty: 'all', transitionDuration: '0.6s', transitionTimingFunction: 'ease-out' }}
          >
            <div
              className="w-11 h-11 rounded-[14px] flex items-center justify-center mb-3 text-white text-lg"
              style={{ background: card.color }}
            >
              <i className={`fas ${card.icon}`} />
            </div>
            <div className="font-cooper-medium text-[1.8rem] font-bold text-ocp-700 leading-tight">{card.value}</div>
            <div className="text-[0.8rem] text-gray-500 font-medium mt-0.5">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Rapports soumis */}
      <div className={`transition-all duration-600 ease-out ${visible[6] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
        <div className="flex items-center justify-between mb-4 mt-2">
          <h2 className="text-lg font-bold text-ocp-700">Rapports soumis par mes stagiaires</h2>
          <Link to="/supervisor/interns" className="text-sm text-ocp-500 font-semibold hover:underline">Voir tous</Link>
        </div>
        {reports.length === 0 ? (
          <Alert type="info">Aucun rapport soumis pour le moment.</Alert>
        ) : (
          <div className="bg-white rounded-[20px] shadow-[0_8px_32px_rgba(0,132,61,0.08)] border border-ocp-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ocp-100 bg-ocp-50/50">
                  <th className="text-left px-5 py-3.5 font-semibold text-ocp-700 text-xs uppercase tracking-wider">Stagiaire</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-ocp-700 text-xs uppercase tracking-wider hidden sm:table-cell">Titre</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-ocp-700 text-xs uppercase tracking-wider hidden md:table-cell">Département</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-ocp-700 text-xs uppercase tracking-wider">Statut</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-ocp-700 text-xs uppercase tracking-wider hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-b border-ocp-50 hover:bg-ocp-50/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-ocp-700">{r.intern?.user?.prenom} {r.intern?.user?.nom}</div>
                      <div className="text-xs text-gray-500 sm:hidden">{r.titre || '—'}</div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 hidden sm:table-cell">{r.titre || '—'}</td>
                    <td className="px-5 py-3.5 text-gray-600 hidden md:table-cell">{r.intern?.department?.name || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status] || 'bg-gray-100 text-gray-700'}`}>
                        {statusLabels[r.status] || r.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 hidden sm:table-cell">{new Date(r.created_at).toLocaleDateString('fr-FR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
