import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Loading from '../../components/ui/Loading';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', localisation: '' });
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState({});
  const initialized = useRef(false);

  const fetchDepartments = () => {
    setLoading(true);
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    api.get(`/departments${params}`)
      .then((res) => setDepartments(res.data.departments || res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { const t = setTimeout(fetchDepartments, 300); return () => clearTimeout(t); }, [search]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const count = Math.max(departments.length, 4);
    for (let i = 0; i < count + 2; i++) {
      setTimeout(() => setVisible((v) => ({ ...v, [i]: true })), 60 + i * 60);
    }
  }, [departments.length]);

  const openCreate = () => { setEditItem(null); setForm({ name: '', description: '', localisation: '' }); setModalOpen(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ name: item.name, description: item.description || '', localisation: item.localisation || '' }); setModalOpen(true); };

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

  const fadeCls = (id) =>
    `transition-all duration-600 ease-out ${visible[id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`;

  return (
    <div>
      {/* Header */}
      <div className={fadeCls(0)}>
        <h1 className="font-cooper-medium text-3xl sm:text-4xl text-ocp-700 tracking-tight">Départements</h1>
        <p className="text-gray-500 text-sm mt-1">Gestion des départements de l'organisation</p>
      </div>

      {/* Search + Create */}
      <div className={`flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mt-8 mb-6 ${fadeCls(1)}`}>
        <div className="flex items-center gap-2 bg-ocp-50 px-3.5 py-2 rounded-full border border-transparent focus-within:border-ocp-500 focus-within:bg-white transition-all w-full sm:w-auto">
          <i className="fas fa-search text-gray-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom..."
            className="border-none bg-transparent outline-none text-sm py-0.5 w-full sm:w-64 placeholder:text-gray-400 text-ocp-700"
          />
        </div>
        <Button onClick={openCreate} className="shrink-0">
          <i className="fas fa-plus mr-1.5 text-sm" /> Nouveau département
        </Button>
      </div>

      {/* Cards Grid */}
      {loading ? <Loading /> : (
        departments.length === 0 ? (
          <div className={`bg-white border border-ocp-500/5 rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.04)] py-16 text-center text-gray-400 text-sm ${fadeCls(2)}`}>
            Aucun département trouvé
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept, i) => (
              <div
                key={dept.id}
                className={`bg-white border border-ocp-500/5 rounded-[20px] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(2,66,29,0.08)] hover:border-ocp-500/10 ${fadeCls(i + 2)}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-ocp-500 to-ocp-700 flex items-center justify-center text-white text-lg shadow-sm">
                    <i className="fas fa-building" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-ocp-700">{dept.name}</h3>
                    {dept.users_count !== undefined && (
                      <p className="text-[0.7rem] text-gray-500 mt-0.5">
                        <i className="fas fa-users mr-1" />{dept.users_count} membre{dept.users_count > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
                {dept.description && <p className="text-sm text-gray-500 mb-2 line-clamp-2">{dept.description}</p>}
                {dept.localisation && (
                  <p className="text-xs text-gray-400 mb-4 flex items-center gap-1.5">
                    <i className="fas fa-map-marker-alt text-ocp-400" /> {dept.localisation}
                  </p>
                )}
                <div className="flex gap-3 pt-3 border-t border-gray-100">
                  <button onClick={() => openEdit(dept)} className="text-sm font-medium text-ocp-500 hover:text-ocp-700 transition-colors">
                    <i className="fas fa-edit mr-1" /> Modifier
                  </button>
                  <button onClick={() => handleDelete(dept.id)} className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors">
                    <i className="fas fa-trash-alt mr-1" /> Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Modifier le département' : 'Nouveau département'}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ocp-700 mb-1.5">Nom</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-ocp-200 text-sm bg-ocp-50 outline-none focus:border-ocp-500 focus:bg-white focus:ring-3 focus:ring-ocp-500/15 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ocp-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
              className="w-full px-4 py-3 rounded-xl border border-ocp-200 text-sm bg-ocp-50 outline-none focus:border-ocp-500 focus:bg-white focus:ring-3 focus:ring-ocp-500/15 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ocp-700 mb-1.5">Localisation</label>
            <input type="text" value={form.localisation} onChange={(e) => setForm({ ...form, localisation: e.target.value })}
              placeholder="Ex: Siège OCP, Rabat"
              className="w-full px-4 py-3 rounded-xl border border-ocp-200 text-sm bg-ocp-50 outline-none focus:border-ocp-500 focus:bg-white focus:ring-3 focus:ring-ocp-500/15 transition-all" />
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
