import { useState, useEffect } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import Loading from '../../components/ui/Loading';

const Interns = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/interns')
      .then((res) => setInterns(res.data?.data || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <PageHeader title="Mes stagiaires" />

      {interns.length === 0 ? (
        <div className="bg-white border border-ocp-100 rounded-xl p-12 text-center text-ocp-400 text-sm">
          Aucun stagiaire assigné pour le moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {interns.map((intern) => (
            <div key={intern.id} className="page-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-ocp-500 font-semibold text-sm">
                    {intern.user?.nom?.[0]}{intern.user?.prenom?.[0]}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-ocp-800 truncate">
                    {intern.user?.nom} {intern.user?.prenom}
                  </h3>
                  <p className="text-xs text-ocp-500 truncate">{intern.user?.email}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm border-t border-ocp-50 pt-3">
                <div className="flex justify-between">
                  <span className="text-ocp-500">CIN</span>
                  <span className="text-ocp-800 font-medium">{intern.user?.cin || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ocp-500">Téléphone</span>
                  <span className="text-ocp-800">{intern.user?.telephone || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ocp-500">Département</span>
                  <span className="text-ocp-800">{intern.department?.name || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ocp-500">Période</span>
                  <span className="text-ocp-800 text-xs">
                    {intern.date_debut ? new Date(intern.date_debut).toLocaleDateString('fr-FR') : '—'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Interns;


