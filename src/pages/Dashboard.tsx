import React from 'react';
import { Link } from 'react-router-dom';
import { useFootprint } from '../utils/FootprintContext';
import { ActionCard } from '../components/ActionCard';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { Award, Leaf, Zap, Car } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { calculatedEmissions, actions, toggleAction } = useFootprint();

  const totalEmissions = calculatedEmissions.total;
  const targetEmissions = 2000; // Target is ~2 tons CO2 per year globally for climate goals
  const isTargetAchieved = totalEmissions <= targetEmissions;

  const dataPie = [
    { name: 'Transport', value: calculatedEmissions.transport, color: '#06b6d4' }, // Teal
    { name: 'Diet', value: calculatedEmissions.diet, color: '#f59e0b' }, // Amber
    { name: 'Energy', value: calculatedEmissions.energy, color: '#10b981' } // Emerald
  ];

  // Benchmark comparison data
  const dataCompare = [
    { name: 'Your Footprint', value: totalEmissions, color: 'var(--primary)' },
    { name: 'US Average', value: 16000, color: 'rgba(255, 255, 255, 0.1)' },
    { name: 'Global Average', value: 4700, color: 'rgba(255, 255, 255, 0.2)' },
    { name: 'Climate Target', value: 2000, color: 'var(--secondary)' }
  ];

  // Equivalencies
  const treesNeeded = Math.round(totalEmissions / 22); // A tree absorbs ~22kg of CO2 per year

  // Filter actions to recommend
  const activeActions = actions.filter(a => !a.completed).slice(0, 3);
  const completedActions = actions.filter(a => a.completed);
  const totalSavings = completedActions.reduce((acc, curr) => acc + curr.reductionAmount, 0);

  return (
    <div className="container">
      {/* Hero Header */}
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>
            Your Carbon Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Track, understand, and offset your personal environmental impact.
          </p>
        </div>
        <Link to="/calculator" className="btn-primary" aria-label="Go to calculator to update your data">
          <Leaf size={18} aria-hidden="true" /> Update Calculator
        </Link>
      </header>

      {/* Main Grid */}
      <div className="grid-2" style={{ marginBottom: '32px' }}>
        
        {/* Footprint Overview Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Leaf style={{ color: 'var(--primary)' }} /> Personal Carbon Footprint
            </h2>
            <div style={{ margin: '30px 0', textAlign: 'center' }}>
              <span aria-label={`${(totalEmissions / 1000).toFixed(1)} tons of CO2 equivalent per year`} style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                {(totalEmissions / 1000).toFixed(1)}
              </span>
              <span aria-hidden="true" style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginLeft: '8px' }}>
                tons CO2e / year
              </span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
              <span style={{ fontWeight: 600, color: isTargetAchieved ? 'var(--success)' : 'var(--accent)' }}>
                {isTargetAchieved ? 'Eco-Champion (Under Goal)' : 'Above Target Goal'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Saved through actions:</span>
              <span style={{ fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Award size={16} /> {totalSavings} kg CO2e / yr
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown Chart Card */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '20px' }}>
            Emissions Breakdown
          </h2>
          <div style={{ height: '220px', width: '100%' }} role="img" aria-label={`Pie chart: Transport ${Math.round((calculatedEmissions.transport / (totalEmissions || 1)) * 100)}%, Diet ${Math.round((calculatedEmissions.diet / (totalEmissions || 1)) * 100)}%, Energy ${Math.round((calculatedEmissions.energy / (totalEmissions || 1)) * 100)}%`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px' }}>
            {dataPie.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: item.color }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {item.name}: {Math.round((item.value / (totalEmissions || 1)) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Comparisons & Equivalency Cards */}
      <section aria-labelledby="equivalencies-heading" style={{ marginBottom: '48px' }}>
        <h2 id="equivalencies-heading" style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '24px' }}>
          Environmental Equivalencies
        </h2>
        <div className="grid-3">
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '16px', borderRadius: '12px' }} aria-hidden="true">
              <Leaf size={32} style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Annual Trees Needed to Offset</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{treesNeeded} mature trees</h3>
            </div>
          </div>
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(6, 182, 212, 0.1)', padding: '16px', borderRadius: '12px' }} aria-hidden="true">
              <Car size={32} style={{ color: 'var(--secondary)' }} />
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Equal Driving Distance</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{Math.round(totalEmissions / 0.18).toLocaleString()} km</h3>
            </div>
          </div>
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '16px', borderRadius: '12px' }} aria-hidden="true">
              <Zap size={32} style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Smartphone Charges</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{Math.round(totalEmissions * 122).toLocaleString()} charges</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Comparisons with Benchmarks & Actions Grid */}
      <div className="grid-2" style={{ marginBottom: '32px' }}>
        
        {/* Global Comparison Chart */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '20px' }}>
            How You Compare
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
            Comparison against regional statistics and global sustainability targets.
          </p>
          <div style={{ height: '240px', width: '100%' }} role="img" aria-label="Bar chart comparing your footprint to US Average 16000 kg, Global Average 4700 kg, and Climate Target 2000 kg CO2 per year">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataCompare} layout="vertical" margin={{ left: 20, right: 20 }}>
                <XAxis type="number" stroke="var(--text-muted)" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={12} width={100} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }}
                  contentStyle={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {dataCompare.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recommended Actions Panel */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award style={{ color: 'var(--accent)' }} /> Recommended Actions
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
            Complete simple tasks to reduce your footprint and earn points.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1 }}>
            {activeActions.length > 0 ? (
              activeActions.map(action => (
                <ActionCard 
                  key={action.id} 
                  action={action} 
                  onToggle={toggleAction} 
                />
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                <p style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '8px' }}>🎉 All actions completed!</p>
                <p style={{ fontSize: '0.9rem' }}>You've optimized all your active daily habits.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
