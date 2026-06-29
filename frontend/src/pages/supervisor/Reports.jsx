import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Loading from '../../components/ui/Loading';
import Alert from '../../components/ui/Alert';

const statusLabels = { submitted: 'Soumis', under_review: 'En cours', approved: 'Approuvé', rejected: 'Refusé' };
const statusColors = { submitted: 'bg-yellow-100 text-yellow-800', under_review: 'bg-blue-100 text-blue-800', approved: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800' };

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reports/supervisor/all')
      .then((res) => setReports(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-[14px] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
          <i className="fas fa-file-alt text-white text-lg" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-ocp-800">Rapports soumis</h1>
          <p className="text-sm text-gray-500">Consultez et téléchargez les rapports de vos stagiaires</p>
        </div>
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
                <th className="text-right px-5 py-3.5 font-semibold text-ocp-700 text-xs uppercase tracking-wider">Action</th>
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
                  <td className="px-5 py-3.5 text-right">
                    <a
                      href={r.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-ocp-500 hover:text-ocp-700 transition-colors"
                    >
                      <i className="fas fa-download text-xs" />
                      Télécharger
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reports;
