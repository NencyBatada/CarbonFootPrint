import React from 'react';
import { CheckCircle2, Circle, Trophy } from 'lucide-react';
import type { RecommendedAction } from '../utils/FootprintContext';

interface ActionCardProps {
  action: RecommendedAction;
  onToggle: (id: string) => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({ action, onToggle }) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return '#ef4444'; // Red
      case 'medium':
        return '#f59e0b'; // Amber
      default:
        return '#10b981'; // Emerald/Green
    }
  };

  return (
    <div className={`glass-card ${action.completed ? 'completed-card' : ''}`} style={{
      position: 'relative',
      borderLeft: `4px solid ${action.completed ? 'var(--primary)' : getImpactColor(action.impact)}`,
      opacity: action.completed ? 0.85 : 1,
      transition: 'all 0.3s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <h3 style={{ 
          fontSize: '1.15rem', 
          fontWeight: 600, 
          textDecoration: action.completed ? 'line-through' : 'none',
          color: action.completed ? 'var(--text-muted)' : 'var(--text-primary)'
        }}>
          {action.title}
        </h3>
        <button 
          onClick={() => onToggle(action.id)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: action.completed ? 'var(--primary)' : 'var(--text-muted)',
            transition: 'color 0.2s ease'
          }}
        >
          {action.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
        </button>
      </div>
      
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        {action.description}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ 
          fontSize: '0.8rem', 
          fontWeight: 600, 
          textTransform: 'uppercase',
          padding: '4px 8px',
          borderRadius: '4px',
          background: 'rgba(255, 255, 255, 0.05)',
          color: getImpactColor(action.impact)
        }}>
          {action.impact} Impact
        </span>
        <span style={{ 
          fontSize: '0.9rem', 
          fontWeight: 600, 
          color: 'var(--secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Trophy size={14} />
          -{action.reductionAmount} kg CO2/yr
        </span>
      </div>
    </div>
  );
};
