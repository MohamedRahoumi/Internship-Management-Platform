import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import Loading from '../../components/ui/Loading';


const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState({});
  const initialized = useRef(false);

  useEffect(() => {
    api.get('/dashboard/admin')
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
    { label: 'RH', value: stats?.rh_count ?? 0, icon: 'fa-users', color: 'linear-gradient(135deg, #10b981, #059669)' },
    { label: 'Encadrants', value: stats?.supervisor_count ?? 0, icon: 'fa-user-tie', color: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
    { label: 'Stagiaires', value: stats?.intern_count ?? 0, icon: 'fa-graduation-cap', color: 'linear-gradient(135deg, #00843D, #02421D)' },
    { label: 'Départements', value: stats?.department_count ?? 0, icon: 'fa-building', color: 'linear-gradient(135deg, #f59e0b, #d97706)' },
    { label: 'En attente', value: stats?.applications_pending ?? 0, icon: 'fa-clock', color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
    { label: 'Approuvées', value: stats?.applications_approved ?? 0, icon: 'fa-check-circle', color: 'linear-gradient(135deg, #10b981, #059669)' },
    { label: 'Refusées', value: stats?.applications_rejected ?? 0, icon: 'fa-times-circle', color: 'linear-gradient(135deg, #ef4444, #dc2626)' },
    { label: 'Stagiaires actifs', value: stats?.active_interns ?? 0, icon: 'fa-user-check', color: 'linear-gradient(135deg, #00843D, #02421D)' },
  ];

  const actionLabels = {
    login: 'Connexion', logout: 'Déconnexion', create: 'Création', update: 'Modification',
    delete: 'Suppression', approve: 'Approbation', reject: 'Rejet', generate: 'Génération', scan: 'Scan QR',
  };

  const actionColors = {
    login: 'blue', logout: 'purple', create: 'green', update: 'amber',
    delete: 'red', approve: 'green', reject: 'red', generate: 'blue', scan: 'purple',
  };

  const badgeColors = {
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    green: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
    slate: 'bg-slate-100 text-slate-600',
  };

  const modelLabels = {
    User: 'Utilisateur', InternshipApplication: 'Candidature', Intern: 'Stagiaire',
    Attendance: 'Présence', InternshipReport: 'Rapport', Evaluation: 'Évaluation',
    Certificate: 'Attestation', Department: 'Département',
  };

  return (
    <div>
      {/* Header */}
      <div
        className={`transition-all duration-600 ease-out ${
          visible[0] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
      >
        <h1 className="font-cooper-medium text-3xl sm:text-4xl text-ocp-700 tracking-tight">Tableau de bord</h1>
        <p className="text-gray-500 text-sm mt-1">Vue d'ensemble de la plateforme de gestion des stages OCP</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 mb-8">
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

      {/* Activity Section */}
      <div
        className={`bg-white border border-ocp-500/5 rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-200 hover:shadow-[0_16px_40px_rgba(2,66,29,0.08)] ${
          visible[9] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
        style={{ transitionDelay: '0s', transitionProperty: 'all', transitionDuration: '0.6s', transitionTimingFunction: 'ease-out' }}
      >
        <div className="flex items-center justify-between px-6 py-[18px] border-b border-gray-200">
          <h2 className="text-base font-semibold text-ocp-700 flex items-center gap-2.5">
            <i className="fas fa-history text-ocp-500" />
            Activité récente
          </h2>
          {stats?.recent_audit_logs?.length > 0 && (
            <span className="bg-ocp-100 text-ocp-500 text-[0.7rem] font-semibold px-3.5 py-1 rounded-full">
              {stats.recent_audit_logs.length} événements
            </span>
          )}
        </div>
        <div className="p-1.5 sm:p-4 overflow-x-auto">
          {stats?.recent_audit_logs?.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left px-3 py-3 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Utilisateur</th>
                  <th className="text-left px-3 py-3 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Action</th>
                  <th className="text-left px-3 py-3 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Module</th>
                  <th className="text-left px-3 py-3 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_audit_logs.map((log) => (
                  <tr key={log.id} className="hover:bg-ocp-100 transition-colors">
                    <td className="px-3 py-3 font-semibold text-ocp-700 border-b border-black/3">{log.user}</td>
                    <td className="px-3 py-3 border-b border-black/3">
                      <span className={`inline-block text-[0.7rem] font-semibold px-3 py-0.5 rounded-full ${badgeColors[actionColors[log.action]] || badgeColors.slate}`}>
                        {actionLabels[log.action] || log.action}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-gray-500 border-b border-black/3">{modelLabels[log.model_type?.split('\\').pop()] || log.model_type?.split('\\').pop() || '—'}</td>
                    <td className="px-3 py-3 text-gray-500 whitespace-nowrap border-b border-black/3">{log.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-gray-400 text-sm">Aucune activité récente</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
