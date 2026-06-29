import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import Loading from '../../components/ui/Loading';

const statusLabels = {
  pending: 'En attente',
  approved: 'Approuvée',
  rejected: 'Refusée',
};

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState({});
  const initialized = useRef(false);

  useEffect(() => {
    api.get('/dashboard/rh')
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    for (let i = 0; i < 8; i++) {
      setTimeout(() => setVisible((v) => ({ ...v, [i]: true })), 60 + i * 60);
    }
  }, []);

  if (loading) return <Loading />;

  const cards = [
    { label: 'Candidatures', value: stats?.total_applications ?? (stats?.pending_applications ?? 0) + (stats?.approved_applications ?? 0) + (stats?.rejected_applications ?? 0), icon: 'fa-file-alt', color: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
    { label: 'En attente', value: stats?.pending_applications ?? 0, icon: 'fa-clock', color: 'linear-gradient(135deg, #f59e0b, #d97706)' },
    { label: 'Acceptées', value: stats?.approved_applications ?? 0, icon: 'fa-check-circle', color: 'linear-gradient(135deg, #10b981, #059669)' },
    { label: 'Stagiaires actifs', value: stats?.active_interns ?? 0, icon: 'fa-user-graduate', color: 'linear-gradient(135deg, #00843D, #02421D)' },
  ];

  const fadeCls = (id) =>
    `transition-all duration-600 ease-out ${visible[id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`;

  return (
    <div>
      <div className={fadeCls(0)}>
        <h1 className="font-cooper-medium text-3xl sm:text-4xl text-ocp-700 tracking-tight">Tableau de bord RH</h1>
        <p className="text-gray-500 text-sm mt-1">Gestion des candidatures et des stagiaires</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 mb-8">
        {cards.map((card, i) => (
          <div
            key={card.label}
            className={`bg-white border border-ocp-500/5 rounded-[20px] p-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(2,66,29,0.08)] hover:border-ocp-500/10 ${fadeCls(i + 1)}`}
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

      {/* Recent Applications */}
      <div className={fadeCls(5)}>
        <div className="bg-white border border-ocp-500/5 rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-200 hover:shadow-[0_16px_40px_rgba(2,66,29,0.08)]">
          <div className="flex items-center justify-between px-6 py-[18px] border-b border-gray-200">
            <h2 className="text-base font-semibold text-ocp-700 flex items-center gap-2.5">
              <i className="fas fa-file-alt text-ocp-500" />
              Candidatures récentes
            </h2>
            {stats?.recent_applications?.length > 0 && (
              <span className="bg-ocp-100 text-ocp-500 text-[0.7rem] font-semibold px-3.5 py-1 rounded-full">
                {stats.recent_applications.length} candidatures
              </span>
            )}
          </div>
          {stats?.recent_applications?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Candidat</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Statut</th>
                    <th className="text-right px-5 py-3.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_applications.map((app) => (
                    <tr key={app.id} className="hover:bg-ocp-100 transition-colors">
                      <td className="px-5 py-3.5 border-b border-black/3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ocp-500 to-ocp-700 text-white flex items-center justify-center text-xs font-bold shadow-sm shrink-0">
                            {app.user?.[0] || '?'}
                          </div>
                          <div>
                            <div className="font-semibold text-ocp-700 text-sm">{app.user}</div>
                            <div className="text-[0.7rem] text-gray-500">{app.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 border-b border-black/3">
                        <span className={`inline-block text-[0.7rem] font-semibold px-3 py-0.5 rounded-full ${statusColors[app.status] || 'bg-slate-100 text-slate-600'}`}>
                          {statusLabels[app.status] || app.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 text-right border-b border-black/3 whitespace-nowrap">{app.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-400 text-sm">Aucune candidature récente</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
