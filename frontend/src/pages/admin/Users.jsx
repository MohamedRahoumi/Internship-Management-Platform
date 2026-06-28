import { useState, useEffect } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Loading from '../../components/ui/Loading';
import SearchInput from '../../components/ui/SearchInput';
import Badge from '../../components/ui/Badge';

const roleLabels = { administrator: 'Admin', rh: 'RH', supervisor: 'Encadrant', intern: 'Stagiaire' };
const roleColors = { administrator: 'red', rh: 'blue', supervisor: 'amber', intern: 'green' };

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'intern', department_id: '' });
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    api.get(`/users${params}`)
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

  useEffect(() => { const t = setTimeout(fetchUsers, 300); return () => clearTimeout(t); }, [search]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ username: '', email: '', password: '', role: 'intern', department_id: '' });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ username: item.username, email: item.email, password: '', role: item.role, department_id: item.department_id || '' });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = { ...form };
      if (!payload.password && editItem) delete payload.password;
      if (editItem) { await api.put(`/users/${editItem.id}`, payload); }
      else { await api.post('/users', payload); }
      setModalOpen(false); fetchUsers();
    } catch (_) {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Confirmer la suppression ?')) return;
    try { await api.delete(`/users/${id}`); fetchUsers(); } catch (_) {}
  };

  return (
    <div>
      <PageHeader title="Utilisateurs">
        <Button onClick={openCreate}>+ Nouvel utilisateur</Button>
      </PageHeader>

      <div className="page-card-sm mb-6">
        <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher par nom ou email..." className="max-w-md" />
      </div>

      {loading ? <Loading /> : (
        users.length === 0 ? (
          <div className="page-card p-12 text-center text-ocp-400 text-sm">
            Aucun utilisateur trouvé
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ocp-100 bg-ocp-50 text-left">
                  <th className="px-5 py-3 font-semibold text-ocp-600">Nom</th>
                  <th className="px-5 py-3 font-semibold text-ocp-600">Email</th>
                  <th className="px-5 py-3 font-semibold text-ocp-600">Rôle</th>
                  <th className="px-5 py-3 font-semibold text-ocp-600">Département</th>
                  <th className="px-5 py-3 font-semibold text-ocp-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-ocp-50 last:border-none hover:bg-ocp-50">
                    <td className="px-5 py-3 font-medium text-ocp-800">{user.username}</td>
                    <td className="px-5 py-3 text-ocp-500">{user.email}</td>
                    <td className="px-5 py-3">
                      <Badge color={roleColors[user.role] || 'slate'}>
                        {roleLabels[user.role] || user.role}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-ocp-500">{user.department_name || '-'}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-3">
                        <button onClick={() => openEdit(user)} className="text-sm font-medium link-ocp">Modifier</button>
                        <button onClick={() => handleDelete(user.id)} className="text-sm font-medium text-red-700 hover:text-red-800">Supprimer</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}>
        <div className="space-y-4">
          <div>
            <label className="label-field">Nom d'utilisateur</label>
            <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="label-field">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="label-field">{editItem ? 'Nouveau mot de passe (laisser vide pour conserver)' : 'Mot de passe'}</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="label-field">Rôle</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input-field">
              <option value="intern">Stagiaire</option>
              <option value="supervisor">Encadrant</option>
              <option value="rh">RH</option>
              <option value="administrator">Admin</option>
            </select>
          </div>
          <div>
            <label className="label-field">Département</label>
            <select value={form.department_id} onChange={(e) => setForm({ ...form, department_id: e.target.value })} className="input-field">
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
