import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Loading from '../../components/ui/Loading';

const roleLabels = { administrator: 'Admin', rh: 'RH', supervisor: 'Encadrant', intern: 'Stagiaire' };
const roleColors = { administrator: 'red', rh: 'blue', supervisor: 'amber', intern: 'green' };

const badgeMap = {
  red: 'bg-red-100 text-red-700',
  blue: 'bg-blue-100 text-blue-700',
  amber: 'bg-amber-100 text-amber-700',
  green: 'bg-emerald-100 text-emerald-700',
  slate: 'bg-slate-100 text-slate-600',
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', password: '', role: 'intern', department_id: '' });
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [visible, setVisible] = useState({});
  const initialized = useRef(false);

  const buildParams = () => {
    const p = new URLSearchParams();
    if (search) p.set('search', search);
    if (roleFilter) p.set('role', roleFilter);
    if (deptFilter) p.set('department_id', deptFilter);
    const qs = p.toString();
    return qs ? `?${qs}` : '';
  };

  const fetchUsers = () => {
    setLoading(true);
    api.get(`/users${buildParams()}`)
      .then((res) => setUsers(res.data.users || res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const fetchDepartments = () => {
    api.get('/departments')
      .then((res) => setDepartments(res.data.departments || res.data))
      .catch(() => {});
  };

  useEffect(() => { fetchDepartments(); }, []);

  useEffect(() => { const t = setTimeout(fetchUsers, 300); return () => clearTimeout(t); }, [search, roleFilter, deptFilter]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    [0, 1, 2].forEach((id, i) => setTimeout(() => setVisible((v) => ({ ...v, [id]: true })), 60 + i * 60));
  }, []);

  const openCreate = () => {
    setEditItem(null);
    setForm({ nom: '', prenom: '', email: '', password: '', role: 'intern', department_id: '' });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      nom: item.nom || '',
      prenom: item.prenom || '',
      email: item.email || '',
      password: '',
      role: item.role || 'intern',
      department_id: item.department?.id?.toString() || item.department_id?.toString() || '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      if (!payload.department_id) payload.department_id = null;
      if (editItem) { await api.put(`/users/${editItem.id}`, payload); }
      else { await api.post('/users', payload); }
      setModalOpen(false); fetchUsers();
    } catch (err) {
      console.error('Save error:', err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Confirmer la suppression ?')) return;
    try { await api.delete(`/users/${id}`); fetchUsers(); } catch (_) {}
  };

  const fadeCls = (id) =>
    `transition-all duration-600 ease-out ${visible[id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`;

  return (
    <div>
      {/* Header */}
      <div className={fadeCls(0)}>
        <h1 className="font-cooper-medium text-3xl sm:text-4xl text-ocp-700 tracking-tight">Utilisateurs</h1>
        <p className="text-gray-500 text-sm mt-1">Gestion des comptes de la plateforme</p>
      </div>

      {/* Filters Card */}
      <div className={`bg-white border border-ocp-500/5 rounded-[20px] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.04)] mt-8 mb-6 ${fadeCls(1)}`}>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-ocp-700 mb-1.5">Recherche</label>
            <div className="flex items-center gap-2 bg-ocp-50 px-3.5 py-2 rounded-xl border border-ocp-200 focus-within:border-ocp-500 focus-within:bg-white transition-all">
              <i className="fas fa-search text-gray-400 text-sm" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par nom ou email..."
                className="border-none bg-transparent outline-none text-sm py-0.5 w-full placeholder:text-gray-400 text-ocp-700"
              />
            </div>
          </div>
          <div className="w-full sm:w-44">
            <label className="block text-xs font-semibold text-ocp-700 mb-1.5">Rôle</label>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-[10px] rounded-xl border border-ocp-200 text-sm bg-ocp-50 outline-none focus:border-ocp-500 focus:bg-white focus:ring-3 focus:ring-ocp-500/15 transition-all cursor-pointer">
              <option value="">Tous les rôles</option>
              <option value="administrator">Admin</option>
              <option value="rh">RH</option>
              <option value="supervisor">Encadrant</option>
              <option value="intern">Stagiaire</option>
            </select>
          </div>
          <div className="w-full sm:w-44">
            <label className="block text-xs font-semibold text-ocp-700 mb-1.5">Département</label>
            <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full px-4 py-[10px] rounded-xl border border-ocp-200 text-sm bg-ocp-50 outline-none focus:border-ocp-500 focus:bg-white focus:ring-3 focus:ring-ocp-500/15 transition-all cursor-pointer">
              <option value="">Tous les départements</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <a href={`${api.defaults.baseURL}/export/users${buildParams()}`}
            className="bg-white border border-ocp-200 text-ocp-600 font-semibold py-[10px] px-4 rounded-[12px] text-sm transition-all duration-200 hover:bg-ocp-50 hover:border-ocp-500 flex items-center gap-2 shrink-0"
            download>
            <i className="fas fa-file-excel text-sm" /> Export
          </a>
          <button onClick={openCreate}
            className="bg-gradient-to-r from-ocp-500 to-ocp-700 text-white font-semibold py-[10px] px-5 rounded-[12px] text-sm transition-all duration-200 hover:opacity-90 flex items-center gap-2 shrink-0">
            <i className="fas fa-plus text-sm" /> Nouvel utilisateur
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={`bg-white border border-ocp-500/5 rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-200 hover:shadow-[0_16px_40px_rgba(2,66,29,0.08)] ${fadeCls(2)}`}>
        {loading ? <Loading /> : (
          users.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">Aucun utilisateur trouvé</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Utilisateur</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Rôle</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Département</th>
                    <th className="text-right px-5 py-3.5 font-semibold text-gray-500 text-[0.7rem] uppercase tracking-wider border-b border-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const initial = (user.prenom?.[0] || user.nom?.[0] || user.email?.[0] || '?').toUpperCase();
                    return (
                    <tr key={user.id} className="hover:bg-ocp-100 transition-colors">
                      <td className="px-5 py-3.5 border-b border-black/3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ocp-500 to-ocp-700 text-white flex items-center justify-center text-xs font-bold shadow-sm shrink-0">
                            {initial}
                          </div>
                          <div>
                            <div className="font-semibold text-ocp-700 text-sm">{user.prenom ? `${user.prenom} ${user.nom}` : user.nom || user.email}</div>
                            <div className="text-[0.7rem] text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 border-b border-black/3">
                        <span className={`inline-block text-[0.7rem] font-semibold px-3 py-0.5 rounded-full ${badgeMap[roleColors[user.role]] || badgeMap.slate}`}>
                          {roleLabels[user.role] || user.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 border-b border-black/3">{user.department_name || '-'}</td>
                      <td className="px-5 py-3.5 text-right border-b border-black/3">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => openEdit(user)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-ocp-50 hover:border-ocp-200 transition-all">
                            <i className="fas fa-edit" /> Modifier
                          </button>
                          <button onClick={() => handleDelete(user.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-red-500 hover:bg-red-50 hover:border-red-200 transition-all">
                            <i className="fas fa-trash-alt" /> Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Modifier l'utilisateur" : 'Nouvel utilisateur'}>
        <div className="space-y-4">
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ocp-700 mb-1.5">Nom</label>
                <input type="text" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-ocp-200 text-sm bg-ocp-50 outline-none focus:border-ocp-500 focus:bg-white focus:ring-3 focus:ring-ocp-500/15 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ocp-700 mb-1.5">Prénom</label>
                <input type="text" value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-ocp-200 text-sm bg-ocp-50 outline-none focus:border-ocp-500 focus:bg-white focus:ring-3 focus:ring-ocp-500/15 transition-all" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-ocp-700 mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-ocp-200 text-sm bg-ocp-50 outline-none focus:border-ocp-500 focus:bg-white focus:ring-3 focus:ring-ocp-500/15 transition-all" />
          </div>
          {editItem ? (
            <div>
              <label className="block text-xs font-semibold text-ocp-700 mb-1.5">Nouveau mot de passe (laisser vide pour conserver)</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-ocp-200 text-sm bg-ocp-50 outline-none focus:border-ocp-500 focus:bg-white focus:ring-3 focus:ring-ocp-500/15 transition-all" />
            </div>
          ) : (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-ocp-50 border border-ocp-200">
              <i className="fas fa-envelope text-ocp-500 text-lg" />
              <div>
                <p className="text-sm font-semibold text-ocp-700">Mot de passe généré automatiquement</p>
                <p className="text-xs text-gray-500">Un email sera envoyé avec les identifiants de connexion.</p>
              </div>
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-ocp-700 mb-1.5">Rôle</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-ocp-200 text-sm bg-ocp-50 outline-none focus:border-ocp-500 focus:bg-white focus:ring-3 focus:ring-ocp-500/15 transition-all cursor-pointer">
              <option value="intern">Stagiaire</option>
              <option value="supervisor">Encadrant</option>
              <option value="rh">RH</option>
              <option value="administrator">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-ocp-700 mb-1.5">Département</label>
            <select value={form.department_id} onChange={(e) => setForm({ ...form, department_id: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-ocp-200 text-sm bg-ocp-50 outline-none focus:border-ocp-500 focus:bg-white focus:ring-3 focus:ring-ocp-500/15 transition-all cursor-pointer">
              <option value="">Aucun</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
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

export default Users;
