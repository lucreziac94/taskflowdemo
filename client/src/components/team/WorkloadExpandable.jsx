import { useState } from 'react';
import WorkloadCard from './WorkloadCard';
import WorkloadTaskList from './WorkloadTaskList';

export default function WorkloadExpandable({ members }) {
  const [expandedIds, setExpandedIds] = useState(new Set());

  const toggleExpand = (member) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(member.id)) {
        next.delete(member.id);
      } else {
        next.add(member.id);
      }
      return next;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {members?.map((member) => (
        <div key={member.id}>
          <WorkloadCard member={member} onClick={toggleExpand} />
          {expandedIds.has(member.id) && (
            <div
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderTop: 'none',
                borderRadius: '0 0 var(--border-radius-lg) var(--border-radius-lg)',
                overflow: 'hidden',
              }}
            >
              <WorkloadTaskList tasks={member.tasks} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
