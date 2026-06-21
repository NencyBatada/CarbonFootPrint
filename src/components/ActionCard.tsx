import React from 'react';
import { CheckCircle2, Circle, Trophy } from 'lucide-react';
import type { RecommendedAction } from '../utils/FootprintContext';

interface ActionCardProps {
  action: RecommendedAction;
  onToggle: (id: string) => void;
}

const impactColorMap: Record<string, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981',
};

export const ActionCard: React.FC<ActionCardProps> = React.memo(({ action, onToggle }) => {
  const impactColor = action.completed ? 'var(--primary)' : (impactColorMap[action.impact] ?? '#10b981');

  return (
    <article
      className={`glass-card ${action.completed ? 'completed-card' : ''}`}
      aria-label={`Action: ${action.title}${action.completed ? ' (completed)' : ''}`}
      style={{
        position: 'relative',
        borderLeft: `4px solid ${impactColor}`,
        opacity: action.completed ? 0.85 : 1,
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <h3
          id={`action-title-${action.id}`}
          style={{
            fontSize: '1.15rem',
            fontWeight: 600,
            textDecoration: action.completed ? 'line-through' : 'none',
            color: action.completed ? 'var(--text-muted)' : 'var(--text-primary)',
          }}
        >
          {action.title}
        </h3>
        <button
          onClick={() => onToggle(action.id)}
          aria-label={action.completed ? `Mark "${action.title}" as incomplete` : `Mark "${action.title}" as complete`}
          aria-pressed={action.completed}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: action.completed ? 'var(--primary)' : 'var(--text-muted)',
            transition: 'color 0.2s ease',
          }}
        >
          {action.completed
            ? <CheckCircle2 size={24} aria-hidden="true" />
            : <Circle size={24} aria-hidden="true" />}
        </button>
      </div>

      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        {action.description}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          aria-label={`Impact level: ${action.impact}`}
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            padding: '4px 8px',
            borderRadius: '4px',
            background: 'rgba(255, 255, 255, 0.05)',
            color: impactColorMap[action.impact] ?? '#10b981',
          }}
        >
          {action.impact} Impact
        </span>
        <span
          aria-label={`CO2 reduction: ${action.reductionAmount} kilograms per year`}
          style={{
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'var(--secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Trophy size={14} aria-hidden="true" />
          -{action.reductionAmount} kg CO2/yr
        </span>
      </div>
    </article>
  );
});
