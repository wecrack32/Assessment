import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  // State Management
  const [stats, setStats] = useState({ total: 0, students: 0, professionals: 0 });
  const [registrations, setRegistrations] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [selectedType, setSelectedType] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const BASE_API = process.env.REACT_APP_Base_API;

  // Fetch Dashboard Stats
  useEffect(() => {
    fetchStats();
    fetchRegistrations();
  }, []);

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter and Search Logic
  useEffect(() => {
    let filtered = registrations;

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(reg => reg.registration_type === selectedType);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(reg =>
        reg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [selectedType, searchQuery, registrations]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${BASE_API}/admin/stats`);
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_API}/admin/registrations?sort=${sortOrder}`);
      const data = await response.json();
      if (data.success) {
        setRegistrations(data.data);
        setFilteredData(data.data);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  // Refetch when sort changes
  useEffect(() => {
    if (registrations.length > 0) {
      fetchRegistrations();
    }
  }, [sortOrder]);

  // Animated Counter Hook
  const useCountUp = (end, duration = 2000) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      let startTime;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }, [end, duration]);
    return count;
  };

  const totalCount = useCountUp(stats.total);
  const studentCount = useCountUp(stats.students);
  const professionalCount = useCountUp(stats.professionals);

  // Format Date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Color Palette
  const colors = {
    primary: '#FDB5CE',
    dark: '#132440',
    medium: '#16476A',
    accent: '#3B9797',
  };

  // Theme Styles
  const theme = {
    bg: darkMode ? '#0a0f1a' : '#f5f7fa',
    cardBg: darkMode ? 'rgba(19, 36, 64, 0.6)' : 'rgba(255, 255, 255, 0.7)',
    text: darkMode ? '#e0e6ed' : '#2d3748',
    textSecondary: darkMode ? '#a0aec0' : '#718096',
    border: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
  };

  // Styles
  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: theme.bg,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color: theme.text,
      transition: 'all 0.3s ease',
    },
    sidebar: {
      width: sidebarCollapsed ? '80px' : '260px',
      backgroundColor: darkMode ? 'rgba(19, 36, 64, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRight: `1px solid ${theme.border}`,
      position: 'sticky',
      top: 0,
      height: '100vh',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '4px 0 20px rgba(0, 0, 0, 0.05)',
    },
    logo: {
      padding: '24px',
      fontSize: sidebarCollapsed ? '20px' : '24px',
      fontWeight: '700',
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      transition: 'all 0.3s ease',
      textAlign: sidebarCollapsed ? 'center' : 'left',
    },
    navItem: (active) => ({
      display: 'flex',
      alignItems: 'center',
      padding: '14px 24px',
      margin: '4px 12px',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundColor: active ? `${colors.primary}20` : 'transparent',
      border: active ? `2px solid ${colors.primary}` : '2px solid transparent',
      position: 'relative',
      overflow: 'hidden',
      justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
    }),
    navIcon: {
      fontSize: '20px',
      marginRight: sidebarCollapsed ? '0' : '12px',
      transition: 'all 0.3s ease',
    },
    mainContent: {
      flex: 1,
      padding: '0',
      transition: 'all 0.3s ease',
      maxWidth: '100%',
    },
    navbar: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: scrolled ? (darkMode ? 'rgba(19, 36, 64, 0.95)' : 'rgba(255, 255, 255, 0.95)') : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? `1px solid ${theme.border}` : 'none',
      padding: '20px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'all 0.3s ease',
      boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.05)' : 'none',
    },
    navbarTitle: {
      fontSize: '28px',
      fontWeight: '700',
      background: `linear-gradient(135deg, ${colors.dark}, ${colors.medium})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    navbarRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    },
    themeToggle: {
      width: '50px',
      height: '26px',
      backgroundColor: darkMode ? colors.accent : '#cbd5e0',
      borderRadius: '13px',
      position: 'relative',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    themeToggleCircle: {
      width: '20px',
      height: '20px',
      backgroundColor: 'white',
      borderRadius: '50%',
      position: 'absolute',
      top: '3px',
      left: darkMode ? '27px' : '3px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px',
      padding: '40px',
    },
    statCard: {
      background: theme.cardBg,
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '28px',
      border: `1px solid ${theme.border}`,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
    },
    statCardGlow: {
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: `radial-gradient(circle, ${colors.primary}20, transparent 70%)`,
      opacity: 0,
      transition: 'opacity 0.4s ease',
    },
    statNumber: {
      fontSize: '48px',
      fontWeight: '700',
      marginBottom: '8px',
      background: `linear-gradient(135deg, ${colors.dark}, ${colors.accent})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    statLabel: {
      fontSize: '14px',
      color: theme.textSecondary,
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    tableContainer: {
      padding: '0 40px 40px 40px',
    },
    filterBar: {
      display: 'flex',
      gap: '16px',
      marginBottom: '24px',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    select: {
      padding: '12px 16px',
      borderRadius: '12px',
      border: `1px solid ${theme.border}`,
      backgroundColor: theme.cardBg,
      backdropFilter: 'blur(20px)',
      color: theme.text,
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      outline: 'none',
      transition: 'all 0.3s ease',
    },
    searchInput: {
      flex: 1,
      minWidth: '250px',
      padding: '12px 16px',
      borderRadius: '12px',
      border: `1px solid ${theme.border}`,
      backgroundColor: theme.cardBg,
      backdropFilter: 'blur(20px)',
      color: theme.text,
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.3s ease',
    },
    table: {
      width: '100%',
      backgroundColor: theme.cardBg,
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      overflow: 'hidden',
      border: `1px solid ${theme.border}`,
    },
    tableHeader: {
      backgroundColor: darkMode ? 'rgba(19, 36, 64, 0.8)' : 'rgba(253, 181, 206, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    },
    th: {
      padding: '16px',
      textAlign: 'left',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      color: theme.textSecondary,
    },
    tr: {
      borderBottom: `1px solid ${theme.border}`,
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    td: {
      padding: '16px',
      fontSize: '14px',
    },
    badge: (type) => ({
      display: 'inline-block',
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      backgroundColor: type === 'student' ? '#3B979720' : '#FDB5CE20',
      color: type === 'student' ? colors.accent : colors.primary,
      border: `1px solid ${type === 'student' ? colors.accent : colors.primary}`,
    }),
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease',
    },
    modalContent: {
      backgroundColor: theme.cardBg,
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: '32px',
      maxWidth: '500px',
      width: '90%',
      border: `1px solid ${theme.border}`,
      animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    },
    skeleton: {
      background: `linear-gradient(90deg, ${theme.border} 25%, ${theme.cardBg} 50%, ${theme.border} 75%)`,
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      borderRadius: '8px',
      height: '20px',
      marginBottom: '12px',
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: theme.textSecondary,
    },
  };

  // Add CSS animations
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `;
  if (!document.head.querySelector('style[data-dashboard]')) {
    styleSheet.setAttribute('data-dashboard', 'true');
    document.head.appendChild(styleSheet);
  }

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>
          {sidebarCollapsed ? '🎯' : '🎯 Admin'}
        </div>
        
        <div style={{ flex: 1, paddingTop: '20px' }}>
          <div
            style={styles.navItem(activeNav === 'dashboard')}
            onClick={() => setActiveNav('dashboard')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(4px)';
              e.currentTarget.style.backgroundColor = `${colors.primary}30`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.backgroundColor = activeNav === 'dashboard' ? `${colors.primary}20` : 'transparent';
            }}
          >
            <span style={styles.navIcon}>📊</span>
            {!sidebarCollapsed && <span>Dashboard</span>}
          </div>
          
          <div
            style={styles.navItem(activeNav === 'registrations')}
            onClick={() => setActiveNav('registrations')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(4px)';
              e.currentTarget.style.backgroundColor = `${colors.primary}30`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.backgroundColor = activeNav === 'registrations' ? `${colors.primary}20` : 'transparent';
            }}
          >
            <span style={styles.navIcon}>📋</span>
            {!sidebarCollapsed && <span>Registrations</span>}
          </div>
          
          <div
            style={styles.navItem(activeNav === 'settings')}
            onClick={() => setActiveNav('settings')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(4px)';
              e.currentTarget.style.backgroundColor = `${colors.primary}30`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.backgroundColor = activeNav === 'settings' ? `${colors.primary}20` : 'transparent';
            }}
          >
            <span style={styles.navIcon}>⚙️</span>
            {!sidebarCollapsed && <span>Settings</span>}
          </div>
        </div>

        <div
          style={{
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer',
            fontSize: '24px',
            transition: 'all 0.3s ease',
          }}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {sidebarCollapsed ? '→' : '←'}
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Navbar */}
        <div style={styles.navbar}>
          <div>
            <div style={styles.navbarTitle}>Admin Dashboard</div>
            <div style={{ fontSize: '14px', color: theme.textSecondary, marginTop: '4px' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          
          <div style={styles.navbarRight}>
            <div
              style={styles.themeToggle}
              onClick={() => setDarkMode(!darkMode)}
            >
              <div style={styles.themeToggleCircle} />
            </div>
            
            <div
              style={styles.avatar}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              AD
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsContainer}>
          <div
            style={styles.statCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = `0 20px 40px ${colors.primary}40`;
              e.currentTarget.querySelector('.glow').style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.querySelector('.glow').style.opacity = '0';
            }}
          >
            <div className="glow" style={styles.statCardGlow} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={styles.statNumber}>{totalCount}</div>
              <div style={styles.statLabel}>Total Registrations</div>
            </div>
          </div>

          <div
            style={styles.statCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = `0 20px 40px ${colors.accent}40`;
              e.currentTarget.querySelector('.glow').style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.querySelector('.glow').style.opacity = '0';
            }}
          >
            <div className="glow" style={styles.statCardGlow} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={styles.statNumber}>{studentCount}</div>
              <div style={styles.statLabel}>Students</div>
            </div>
          </div>

          <div
            style={styles.statCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = `0 20px 40px ${colors.medium}40`;
              e.currentTarget.querySelector('.glow').style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.querySelector('.glow').style.opacity = '0';
            }}
          >
            <div className="glow" style={styles.statCardGlow} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={styles.statNumber}>{professionalCount}</div>
              <div style={styles.statLabel}>Professionals</div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div style={styles.tableContainer}>
          {/* Filter Bar */}
          <div style={styles.filterBar}>
            <select
              style={styles.select}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = colors.primary}
              onBlur={(e) => e.target.style.borderColor = theme.border}
            >
              <option value="all">All Types</option>
              <option value="student">Students</option>
              <option value="professional">Professionals</option>
            </select>

            <select
              style={styles.select}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = colors.primary}
              onBlur={(e) => e.target.style.borderColor = theme.border}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>

            <input
              type="text"
              placeholder="🔍 Search by name or email..."
              style={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = colors.primary;
                e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme.border;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Table */}
          {loading ? (
            <div style={styles.table}>
              <div style={{ padding: '20px' }}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} style={styles.skeleton} />
                ))}
              </div>
            </div>
          ) : filteredData.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div>
              <div style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                No registrations found
              </div>
              <div style={{ fontSize: '14px' }}>
                {searchQuery ? 'Try adjusting your search' : 'No registrations yet'}
              </div>
            </div>
          ) : (
            <div style={styles.table}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={styles.tableHeader}>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Company</th>
                    <th style={styles.th}>Phone</th>
                    <th style={styles.th}>Registration Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((reg, index) => (
                    <tr
                      key={reg._id || index}
                      style={styles.tr}
                      onClick={() => setSelectedRegistration(reg)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = darkMode ? 'rgba(253, 181, 206, 0.05)' : 'rgba(253, 181, 206, 0.1)';
                        e.currentTarget.style.transform = 'scale(1.01)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <td style={styles.td}><strong>{reg.name}</strong></td>
                      <td style={styles.td}>{reg.email}</td>
                      <td style={styles.td}>
                        <span style={styles.badge(reg.registration_type)}>
                          {reg.registration_type === 'student' ? '🎓 Student' : '💼 Professional'}
                        </span>
                      </td>
                      <td style={styles.td}>{reg.company || '-'}</td>
                      <td style={styles.td}>{reg.phone}</td>
                      <td style={styles.td}>{formatDate(reg.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRegistration && (
        <div
          style={styles.modal}
          onClick={() => setSelectedRegistration(null)}
        >
          <div
            style={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>Registration Details</h2>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: theme.text,
                  transition: 'all 0.3s ease',
                }}
                onClick={() => setSelectedRegistration(null)}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(90deg)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0)'}
              >
                ✕
              </button>
            </div>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: theme.textSecondary, marginBottom: '4px' }}>NAME</div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>{selectedRegistration.name}</div>
              </div>
              
              <div>
                <div style={{ fontSize: '12px', color: theme.textSecondary, marginBottom: '4px' }}>EMAIL</div>
                <div style={{ fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {selectedRegistration.email}
                  <button
                    style={{
                      padding: '4px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${colors.primary}`,
                      backgroundColor: `${colors.primary}20`,
                      color: colors.primary,
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                    }}
                    onClick={() => {
                      navigator.clipboard.writeText(selectedRegistration.email);
                      alert('Email copied!');
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.primary;
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = `${colors.primary}20`;
                      e.currentTarget.style.color = colors.primary;
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '12px', color: theme.textSecondary, marginBottom: '4px' }}>TYPE</div>
                <span style={styles.badge(selectedRegistration.registration_type)}>
                  {selectedRegistration.registration_type === 'student' ? '🎓 Student' : '💼 Professional'}
                </span>
              </div>
              
              {selectedRegistration.company && (
                <div>
                  <div style={{ fontSize: '12px', color: theme.textSecondary, marginBottom: '4px' }}>COMPANY</div>
                  <div style={{ fontSize: '16px', fontWeight: '600' }}>{selectedRegistration.company}</div>
                </div>
              )}
              
              <div>
                <div style={{ fontSize: '12px', color: theme.textSecondary, marginBottom: '4px' }}>PHONE</div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>{selectedRegistration.phone}</div>
              </div>
              
              <div>
                <div style={{ fontSize: '12px', color: theme.textSecondary, marginBottom: '4px' }}>REGISTRATION DATE</div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>{formatDate(selectedRegistration.createdAt)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;