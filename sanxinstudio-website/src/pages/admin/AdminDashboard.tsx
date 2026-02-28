import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { admin } = useAuth();

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
        <p style={styles.subtitle}>
          Welcome back, <strong>{admin?.name}</strong> 👋
        </p>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardIcon}>📄</div>
          <div style={styles.cardTitle}>Pages</div>
          <div style={styles.cardDesc}>Manage website pages and sections</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIcon}>🖼️</div>
          <div style={styles.cardTitle}>Media</div>
          <div style={styles.cardDesc}>Upload and manage images & videos</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIcon}>⚙️</div>
          <div style={styles.cardTitle}>Settings</div>
          <div style={styles.cardDesc}>Website configuration</div>
        </div>
      </div>

      <div style={styles.infoBox}>
        <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
          💡 Menu halaman dan section akan bertambah secara otomatis saat konten baru ditambahkan ke CMS.
        </p>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#fff',
    margin: '0 0 8px',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '15px',
    color: 'rgba(255, 255, 255, 0.5)',
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  card: {
    padding: '28px 24px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '16px',
    transition: 'border-color 0.2s, transform 0.15s',
    cursor: 'pointer',
  },
  cardIcon: {
    fontSize: '32px',
    marginBottom: '16px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '6px',
  },
  cardDesc: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.4)',
    lineHeight: 1.5,
  },
  infoBox: {
    padding: '16px 20px',
    background: 'rgba(99, 102, 241, 0.06)',
    border: '1px solid rgba(99, 102, 241, 0.15)',
    borderRadius: '12px',
  },
};

export default AdminDashboard;
