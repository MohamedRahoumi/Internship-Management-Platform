import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import Loading from '../../components/ui/Loading';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState({});
  const initialized = useRef(false);

  useEffect(() => {
    api.get('/dashboard/supervisor')
      .then((res) => setStats(res.data))
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
    </div>
  );
};

export default Dashboard;
