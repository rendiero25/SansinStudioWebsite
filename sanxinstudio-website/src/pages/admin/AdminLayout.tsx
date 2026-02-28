import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: '📊' },
    // More menu items will be added per section
  ];

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logoIcon}>S</div>
          <div>
            <div style={styles.logoText}>Sanxin Studio</div>
            <div style={styles.logoSub}>CMS</div>
          </div>
        </div>

        <nav style={styles.nav}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              style={({ isActive }) => ({
                ...styles.navItem,
                background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                color: isActive ? '#a78bfa' : 'rgba(255, 255, 255, 0.6)',
                borderLeft: isActive ? '3px solid #a78bfa' : '3px solid transparent',
              })}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.adminInfo}>
            <div style={styles.avatar}>{admin?.name?.charAt(0) || 'A'}</div>
            <div>
              <div style={styles.adminName}>{admin?.name}</div>
              <div style={styles.adminRole}>{admin?.role}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: '"IBM Plex Sans", sans-serif',
    background: '#0f0f13',
  },
  sidebar: {
    width: '260px',
    background: 'rgba(15, 15, 23, 0.95)',
    borderRight: '1px solid rgba(255, 255, 255, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed' as const,
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 100,
  },
  sidebarHeader: {
    padding: '24px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '18px',
    fontWeight: 700,
    color: '#fff',
    lineHeight: '40px',
    flexShrink: 0,
  },
  logoText: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#fff',
    lineHeight: 1.2,
  },
  logoSub: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
  },
  nav: {
    flex: 1,
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    overflowY: 'auto' as const,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'all 0.15s ease',
  },
  sidebarFooter: {
    padding: '16px 16px',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  adminInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: 600,
    color: '#fff',
    lineHeight: '36px',
    flexShrink: 0,
  },
  adminName: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#fff',
  },
  adminRole: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'capitalize' as const,
  },
  logoutBtn: {
    padding: '10px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '10px',
    color: '#ef4444',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background 0.15s',
    fontFamily: '"IBM Plex Sans", sans-serif',
  },
  main: {
    flex: 1,
    marginLeft: '260px',
    padding: '32px',
    minHeight: '100vh',
  },
};

export default AdminLayout;
