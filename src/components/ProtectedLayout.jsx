import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3, CalendarClock, ChevronLeft, ChevronRight, FileClock, FileText,
  LayoutDashboard, LogOut, Mail, Menu, Settings, Shield, Tags, Users, X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const navigation = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Compose Email', path: '/compose', icon: Mail },
  { label: 'Recipients', path: '/recipients', icon: Users },
  { label: 'Recipient Categories', path: '/categories', icon: Tags },
  { label: 'Email History', path: '/history', icon: FileClock },
  { label: 'Scheduled Emails', path: '/scheduled', icon: CalendarClock },
  { label: 'Email Templates', path: '/templates', icon: FileText },
  { label: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
  { label: 'User Management', path: '/users', icon: Users },
  { label: 'Role Management', path: '/roles', icon: Shield },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export default function ProtectedLayout() {
  const { user, setUser, toast } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'mobile-sidebar-open' : ''}`}>
      {mobileOpen && <button className="sidebar-scrim" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src="/assets/cdce-logo.png" alt="University of Peradeniya seal" />
          <div className="brand-copy"><strong>CDCE</strong><span>Email Management</span></div>
          <button className="mobile-close icon-button" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={19} /></button>
        </div>
        <div className="sidebar-caption">WORKSPACE</div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          {navigation.map(({ label, path, icon: Icon }) => (
            <NavLink key={path} to={path} onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title={label}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="nav-item logout-link" onClick={logout}><LogOut size={18} /><span>Logout</span></button>
        <div className="sidebar-bottom">
          <div className="sidebar-user-avatar">{user?.name?.split(' ').map((word) => word[0]).slice(0, 2).join('')}</div>
          <div className="sidebar-user-copy"><strong>{user?.name}</strong><span>{user?.role}</span></div>
          <button className="collapse-button icon-button" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
          </button>
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <button className="mobile-menu icon-button" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={21} /></button>
          <div className="breadcrumb"><span>CDCE</span><span className="breadcrumb-divider">/</span><strong>University of Peradeniya</strong></div>
          <div className="topbar-actions">
            <span className="environment-badge"><span /> Demo environment</span>
            <div className="notification-wrap">
              <button className="icon-button notification-button" onClick={() => setNotificationsOpen(!notificationsOpen)} aria-label="Notifications">
                <span className="notification-dot" /><Mail size={18} />
              </button>
              {notificationsOpen && <div className="notification-popover"><strong>Notifications</strong><p>Your demo workspace is ready to use.</p><p>Remember to review recipient details before sending.</p></div>}
            </div>
            <div className="topbar-profile"><span className="avatar">{user?.name?.split(' ').map((word) => word[0]).slice(0, 2).join('')}</span><span className="profile-name">{user?.name}</span></div>
          </div>
        </header>
        <main className={`page-content ${location.pathname === '/dashboard' ? 'dashboard-page-content' : ''}`}><Outlet /></main>
      </div>
      {toast && <div className={`toast toast-${toast.type}`} role="status">{toast.message}</div>}
    </div>
  );
}
