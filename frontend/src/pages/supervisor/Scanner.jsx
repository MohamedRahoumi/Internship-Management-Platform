import { useState } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { IconQrCode } from '../../components/ui/Icons';

const Scanner = () => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!token.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await api.post('/attendance/scan', { token: token.trim() });
      setResult({ type: 'success', message: res.data.message || 'Présence enregistrée' });
      setToken('');
    } catch (err) {
      setResult({ type: 'error', message: err.response?.data?.message || 'Erreur lors du scan' });
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-lg mx-auto">
      <PageHeader title="Scanner de présence" />

      <div className="bg-white border border-ocp-100 rounded-xl p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-ocp-50 rounded-md flex items-center justify-center text-ocp-400 mb-3">
            <IconQrCode />
          </div>
          <p className="text-sm text-ocp-500 text-center">
            Saisissez le token QR du stagiaire pour enregistrer sa présence
          </p>
        </div>

        <form onSubmit={handleScan} className="space-y-4">
          <div>
            <label className="label-field">Token du stagiaire</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Coller le token ici..."
              className="input-field text-center text-base font-mono tracking-wider"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !token.trim()}
            className="w-full justify-center"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer la présence'}
          </Button>
        </form>

        <Alert type={result?.type === 'success' ? 'success' : 'error'} className="mt-6">
          {result?.message}
        </Alert>
      </div>
    </div>
  );
};

export default Scanner;


