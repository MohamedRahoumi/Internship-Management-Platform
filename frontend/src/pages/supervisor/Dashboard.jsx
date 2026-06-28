import { useState, useEffect } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import Loading from '../../components/ui/Loading';
import { IconGraduate, IconCalendar, IconStar } from '../../components/ui/Icons';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/supervisor')
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const cards = [
    { label: 'Mes stagiaires', value: stats?.total_interns ?? 0, icon: IconGraduate },
    { label: "Présences aujourd'hui", value: stats?.today_attendance ?? 0, icon: IconCalendar },
    { label: 'Évaluations', value: stats?.total_evaluations ?? 0, icon: IconStar },
  ];

  return (
    <div>
      <PageHeader title="Tableau de bord Superviseur" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="icon-box">
                <card.icon />
              </div>
            </div>
            <p className="text-2xl font-bold text-ocp-800">{card.value}</p>
            <p className="text-xs text-ocp-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
