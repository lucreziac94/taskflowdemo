import { useState } from 'react';
import WorkloadCard from './WorkloadCard';
import WorkloadTaskList from './WorkloadTaskList';
import Badge from '../common/Badge';

const panelStyle = {
  width: '420px',
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--border-radius-lg)',
  boxShadow: 'var(--shadow-lg)',
  overflow: 'auto',
  maxHeight: '80vh',
  flexShrink: 0,
};

const panelHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 'var(--space-5)',
  borderBottom: '1px solid var(--color-border)',
};

const closeBtnStyle = {
  background: 'none',
  border: 'none',
  fontSize: 'var(--font-size-xl)',
  color: 'var(--color-text-muted)',
  cursor: 'pointer',
  padding: 'var(--space-1)',
  lineHeight: 1,
};

const avatarStyle = (color) => ({
  width: '36px',
  height: '36px',
  borderRadius: 'var(--border-radius-full)',
  background: color || 'var(--color-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontWeight: 'var(--font-weight-semibold)',
  fontSize: 'var(--font-size-sm)',
  flexShrink: 0,
});

export default function WorkloadSlidePanel({ members }) {
  const [selected, setSelected] = useState(null);

  const initials = (name) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: selected ? 'repeat(auto-fill, minmax(260px, 1fr))' : 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 'var(--space-4)',
        transition: 'var(--transition-base)',
      }}>
        {members?.map((member) => (
          <WorkloadCard
            key={member.id}
            member={member}
            onClick={(m) => setSelected(m)}
          />
        ))}
      </div>

      {selected && (
        <div style={panelStyle}>
          <div style={panelHeaderStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={avatarStyle(selected.avatar_color)}>
                {initials(selected.name)}
              </div>
              <div>
                <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>{selected.name}</div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                  {selected.total_tasks} tasks · {selected.role}
                </div>
              </div>
            </div>
            <button style={closeBtnStyle} onClick={() => setSelected(null)}>&times;</button>
          </div>
          <div style={{ padding: 'var(--space-4)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
              {selected.total_tasks >= 8 && <Badge value="overloaded" />}
              {selected.total_tasks === 0 && <Badge value="available" />}
              {selected.urgent_count > 0 && <Badge value="urgent" style={{ fontSize: 'var(--font-size-xs)' }} />}
              {selected.high_count > 0 && <Badge value="high" style={{ fontSize: 'var(--font-size-xs)' }} />}
            </div>
          </div>
          <WorkloadTaskList tasks={selected.tasks} />
        </div>
      )}
    </div>
  );
}
