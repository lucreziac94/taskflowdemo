const colorMap = {
  // Status
  'todo': { bg: 'var(--color-border-light)', text: 'var(--color-text-secondary)' },
  'in-progress': { bg: 'var(--color-info-light)', text: 'var(--color-info)' },
  'in-review': { bg: 'var(--color-accent-light)', text: '#b8860b' },
  'done': { bg: 'var(--color-success-light)', text: 'var(--color-success)' },
  // Priority
  'urgent': { bg: 'var(--color-error-light)', text: 'var(--color-priority-urgent)' },
  'high': { bg: '#fff7ed', text: 'var(--color-priority-high)' },
  'medium': { bg: 'var(--color-accent-light)', text: '#92700c' },
  'low': { bg: 'var(--color-border-light)', text: 'var(--color-priority-low)' },
  // Workload status
  'overloaded': { bg: 'var(--color-error-light)', text: 'var(--color-error)' },
  'available': { bg: 'var(--color-success-light)', text: 'var(--color-success)' },
  // Project status
  'active': { bg: 'var(--color-success-light)', text: 'var(--color-success)' },
  'completed': { bg: 'var(--color-border-light)', text: 'var(--color-text-secondary)' },
  'on-hold': { bg: 'var(--color-warning-light)', text: 'var(--color-warning)' },
};

export default function Badge({ value, style: customStyle }) {
  const colors = colorMap[value] || colorMap['todo'];

  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: 'var(--border-radius-full)',
      fontSize: 'var(--font-size-xs)',
      fontWeight: 'var(--font-weight-medium)',
      textTransform: 'capitalize',
      background: colors.bg,
      color: colors.text,
      whiteSpace: 'nowrap',
      ...customStyle,
    }}>
      {value?.replace('-', ' ')}
    </span>
  );
}
