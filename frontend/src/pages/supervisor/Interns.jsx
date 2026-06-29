import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import { statusBadge } from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';

const badgeMap = {
  amber: 'bg-amber-100 text-amber-700',
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-emerald-100 text-emerald-700',
  red: 'bg-red-100 text-red-700',
  slate: 'bg-slate-100 text-slate-600',
  teal: 'bg-teal-100 text-teal-700',
  purple: 'bg-purple-100 text-purple-700',
};

const Interns = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState({});
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [attendances, setAttendances] = useState([]);
  const [loadingAtt, setLoadingAtt] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    api.get('/interns')
      .then((res) => setInterns(res.data?.data || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    for (let i = 0; i < 4; i++) {
      setTimeout(() => setVisible((v) => ({ ...v, [i]: true })), 60 + i * 60);
    }
  }, []);

  const viewAttendance = async (intern) => {
    setSelectedIntern(intern);
    setLoadingAtt(true);
    setAttendances([]);
    try {
      const res = await api.get(`/attendances/intern/${intern.id}`);
      setAttendances(res.data?.data || res.data || []);
    } catch {
      setAttendances([]);
    } finally {
      setLoadingAtt(false);
    }
  };

  if (loading) return <Loading />;

  const fadeCls = (id) =>
    `transition-all duration-600 ease-out ${visible[id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`;

  return (
    <div>
      {/* Attendance Modal */}
      {selectedIntern && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelectedIntern(null)}>
          <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-ocp-700">
                Présences — {selectedIntern.user?.prenom} {selectedIntern.user?.nom}
              </h2>
              <button onClick={() => setSelectedIntern(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <i className="fas fa-times text-lg" />
              </button>
            </div>
            <div className="overflow-y-auto p-6">
              {loadingAtt ? (
                <div className="flex items-center justify-center py-12">
                  <i className="fas fa-spinner fa-spin text-ocp-500 text-xl" />
                </div>
              ) : attendances.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">Aucune présence enregistrée.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left px-3 py-2 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Date</th>
                      <th className="text-left px-3 py-2 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Arrivée</th>
                      <th className="text-left px-3 py-2 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Départ</th>
                      <th className="text-left px-3 py-2 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendances.map((a) => (
                      <tr key={a.id} className="hover:bg-ocp-100 transition-colors">
                        <td className="px-3 py-2.5 border-b border-black/3 font-medium text-ocp-700">
                          {a.date ? new Date(a.date).toLocaleDateString('fr-FR') : '—'}
                        </td>
                        <td className="px-3 py-2.5 border-b border-black/3 text-ocp-500">
                          {a.check_in_at ? new Date(a.check_in_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '—'}
                        </td>
                        <td className="px-3 py-2.5 border-b border-black/3 text-ocp-500">
                          {a.check_out_at ? new Date(a.check_out_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '—'}
                        </td>
                        <td className="px-3 py-2.5 border-b border-black/3">
                          {statusBadge(a.status).badge}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={fadeCls(0)}>
        <h1 className="font-cooper-medium text-3xl sm:text-4xl text-ocp-700 tracking-tight">Mes stagiaires</h1>
        <p className="text-gray-500 text-sm mt-1">Liste des stagiaires sous votre supervision</p>
      </div>

      {interns.length === 0 ? (
        <div className={`bg-white border border-ocp-500/5 rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.04)] py-16 text-center text-gray-400 text-sm mt-8 ${fadeCls(1)}`}>
          Aucun stagiaire assigné pour le moment.
        </div>
      ) : (
        <div className={`bg-white border border-ocp-500/5 rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-200 hover:shadow-[0_16px_40px_rgba(2,66,29,0.08)] mt-8 ${fadeCls(1)}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Stagiaire</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">CIN</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Département</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Période</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Statut</th>
                  <th className="text-right px-5 py-3.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {interns.map((intern) => {
                  const sb = statusBadge(intern.status);
                  const initial = (intern.user?.prenom?.[0] || intern.user?.nom?.[0] || '?').toUpperCase();
                  return (
                    <tr key={intern.id} className="hover:bg-ocp-100 transition-colors">
                      <td className="px-5 py-3.5 border-b border-black/3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ocp-500 to-ocp-700 text-white flex items-center justify-center text-xs font-bold shadow-sm shrink-0">
                            {initial}
                          </div>
                          <div>
                            <div className="font-semibold text-ocp-700 text-sm">{intern.user?.prenom} {intern.user?.nom}</div>
                            <div className="text-[0.7rem] text-gray-500">{intern.user?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 border-b border-black/3">{intern.user?.cin || '—'}</td>
                      <td className="px-5 py-3.5 text-gray-600 border-b border-black/3">{intern.department?.name || '—'}</td>
                      <td className="px-5 py-3.5 text-gray-500 border-b border-black/3 whitespace-nowrap">
                        {intern.date_debut ? new Date(intern.date_debut).toLocaleDateString('fr-FR') : '—'}
                        {' → '}
                        {intern.date_fin ? new Date(intern.date_fin).toLocaleDateString('fr-FR') : '—'}
                      </td>
                      <td className="px-5 py-3.5 border-b border-black/3">
                        <span className={`inline-block text-[0.7rem] font-semibold px-3 py-0.5 rounded-full ${badgeMap[sb.color] || badgeMap.slate}`}>
                          {sb.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 border-b border-black/3 text-right">
                        <button onClick={() => viewAttendance(intern)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-ocp-600 hover:bg-ocp-50 hover:border-ocp-200 transition-all">
                          <i className="fas fa-calendar-check" /> Présences
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Interns;


