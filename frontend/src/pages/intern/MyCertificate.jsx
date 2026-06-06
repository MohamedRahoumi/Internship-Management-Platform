import { useState, useEffect } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import Loading from '../../components/ui/Loading';
import { IconCertificate, IconDownload } from '../../components/ui/Icons';

const MyCertificate = () => {
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/certificates/my-certificate')
      .then((res) => setCertificate(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  if (!certificate) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="bg-white border border-slate-200 rounded-md p-8">
          <div className="w-14 h-14 bg-slate-100 rounded-md flex items-center justify-center mx-auto mb-4">
            <IconCertificate />
          </div>
          <h2 className="text-base font-semibold text-slate-900 mb-1">Pas encore disponible</h2>
          <p className="text-sm text-slate-500">L'attestation de stage sera disponible après validation de votre stage.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <PageHeader title="Mon attestation" />

      <div className="bg-white border border-slate-200 rounded-md p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-md flex items-center justify-center mx-auto text-slate-400">
          <IconCertificate />
        </div>
        <h2 className="text-lg font-semibold text-slate-900">Attestation de stage</h2>
        <p className="text-sm text-slate-500">
          Votre attestation de stage est disponible en téléchargement.
        </p>
        <p className="text-xs text-slate-400">
          N° {certificate.certificate_number}
        </p>
        {certificate.file_url && (
          <a
            href={certificate.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex mx-auto mt-2"
          >
            <IconDownload />
            Télécharger (PDF)
          </a>
        )}
      </div>
    </div>
  );
};

export default MyCertificate;


