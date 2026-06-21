import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFootprint } from '../utils/FootprintContext';
import { Car, Utensils, Zap, ChevronRight, ChevronLeft, Check } from 'lucide-react';

export const Calculator: React.FC = () => {
  const { data, updateData } = useFootprint();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [transportMode, setTransportMode] = useState(data.transport.mode);
  const [distance, setDistance] = useState(data.transport.distance);
  const [dietType, setDietType] = useState(data.diet.type);
  const [electricity, setElectricity] = useState(data.energy.electricity);
  const [renewable, setRenewable] = useState(data.energy.renewable);

  const handleNext = () => {
    if (step < 3) setStep((prev) => (prev + 1) as 1 | 2 | 3);
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => (prev - 1) as 1 | 2 | 3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateData({
      transport: { mode: transportMode, distance },
      diet: { type: dietType },
      energy: { electricity, renewable },
    });
    navigate('/');
  };

  const stepLabels: Record<number, string> = { 1: 'Transport', 2: 'Diet', 3: 'Energy' };

  const renderStepIndicator = () => (
    <nav aria-label="Form progress" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
      {([1, 2, 3] as const).map((s, i, arr) => (
        <React.Fragment key={s}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              aria-current={step === s ? 'step' : undefined}
              aria-label={`Step ${s}: ${stepLabels[s]}${step > s ? ' (completed)' : step === s ? ' (current)' : ''}`}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: step >= s ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                border: step === s ? '2px solid #fff' : 'none',
              }}
            >
              {s}
            </span>
            <span style={{ fontSize: '0.9rem', color: step === s ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              {stepLabels[s]}
            </span>
          </div>
          {i < arr.length - 1 && (
            <div role="separator" style={{ width: '40px', height: '1px', backgroundColor: 'var(--border-color)' }} />
          )}
        </React.Fragment>
      ))}
    </nav>
  );

  return (
    <div className="container" style={{ maxWidth: '680px' }}>
      <header style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px' }}>
          Calculate Your Footprint
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Provide details about your daily lifestyle to estimate your impact.
        </p>
      </header>

      {renderStepIndicator()}

      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '32px' }} aria-label={`Step ${step} of 3: ${stepLabels[step]}`}>

        {/* Step 1: Transport */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Car style={{ color: 'var(--secondary)' }} aria-hidden="true" /> Transport Habits
            </h2>

            <div className="form-group">
              <label className="form-label" htmlFor="transport-mode">
                Primary Mode of Transport
              </label>
              <select
                id="transport-mode"
                className="form-select"
                value={transportMode}
                onChange={(e) => setTransportMode(e.target.value as typeof transportMode)}
              >
                <option value="car">Gasoline Car (Internal Combustion)</option>
                <option value="ev">Electric Vehicle (EV)</option>
                <option value="transit">Public Transit (Bus/Train)</option>
                <option value="bike">Bicycle / Walking</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '30px' }}>
              <label className="form-label" htmlFor="weekly-distance">
                Weekly Distance Traveled (km)
              </label>
              <input
                id="weekly-distance"
                type="number"
                min="0"
                className="form-input"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                placeholder="e.g. 150"
                required
                aria-describedby="distance-hint"
              />
              <span id="distance-hint" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                Average daily commute + weekend trips.
              </span>
            </div>
          </div>
        )}

        {/* Step 2: Diet */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Utensils style={{ color: 'var(--accent)' }} aria-hidden="true" /> Dietary Preferences
            </h2>

            <div className="form-group" style={{ marginBottom: '30px' }}>
              <label className="form-label" htmlFor="diet-type">
                Which best describes your diet?
              </label>
              <select
                id="diet-type"
                className="form-select"
                value={dietType}
                onChange={(e) => setDietType(e.target.value as typeof dietType)}
              >
                <option value="heavy-meat">Heavy Meat Eater (Daily beef/pork/poultry)</option>
                <option value="balanced">Balanced (Mix of meat, veggies, dairy)</option>
                <option value="vegetarian">Vegetarian (No meat, consumes dairy/eggs)</option>
                <option value="vegan">Vegan (Strictly plant-based)</option>
              </select>
              <span id="diet-hint" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>
                Red meat consumption has the highest agricultural greenhouse gas footprint.
              </span>
            </div>
          </div>
        )}

        {/* Step 3: Energy */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap style={{ color: 'var(--primary)' }} aria-hidden="true" /> Home Energy Usage
            </h2>

            <div className="form-group">
              <label className="form-label" htmlFor="electricity-usage">
                Monthly Electricity Consumption (kWh)
              </label>
              <input
                id="electricity-usage"
                type="number"
                min="0"
                className="form-input"
                value={electricity}
                onChange={(e) => setElectricity(Number(e.target.value))}
                placeholder="e.g. 250"
                required
                aria-describedby="electricity-hint"
              />
              <span id="electricity-hint" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                You can find this on your electricity bill.
              </span>
            </div>

            <div className="form-group" style={{ marginBottom: '30px' }}>
              <label
                className="form-label"
                htmlFor="renewable-energy"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <input
                  id="renewable-energy"
                  type="checkbox"
                  checked={renewable}
                  onChange={(e) => setRenewable(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                />
                My home is powered by renewable/green energy sources
              </label>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block', marginLeft: '26px' }}>
                Check this if you pay for a green electricity tariff or have solar panels.
              </span>
            </div>
          </div>
        )}

        {/* Button Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
          {step > 1 ? (
            <button type="button" onClick={handleBack} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ChevronLeft size={16} aria-hidden="true" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button type="button" onClick={handleNext} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              Next <ChevronRight size={16} aria-hidden="true" />
            </button>
          ) : (
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={16} aria-hidden="true" /> Complete &amp; Save
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
