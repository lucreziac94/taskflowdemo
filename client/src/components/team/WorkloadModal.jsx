import { useState } from 'react';
import WorkloadCard from './WorkloadCard';
import WorkloadTaskList from './WorkloadTaskList';
import Modal from '../common/Modal';
import Badge from '../common/Badge';

const avatarStyle = (color) => ({
  width: '48px',
  height: '48px',
  borderRadius: 'var(--border-radius-full)',
  background: color || 'var(--color-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontWeight: 'var(--font-weight-semibold)',
  fontSize: 'var(--font-size-lg)',
  flexShrink: 0,
});

export default function WorkloadModal({ members }) {
  const [selected, setSelected] = useState(null);

  const initials = (name) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 'var(--space-4)',
      }}>
        {members?.map((member) => (
          <WorkloadCard
            key={member.id}
            member={member}
            onClick={(m) => setSelected(m)}
          />
        ))}
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="" maxWidth="640px">
        {selected && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
              <div style={avatarStyle(selected.avatar_color)}>
                {initials(selected.name)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-semibold)' }}>
                  {selected.name}
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                  {selected.role} · {selected.email}
                </div>
              </div>
              {selected.total_tasks >= 8 && <Badge value="overloaded" />}
              {selected.total_tasks === 0 && <Badge value="available" />}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-5)',
            }}>
              {[
                { label: 'Total', value: selected.total_tasks, color: 'var(--color-info)' },
                { label: 'Urgent', value: selected.urgent_count, color: 'var(--color-priority-urgent)' },
                { label: 'High', value: selected.high_count, color: 'var(--color-priority-high)' },
                { label: 'Medium', value: selected.medium_count, color: 'var(--color-priority-medium)' },
              ].map((stat) => (
                <div key={stat.label} style={{
                  textAlign: 'center',
                  padding: 'var(--space-3)',
                  background: 'var(--color-bg)',
                  borderRadius: 'var(--border-radius-md)',
                }}>
                  <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: stat.color }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-3)', color: 'var(--color-text-secondary)' }}>
              Assigned Tasks
            </h4>
            <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-md)', overflow: 'hidden' }}>
              <WorkloadTaskList tasks={selected.tasks} />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
