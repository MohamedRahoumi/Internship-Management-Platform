import { useState, useEffect } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import Loading from '../../components/ui/Loading';
import { IconClipboard, IconGraduate } from '../../components/ui/Icons';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/rh')
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const cards = [
    { label: 'Candidatures', value: stats?.total_applications ?? 0, icon: IconClipboard },
    { label: 'En attente', value: stats?.pending_applications ?? 0, icon: IconClipboard },
    { label: 'Acceptées', value: stats?.accepted_applications ?? 0, icon: IconClipboard },
    { label: 'Stagiaires actifs', value: stats?.active_interns ?? 0, icon: IconGraduate },
  ];

  return (
    <div>
      <PageHeader title="Tableau de bord RH" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white border border-slate-200 rounded-md p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-slate-100 rounded-md flex items-center justify-center text-slate-500">
                <card.icon />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;


