import { useState } from 'react';
import Badge from '../common/Badge';

const OVERLOAD_THRESHOLD = 8;

const cardStyle = (isOverloaded, isAvailable, isHovered) => ({
  background: isOverloaded
    ? 'var(--color-error-light)'
    : isAvailable
      ? 'var(--color-success-light)'
      : 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderLeft: isOverloaded
    ? '4px solid var(--color-error)'
    : isAvailable
      ? '4px solid var(--color-success)'
      : '1px solid var(--color-border)',
  borderRadius: 'var(--border-radius-lg)',
  padding: 'var(--space-5)',
  cursor: 'pointer',
  transition: 'var(--transition-base)',
  boxShadow: isHovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
  transform: isHovered ? 'translateY(-2px)' : 'none',
});

const avatarStyle = (color) => ({
  width: '44px',
  height: '44px',
  borderRadius: 'var(--border-radius-full)',
  background: color || 'var(--color-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontWeight: 'var(--font-weight-semibold)',
  fontSize: 'var(--font-size-base)',
  flexShrink: 0,
});

const priorityDotStyle = (color) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-secondary)',
});

const dotStyle = (color) => ({
  width: '8px',
  height: '8px',
  borderRadius: 'var(--border-radius-full)',
  background: color,
  display: 'inline-block',
});

export default function WorkloadCard({ member, onClick }) {
  const [hovered, setHovered] = useState(false);
  const isOverloaded = member.total_tasks >= OVERLOAD_THRESHOLD;
  const isAvailable = member.total_tasks === 0;

  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      style={cardStyle(isOverloaded, isAvailable, hovered)}
      onClick={() => onClick?.(member)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
        <div style={avatarStyle(member.avatar_color)}>{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-sm)' }}>{member.name}</div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{member.role}</div>
        </div>
        {isOverloaded && <Badge value="overloaded" />}
        {isAvailable && <Badge value="available" />}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
        <span style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text)' }}>
          {member.total_tasks}
        </span>
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
          {member.total_tasks === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {member.total_tasks > 0 && (
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          {member.urgent_count > 0 && (
            <span style={priorityDotStyle('var(--color-priority-urgent)')}>
              <span style={dotStyle('var(--color-priority-urgent)')} />
              {member.urgent_count} urgent
            </span>
          )}
          {member.high_count > 0 && (
            <span style={priorityDotStyle('var(--color-priority-high)')}>
              <span style={dotStyle('var(--color-priority-high)')} />
              {member.high_count} high
            </span>
          )}
          {member.medium_count > 0 && (
            <span style={priorityDotStyle('var(--color-priority-medium)')}>
              <span style={dotStyle('var(--color-priority-medium)')} />
              {member.medium_count} med
            </span>
          )}
          {member.low_count > 0 && (
            <span style={priorityDotStyle('var(--color-priority-low)')}>
              <span style={dotStyle('var(--color-priority-low)')} />
              {member.low_count} low
            </span>
          )}
        </div>
      )}
    </div>
  );
}
