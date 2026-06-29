import { useState, useEffect } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import Loading from '../../components/ui/Loading';
import { IconCertificate, IconDownload } from '../../components/ui/Icons';

const MyOffreStage = () => {
  const [offre, setOffre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    api.get('/offres-stage/mine')
      .then((res) => setOffre(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await api.get('/offres-stage/mine/download', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Offre_de_Stage_${offre?.reference || ''}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      // ignore
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <Loading />;

  if (!offre) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="bg-white border border-ocp-100 rounded-xl p-8">
          <div className="w-14 h-14 bg-ocp-50 rounded-xl flex items-center justify-center mx-auto mb-4">
            <IconCertificate />
          </div>
          <h2 className="text-base font-semibold text-ocp-800 mb-1">Pas encore disponible</h2>
          <p className="text-sm text-ocp-500">
            L'offre de stage sera générée automatiquement après l'acceptation de votre candidature.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <PageHeader title="Mon offre de stage" />

      <div className="bg-white border border-ocp-100 rounded-xl p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-ocp-50 rounded-xl flex items-center justify-center mx-auto text-ocp-400">
          <IconCertificate />
        </div>
        <h2 className="text-lg font-semibold text-ocp-800">Offre de stage</h2>
        <p className="text-sm text-ocp-500">
          Votre offre de stage est disponible en téléchargement.
        </p>
        <p className="text-xs text-ocp-400">
          {offre.reference}
        </p>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="btn-primary inline-flex mx-auto mt-2 disabled:opacity-50"
        >
          <IconDownload />
          {downloading ? 'Téléchargement...' : 'Télécharger (PDF)'}
        </button>
      </div>
    </div>
  );
};

export default MyOffreStage;
