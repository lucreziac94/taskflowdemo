const statCardStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--border-radius-lg)',
  padding: 'var(--space-6)',
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-4)',
  boxShadow: 'var(--shadow-sm)',
};

const iconWrapStyle = (bg) => ({
  width: '48px',
  height: '48px',
  borderRadius: 'var(--border-radius-md)',
  background: bg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

const labelStyle = {
  fontSize: 'var(--font-size-sm)',
  color: 'var(--color-text-secondary)',
  fontWeight: 'var(--font-weight-medium)',
};

const valueStyle = {
  fontSize: 'var(--font-size-2xl)',
  fontWeight: 'var(--font-weight-bold)',
  color: 'var(--color-text)',
};

const icons = {
  tasks: (color) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  ),
  avg: (color) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  overloaded: (color) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  available: (color) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
};

export default function WorkloadStats({ members }) {
  const totalTasks = members?.reduce((sum, m) => sum + m.total_tasks, 0) || 0;
  const avgTasks = members?.length ? Math.round((totalTasks / members.length) * 10) / 10 : 0;
  const overloadedCount = members?.filter((m) => m.total_tasks >= 8).length || 0;
  const availableCount = members?.filter((m) => m.total_tasks === 0).length || 0;

  const stats = [
    { label: 'Total Team Tasks', value: totalTasks, icon: icons.tasks, color: 'var(--color-info)', bg: 'var(--color-info-light)' },
    { label: 'Avg Per Member', value: avgTasks, icon: icons.avg, color: 'var(--color-primary)', bg: 'var(--color-primary-light)' },
    { label: 'Overloaded', value: overloadedCount, icon: icons.overloaded, color: 'var(--color-error)', bg: 'var(--color-error-light)' },
    { label: 'Available', value: availableCount, icon: icons.available, color: 'var(--color-success)', bg: 'var(--color-success-light)' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
      {stats.map((stat) => (
        <div key={stat.label} style={statCardStyle}>
          <div style={iconWrapStyle(stat.bg)}>
            {stat.icon(stat.color)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <span style={labelStyle}>{stat.label}</span>
            <span style={valueStyle}>{stat.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
