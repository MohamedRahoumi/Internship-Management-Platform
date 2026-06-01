import { useState, useEffect } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';
import Alert from '../../components/ui/Alert';
import { IconUpload } from '../../components/ui/Icons';

const Report = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [existingReport, setExistingReport] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    api.get('/reports/my-report')
      .then((res) => setExistingReport(res.data?.report || res.data))
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('report', file);
      await api.post('/reports', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMessage('Rapport uploadé avec succès.');
      setMessageType('success');
      setFile(null);
      setExistingReport({ uploaded: true });
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur lors de l'upload");
      setMessageType('error');
    } finally { setLoading(false); }
  };

  if (fetching) return <Loading />;

  return (
    <div className="max-w-lg mx-auto">
      <PageHeader title="Mon rapport de stage" />

      <div className="bg-white border border-slate-200 rounded-md p-6">
        {existingReport?.uploaded ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-base font-semibold text-slate-900 mb-1">Rapport déjà soumis</h2>
            <p className="text-sm text-slate-500">Votre rapport a déjà été téléchargé.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-field mb-2">Télécharger votre rapport (PDF)</label>
              <div className="border-2 border-dashed border-slate-300 rounded-md p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => document.getElementById('report-file')?.click()}
              >
                <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} className="hidden" id="report-file" />
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center text-slate-400">
                    <IconUpload />
                  </div>
                  <p className="text-sm text-slate-500">
                    {file ? file.name : 'Cliquez pour sélectionner un fichier PDF'}
                  </p>
                  {file && <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>}
                </div>
              </div>
            </div>

            <Alert type={messageType === 'success' ? 'success' : 'error'}>{message}</Alert>

            <Button type="submit" disabled={loading || !file} className="w-full justify-center">
              {loading ? 'Upload...' : 'Uploader le rapport'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Report;


