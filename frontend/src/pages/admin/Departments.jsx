import { useState, useEffect } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Loading from '../../components/ui/Loading';
import SearchInput from '../../components/ui/SearchInput';
import { IconBuilding } from '../../components/ui/Icons';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [search, setSearch] = useState('');

  const fetchDepartments = () => {
    setLoading(true);
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    api.get(`/departments${params}`)
      .then((res) => setDepartments(res.data.departments || res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { const t = setTimeout(fetchDepartments, 300); return () => clearTimeout(t); }, [search]);

  const openCreate = () => { setEditItem(null); setForm({ name: '', description: '' }); setModalOpen(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ name: item.name, description: item.description || '' }); setModalOpen(true); };

  const handleSave = async () => {
    try {
      if (editItem) { await api.put(`/departments/${editItem.id}`, form); }
      else { await api.post('/departments', form); }
      setModalOpen(false); fetchDepartments();
    } catch (_) {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Confirmer la suppression ?')) return;
    try { await api.delete(`/departments/${id}`); fetchDepartments(); } catch (_) {}
  };

  return (
    <div>
      <PageHeader title="Départements">
        <Button onClick={openCreate}>+ Nouveau département</Button>
      </PageHeader>

      <div className="bg-white border border-slate-200 rounded-md p-4 mb-6">
        <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher par nom..." className="max-w-md" />
      </div>

      {loading ? <Loading /> : (
        departments.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-md p-12 text-center text-slate-400 text-sm">
            Aucun département trouvé
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => (
              <div key={dept.id} className="bg-white border border-slate-200 rounded-md p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-md flex items-center justify-center text-slate-500">
                      <IconBuilding />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">{dept.name}</h3>
                      {dept.users_count !== undefined && (
                        <p className="text-xs text-slate-400">{dept.users_count} membre{dept.users_count > 1 ? 's' : ''}</p>
                      )}
                    </div>
                  </div>
                </div>
                {dept.description && <p className="text-sm text-slate-500 mb-4">{dept.description}</p>}
                <div className="flex gap-3 pt-3 border-t border-slate-100">
                  <button onClick={() => openEdit(dept)} className="text-sm font-medium text-blue-700 hover:text-blue-800">Modifier</button>
                  <button onClick={() => handleDelete(dept.id)} className="text-sm font-medium text-red-700 hover:text-red-800">Supprimer</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Modifier le département' : 'Nouveau département'}>
        <div className="space-y-4">
          <div>
            <label className="label-field">Nom</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="label-field">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-field" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button onClick={handleSave}>{editItem ? 'Enregistrer' : 'Créer'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Departments;


