import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const icons = {
  dashboard: 'fa-tachometer-alt',
  users: 'fa-users',
  departments: 'fa-building',
  audit: 'fa-clipboard-list',
  applications: 'fa-file-alt',
  interns: 'fa-graduation-cap',
  certificates: 'fa-certificate',
  offres: 'fa-file-contract',
  scanner: 'fa-qrcode',
  evaluations: 'fa-star',
  attendance: 'fa-calendar-check',
  report: 'fa-file-alt',
  evaluation: 'fa-star',
  certificate: 'fa-certificate',
  profile: 'fa-user',
};

const roleMenuItems = {
  administrator: [
    { label: 'Tableau de bord', path: '/admin/dashboard', icon: 'dashboard' },
    { label: 'Mon profil', path: '/admin/profile', icon: 'profile' },
    { label: 'Utilisateurs', path: '/admin/users', icon: 'users' },
    { label: 'Départements', path: '/admin/departments', icon: 'departments' },
    { label: "Journal d'audit", path: '/admin/audit-logs', icon: 'audit' },
  ],
  rh: [
    { label: 'Tableau de bord', path: '/rh/dashboard', icon: 'dashboard' },
    { label: 'Mon profil', path: '/rh/profile', icon: 'profile' },
    { label: 'Candidatures', path: '/rh/applications', icon: 'applications' },
    { label: 'Stagiaires', path: '/rh/interns', icon: 'interns' },
    { label: 'Attestations', path: '/rh/certificates', icon: 'certificates' },
  ],
  supervisor: [
    { label: 'Tableau de bord', path: '/supervisor/dashboard', icon: 'dashboard' },
    { label: 'Mon profil', path: '/supervisor/profile', icon: 'profile' },
    { label: 'Mes stagiaires', path: '/supervisor/interns', icon: 'interns' },
    { label: 'Scanner', path: '/supervisor/scanner', icon: 'scanner' },
    { label: 'Rapports', path: '/supervisor/reports', icon: 'report' },
    { label: 'Évaluations', path: '/supervisor/evaluations', icon: 'evaluations' },
  ],
  intern: [
    { label: 'Tableau de bord', path: '/intern/dashboard', icon: 'dashboard' },
    { label: 'Mon profil', path: '/intern/profile', icon: 'profile' },
    { label: 'Ma candidature', path: '/intern/application', icon: 'applications' },
    { label: 'Mes présences', path: '/intern/attendance', icon: 'attendance' },
    { label: 'Mon rapport', path: '/intern/report', icon: 'report' },
    { label: 'Mon évaluation', path: '/intern/evaluation', icon: 'evaluation' },
    { label: 'Mon offre de stage', path: '/intern/offre-stage', icon: 'offres' },
    { label: 'Mon attestation', path: '/intern/certificate', icon: 'certificate' },
  ],
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
    const active = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        onClick={() => setSidebarOpen(false)}
        className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mb-0.5 ${
          active
            ? 'bg-ocp-500 text-white shadow-[0_4px_12px_rgba(0,132,61,0.25)]'
            : 'text-gray-500 hover:bg-ocp-100 hover:text-ocp-700'
        }`}
      >
        <i className={`fas ${icons[item.icon]} w-5 text-center text-sm transition-all ${active ? 'text-white' : ''}`} />
        {item.label}
      </Link>
    );
  };

  const initials = user ? `${user.prenom?.[0] || ''}${user.nom?.[0] || ''}`.toUpperCase() : '?';
  const fullName = user ? `${user.prenom} ${user.nom}` : '';

  return (
    <div className="min-h-screen bg-ocp-50">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/25 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-[260px] h-full bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-center px-6 py-5 border-b border-gray-200">
          <img src="/ocp.svg" alt="OCP" className="h-12 w-auto rounded-lg" />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="text-[0.7rem] uppercase tracking-wider text-gray-400 font-semibold px-3 pb-2">Navigation</div>
          {menuItems.map((item) => (
            <NavLink key={item.path} item={item} />
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
          >
            <i className="fas fa-sign-out-alt w-5 text-center" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:ml-[260px] min-h-screen flex flex-col transition-margin duration-300">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-white/85 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-ocp-700 p-1.5 rounded-lg hover:bg-ocp-100 transition-colors"
            >
              <i className="fas fa-bars text-lg" />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-ocp-50 px-3.5 py-1.5 rounded-full border border-transparent focus-within:border-ocp-500 focus-within:bg-white transition-all">
              <i className="fas fa-search text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="border-none bg-transparent outline-none text-sm py-1 w-44 placeholder:text-gray-400 text-ocp-700"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-gray-500 hover:text-ocp-700 p-2 rounded-lg hover:bg-ocp-100 transition-all">
              <i className="fas fa-bell text-lg" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <Link
              to={`/${user?.role === 'administrator' ? 'admin' : user?.role}/profile`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              {user?.photo ? (
                <img src={user.photo} alt="" className="w-9 h-9 rounded-full object-cover shadow-sm" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-ocp-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  {initials}
                </div>
              )}
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-ocp-700 leading-tight">{fullName}</div>
                <div className="text-[0.7rem] text-gray-500">{user?.email}</div>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg text-sm font-medium transition-all hidden sm:block"
            >
              <i className="fas fa-sign-out-alt" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-7 lg:py-8">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-5 px-6 text-center text-xs text-gray-500">
          &copy; 2026 OCP Group — Portail des Stages
          <a href="#" className="text-gray-500 hover:text-ocp-500 ml-3 mr-2 transition-colors">Mentions légales</a>
          <a href="#" className="text-gray-500 hover:text-ocp-500 mr-2 transition-colors">Confidentialité</a>
          <a href="#" className="text-gray-500 hover:text-ocp-500 transition-colors">Support</a>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
