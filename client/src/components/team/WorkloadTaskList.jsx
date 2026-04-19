import Badge from '../common/Badge';

const headerStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 100px 80px 100px',
  gap: 'var(--space-3)',
  padding: 'var(--space-2) var(--space-3)',
  fontSize: 'var(--font-size-xs)',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--color-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  borderBottom: '2px solid var(--color-border)',
};

const rowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 100px 80px 100px',
  gap: 'var(--space-3)',
  padding: 'var(--space-3)',
  fontSize: 'var(--font-size-sm)',
  borderBottom: '1px solid var(--color-border-light)',
  alignItems: 'center',
};

export default function WorkloadTaskList({ tasks }) {
  if (!tasks?.length) {
    return (
      <p style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
        No tasks assigned
      </p>
    );
  }

  return (
    <div>
      <div style={headerStyle}>
        <span>Task</span>
        <span>Status</span>
        <span>Priority</span>
        <span>Due</span>
      </div>
      {tasks.map((task) => (
        <div key={task.id} style={rowStyle}>
          <div>
            <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text)' }}>{task.title}</div>
            {task.project_name && (
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                {task.project_name}
              </div>
            )}
          </div>
          <Badge value={task.status} />
          <Badge value={task.priority} />
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            {task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
          </span>
        </div>
      ))}
    </div>
  );
}
