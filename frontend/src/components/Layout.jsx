import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import {
  IconDashboard, IconUsers, IconBuilding, IconClipboard, IconFileText,
  IconGraduate, IconQrCode, IconStar, IconCertificate, IconLogout, IconMenu,
} from './ui/Icons';

const icons = {
  dashboard: IconDashboard,
  users: IconUsers,
  departments: IconBuilding,
  audit: IconClipboard,
  applications: IconFileText,
  interns: IconGraduate,
  certificates: IconCertificate,
  scanner: IconQrCode,
  evaluations: IconStar,
  attendance: IconClipboard,
  report: IconFileText,
  evaluation: IconStar,
  certificate: IconCertificate,
};

const roleMenuItems = {
  administrator: [
    { label: 'Tableau de bord', path: '/admin/dashboard', icon: 'dashboard' },
    { label: 'Utilisateurs', path: '/admin/users', icon: 'users' },
    { label: 'Départements', path: '/admin/departments', icon: 'departments' },
    { label: "Journal d'audit", path: '/admin/audit-logs', icon: 'audit' },
  ],
  rh: [
    { label: 'Tableau de bord', path: '/rh/dashboard', icon: 'dashboard' },
    { label: 'Candidatures', path: '/rh/applications', icon: 'applications' },
    { label: 'Stagiaires', path: '/rh/interns', icon: 'interns' },
    { label: 'Attestations', path: '/rh/certificates', icon: 'certificates' },
  ],
  supervisor: [
    { label: 'Tableau de bord', path: '/supervisor/dashboard', icon: 'dashboard' },
    { label: 'Mes stagiaires', path: '/supervisor/interns', icon: 'interns' },
    { label: 'Scanner', path: '/supervisor/scanner', icon: 'scanner' },
    { label: 'Évaluations', path: '/supervisor/evaluations', icon: 'evaluations' },
  ],
  intern: [
    { label: 'Tableau de bord', path: '/intern/dashboard', icon: 'dashboard' },
    { label: 'Ma candidature', path: '/intern/application', icon: 'applications' },
    { label: 'Mes présences', path: '/intern/attendance', icon: 'attendance' },
    { label: 'Mon rapport', path: '/intern/report', icon: 'report' },
    { label: 'Mon évaluation', path: '/intern/evaluation', icon: 'evaluation' },
    { label: 'Mon attestation', path: '/intern/certificate', icon: 'certificate' },
  ],
};

const roleLabels = {
  administrator: 'Administrateur',
  rh: 'RH',
  supervisor: 'Superviseur',
  intern: 'Stagiaire',
};

const Layout = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = roleMenuItems[user?.role] || [];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const NavLink = ({ item }) => {
    const Icon = icons[item.icon];
    const active = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        onClick={() => setSidebarOpen(false)}
        className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
          active
            ? 'bg-ocp-500 text-white shadow-sm'
            : 'text-ocp-100 hover:bg-ocp-600 hover:text-white'
        }`}
      >
        {Icon && <Icon className="shrink-0" />}
        {item.label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-ocp-50">
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-ocp-800 transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center h-14 px-5 border-b border-ocp-600">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/ocp.svg" alt="OCP Group" className="h-7 w-auto" />
            <span className="text-white text-sm font-semibold tracking-tight">Gestion Stagiaires</span>
          </Link>
        </div>

        <div className="px-3 py-2 border-b border-ocp-600">
          <p className="text-xs text-ocp-100/60">Connecté en tant que</p>
          <p className="text-sm font-medium text-white truncate mt-0.5">
            {user?.nom} {user?.prenom}
          </p>
          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-lg bg-ocp-600 text-ocp-100">
            {roleLabels[user?.role] || user?.role}
          </span>
        </div>

        <nav className="mt-2 px-3 space-y-0.5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {menuItems.map((item) => (
            <NavLink key={item.path} item={item} />
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-ocp-600 bg-ocp-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-ocp-100 hover:text-white hover:bg-ocp-600 rounded-xl transition-all duration-200"
          >
            <IconLogout />
            Déconnexion
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 bg-white border-b border-ocp-100 shadow-sm">
          <div className="flex items-center justify-between h-14 px-4 lg:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-ocp-500 hover:text-ocp-600 -ml-1 p-1"
            >
              <IconMenu />
            </button>

            <div className="hidden lg:block" />

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-ocp-800">{user?.nom} {user?.prenom}</p>
                <p className="text-xs text-ocp-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-ocp-500 hover:text-red-700 px-3 py-1.5 rounded-xl hover:bg-red-50 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
