import { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface SubMenuItem {
  label: string;
  path: string;
  icon: string;
}

interface MenuItem {
  label: string;
  icon: string;
  path?: string;
  subItems?: SubMenuItem[];
}

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["Home"]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) =>
      prev.includes(label) ? prev.filter((m) => m !== label) : [...prev, label],
    );
  };

  const menuItems: MenuItem[] = [
    { label: "Dashboard", path: "/admin", icon: "📊" },
    {
      label: "Header",
      path: "/admin/home/header",
      icon: "🔝",
    },
    {
      label: "Home",
      icon: "🏠",
      subItems: [
        { label: "Hero", path: "/admin/home/hero", icon: "🎬" },
        {
          label: "Section 2",
          path: "/admin/home/section2",
          icon: "🚀",
        },
        {
          label: "Section 3",
          path: "/admin/home/section3",
          icon: "🧱",
        },
        {
          label: "Section 4",
          path: "/admin/home/section4",
          icon: "❓",
        },
        {
          label: "Section 5",
          path: "/admin/home/section5",
          icon: "💡",
        },
        {
          label: "Section 6",
          path: "/admin/home/section6",
          icon: "🎯",
        },
        {
          label: "Section 7",
          path: "/admin/home/section7",
          icon: "⚡",
        },
        {
          label: "Section 8",
          path: "/admin/home/section8",
          icon: "🖼️",
        },
        { label: "Footer", path: "/admin/home/footer", icon: "📋" },
      ],
    },
    {
      label: "Solution",
      icon: "🔧",
      subItems: [
        { label: "Section 1", path: "/admin/solution/section1", icon: "🎬" },
        { label: "Section 2", path: "/admin/solution/section2", icon: "🚀" },
        { label: "Section 3", path: "/admin/solution/section3", icon: "⚡" },
        { label: "Section 4", path: "/admin/solution/section4", icon: "🎯" },
      ],
    },
    {
      label: "Works",
      icon: "🖼️",
      subItems: [
        { label: "Section 1", path: "/admin/works/section1", icon: "🎬" },
        { label: "Section 2", path: "/admin/works/section2", icon: "🚀" },
        { label: "Section 3", path: "/admin/works/section3", icon: "🎯" },
      ],
    },
    { label: "Projects", icon: "📁", path: "#" },
    { label: "Contacts", icon: "📞", path: "#" },
    { label: "FAQ", icon: "❓", path: "/admin/faq" },
  ];

  const isSubItemActive = (item: MenuItem) => {
    return item.subItems?.some((sub) => location.pathname === sub.path);
  };

  const renderNavItem = (item: MenuItem) => {
    if (item.subItems) {
      const isExpanded = expandedMenus.includes(item.label);
      const hasActive = isSubItemActive(item);

      return (
        <div key={item.label} className="nav-group">
          <button
            onClick={() => toggleMenu(item.label)}
            style={{
              ...styles.navItem,
              background: hasActive
                ? "rgba(99, 102, 241, 0.08)"
                : "transparent",
              color: hasActive ? "#a78bfa" : "rgba(255, 255, 255, 0.6)",
              border: "none",
              width: "100%",
              cursor: "pointer",
              fontFamily: '"IBM Plex Sans", sans-serif',
              justifyContent: "space-between",
            }}
          >
            <span
              style={{ display: "flex", alignItems: "center", gap: "12px" }}
            >
              <span style={{ fontSize: "16px" }}>{item.icon}</span>
              <span>{item.label}</span>
            </span>
            <span
              style={{
                fontSize: "10px",
                transition: "transform 0.2s",
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              ▼
            </span>
          </button>

          <div
            style={{
              overflow: "hidden",
              maxHeight: isExpanded ? `${item.subItems.length * 44}px` : "0",
              transition: "max-height 0.25s ease",
            }}
          >
            {item.subItems.map((sub) => (
              <NavLink
                key={sub.path}
                to={sub.path}
                onClick={() => setMobileOpen(false)}
                style={({ isActive }) => ({
                  ...styles.subNavItem,
                  background: isActive
                    ? "rgba(99, 102, 241, 0.12)"
                    : "transparent",
                  color: isActive ? "#a78bfa" : "rgba(255, 255, 255, 0.45)",
                  borderLeft: isActive
                    ? "2px solid #a78bfa"
                    : "2px solid rgba(255, 255, 255, 0.06)",
                })}
              >
                <span style={{ fontSize: "13px" }}>{sub.icon}</span>
                <span>{sub.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      );
    }

    if (item.path === "#") {
      return (
        <div
          key={item.label}
          style={{
            ...styles.navItem,
            color: "rgba(255, 255, 255, 0.25)",
            cursor: "not-allowed",
          }}
        >
          <span style={{ fontSize: "16px" }}>{item.icon}</span>
          <span>{item.label}</span>
          <span
            style={{
              fontSize: "9px",
              background: "rgba(255,255,255,0.06)",
              padding: "2px 6px",
              borderRadius: "4px",
              marginLeft: "auto",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            Soon
          </span>
        </div>
      );
    }

    return (
      <NavLink
        key={item.path}
        to={item.path!}
        end={item.path === "/admin"}
        onClick={() => setMobileOpen(false)}
        style={({ isActive }) => ({
          ...styles.navItem,
          background: isActive ? "rgba(99, 102, 241, 0.15)" : "transparent",
          color: isActive ? "#a78bfa" : "rgba(255, 255, 255, 0.6)",
          borderLeft: isActive ? "3px solid #a78bfa" : "3px solid transparent",
        })}
      >
        <span style={{ fontSize: "16px" }}>{item.icon}</span>
        <span>{item.label}</span>
      </NavLink>
    );
  };

  return (
    <div style={styles.layout}>
      {/* Mobile Hamburger */}
      <button
        data-hamburger
        style={styles.hamburger}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div style={styles.overlay} onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        data-sidebar
        className={mobileOpen ? "open" : ""}
        style={{
          ...styles.sidebar,
          ...(mobileOpen ? { transform: "translateX(0)" } : {}),
        }}
      >
        <div style={styles.sidebarHeader}>
          <div style={styles.logoIcon}>S</div>
          <div>
            <div style={styles.logoText}>Sanxin Studio</div>
            <div style={styles.logoSub}>CMS</div>
          </div>
        </div>

        <nav style={styles.nav}>{menuItems.map(renderNavItem)}</nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.adminInfo}>
            <div style={styles.avatar}>{admin?.name?.charAt(0) || "A"}</div>
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
      <main data-main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  layout: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: '"IBM Plex Sans", sans-serif',
    background: "#0f0f13",
  },
  hamburger: {
    display: "none",
    position: "fixed" as const,
    top: "16px",
    left: "16px",
    zIndex: 200,
    width: "44px",
    height: "44px",
    background: "rgba(15, 15, 23, 0.95)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "20px",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: '"IBM Plex Sans", sans-serif',
  },
  overlay: {
    position: "fixed" as const,
    inset: 0,
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: 99,
  },
  sidebar: {
    width: "280px",
    background: "rgba(15, 15, 23, 0.95)",
    borderRight: "1px solid rgba(255, 255, 255, 0.06)",
    display: "flex",
    flexDirection: "column" as const,
    position: "fixed" as const,
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 100,
    transition: "transform 0.3s ease",
  },
  sidebarOpen: {
    transform: "translateX(0) !important",
  },
  sidebarHeader: {
    padding: "24px 20px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
    flexShrink: 0,
  },
  logoIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #6366f1, #a855f7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "18px",
    fontWeight: 700,
    color: "#fff",
    lineHeight: "40px",
    flexShrink: 0,
  },
  logoText: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#fff",
    lineHeight: 1.2,
  },
  logoSub: {
    fontSize: "11px",
    color: "rgba(255, 255, 255, 0.4)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
  },
  nav: {
    flex: 1,
    padding: "16px 12px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "2px",
    overflowY: "auto" as const,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "11px 16px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 500,
    textDecoration: "none",
    transition: "all 0.15s ease",
  },
  subNavItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "9px 16px 9px 42px",
    fontSize: "13px",
    fontWeight: 400,
    textDecoration: "none",
    transition: "all 0.15s ease",
    marginLeft: "8px",
  },
  sidebarFooter: {
    padding: "16px 16px",
    borderTop: "1px solid rgba(255, 255, 255, 0.06)",
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    flexShrink: 0,
  },
  adminInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #6366f1, #a855f7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "14px",
    fontWeight: 600,
    color: "#fff",
    lineHeight: "36px",
    flexShrink: 0,
  },
  adminName: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#fff",
  },
  adminRole: {
    fontSize: "11px",
    color: "rgba(255, 255, 255, 0.4)",
    textTransform: "capitalize" as const,
  },
  logoutBtn: {
    padding: "10px",
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    borderRadius: "10px",
    color: "#ef4444",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 0.15s",
    fontFamily: '"IBM Plex Sans", sans-serif',
  },
  main: {
    flex: 1,
    marginLeft: "280px",
    padding: "32px",
    minHeight: "100vh",
  },
};

// Inject responsive styles via style tag

// Add style tag on mount
if (typeof document !== "undefined") {
  const existingStyle = document.getElementById("admin-layout-responsive");
  if (!existingStyle) {
    const style = document.createElement("style");
    style.id = "admin-layout-responsive";
    style.textContent = `
      @media (max-width: 768px) {
        [data-hamburger] { display: flex !important; }
        [data-sidebar] { transform: translateX(-100%); }
        [data-sidebar].open { transform: translateX(0); }
        [data-main] { margin-left: 0 !important; padding: 72px 16px 32px !important; }
      }
      @media (max-width: 1024px) and (min-width: 769px) {
        [data-sidebar] { width: 260px !important; }
        [data-main] { margin-left: 260px !important; }
      }
    `;
    document.head.appendChild(style);
  }
}

export default AdminLayout;
