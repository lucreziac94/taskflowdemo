import { useState } from 'react';
import { useTeam } from '../hooks/useTeam';
import { useTeamWorkload } from '../hooks/useTeamWorkload';
import MemberList from '../components/team/MemberList';
import WorkloadStats from '../components/team/WorkloadStats';
import WorkloadExpandable from '../components/team/WorkloadExpandable';
import WorkloadSlidePanel from '../components/team/WorkloadSlidePanel';
import WorkloadModal from '../components/team/WorkloadModal';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

const variants = [
  { key: 'expandable', label: 'Expandable Rows' },
  { key: 'panel', label: 'Slide-Out Panel' },
  { key: 'modal', label: 'Modal Deep-Dive' },
];

const tabBarStyle = {
  display: 'flex',
  gap: 'var(--space-1)',
  marginBottom: 'var(--space-5)',
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--border-radius-md)',
  padding: '4px',
  width: 'fit-content',
};

const tabStyle = (active) => ({
  padding: 'var(--space-2) var(--space-4)',
  borderRadius: 'var(--border-radius-sm)',
  fontSize: 'var(--font-size-sm)',
  fontWeight: 'var(--font-weight-medium)',
  cursor: 'pointer',
  border: 'none',
  background: active ? 'var(--color-primary)' : 'transparent',
  color: active ? '#fff' : 'var(--color-text-secondary)',
  transition: 'var(--transition-fast)',
});

export default function Team() {
  const [view, setView] = useState('list');
  const [variant, setVariant] = useState('expandable');
  const { data: members, loading } = useTeam();
  const { data: workloadData, loading: workloadLoading, error: workloadError, refetch } = useTeamWorkload();

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <h1>Team</h1>
          <p>Your product team members</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="small" onClick={() => setView('list')}>List</Button>
          <Button variant={view === 'workload' ? 'secondary' : 'ghost'} size="small" onClick={() => setView('workload')}>Workload</Button>
        </div>
      </div>

      {view === 'list' && <MemberList members={members} />}

      {view === 'workload' && (
        <>
          {workloadLoading && <Spinner />}
          {workloadError && (
            <div style={{
              textAlign: 'center',
              padding: 'var(--space-8)',
              color: 'var(--color-text-secondary)',
            }}>
              <p style={{ marginBottom: 'var(--space-4)' }}>Something went wrong loading workload data.</p>
              <Button onClick={refetch}>Try Again</Button>
            </div>
          )}
          {!workloadLoading && !workloadError && workloadData && (
            <>
              <WorkloadStats members={workloadData} />

              <div style={tabBarStyle}>
                {variants.map((v) => (
                  <button
                    key={v.key}
                    style={tabStyle(variant === v.key)}
                    onClick={() => setVariant(v.key)}
                  >
                    {v.label}
                  </button>
                ))}
              </div>

              {variant === 'expandable' && <WorkloadExpandable members={workloadData} />}
              {variant === 'panel' && <WorkloadSlidePanel members={workloadData} />}
              {variant === 'modal' && <WorkloadModal members={workloadData} />}
            </>
          )}
        </>
      )}
    </div>
  );
}
