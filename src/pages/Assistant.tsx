import React, { useState, useRef, useEffect } from 'react';
import { useFootprint } from '../utils/FootprintContext';
import { Send, Sparkles, Trash2, User, Bot } from 'lucide-react';

export const Assistant: React.FC = () => {
  const { data, calculatedEmissions, chatHistory, addChatMessage, clearHistory } = useFootprint();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when chat updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  const generateContextualResponse = (query: string): string => {
    const q = query.toLowerCase();
    
    // Analyze user's current metrics
    const total = calculatedEmissions.total;
    const trans = calculatedEmissions.transport;
    const diet = calculatedEmissions.diet;
    const energy = calculatedEmissions.energy;
    
    // Identify highest footprint area
    let highestArea = 'transport';
    let highestValue = trans;
    if (diet > highestValue) {
      highestArea = 'diet';
      highestValue = diet;
    }
    if (energy > highestValue) {
      highestArea = 'energy';
      highestValue = energy;
    }

    // Context summary helper
    const contextSummary = `Based on your profile: Transport (${trans} kg CO2/yr, ${data.transport.mode} mode), Diet (${diet} kg CO2/yr, ${data.diet.type} type), and Energy (${energy} kg CO2/yr).`;

    // 1. Specific queries about data
    if (q.includes('my footprint') || q.includes('total') || q.includes('how much co2')) {
      return `Your total carbon footprint is estimated at ${(total / 1000).toFixed(2)} metric tons of CO2e per year. Here's your breakdown:\n- Transport: ${trans} kg\n- Diet: ${diet} kg\n- Energy: ${energy} kg\n\nYour highest source of emissions is ${highestArea}. Would you like tips to reduce it?`;
    }

    // 2. Transport advice
    if (q.includes('transport') || q.includes('car') || q.includes('drive') || q.includes('commute')) {
      if (data.transport.mode === 'car') {
        return `I see you commute ${data.transport.distance} km/week using a Gasoline Car, emitting ${trans} kg CO2 annually. Changing some habits can yield huge savings:\n1. Carpooling or switching to public transit could cut these emissions by up to 70%.\n2. Consider upgrading to an Electric Vehicle (EV) in the future to reduce this to about ${Math.round(data.transport.distance * 52 * 0.05)} kg CO2/yr.\n3. For short trips, cycling or walking has a zero-carbon footprint.`;
      }
      if (data.transport.mode === 'ev') {
        return `Great job driving an Electric Vehicle! You emit only about ${trans} kg CO2/yr from transit. To optimize further:\n1. Ensure your vehicle is charged using renewable/solar electricity.\n2. Practice eco-driving (smooth acceleration and braking) to save battery energy.`;
      }
      return `You travel ${data.transport.distance} km/week via ${data.transport.mode}. This is a relatively low-impact transport choice! To minimize further, check if you can walk/bike more often.`;
    }

    // 3. Diet advice
    if (q.includes('diet') || q.includes('food') || q.includes('eat') || q.includes('meat') || q.includes('vegan')) {
      if (data.diet.type === 'heavy-meat') {
        return `Your heavy-meat diet accounts for ${diet} kg CO2/yr. Livestock production is resource-intensive. Try these steps:\n1. Introduce 'Meatless Mondays'—replacing beef/pork with poultry or vegetarian meals once a week saves ~350 kg CO2/yr.\n2. A fully vegetarian diet would reduce your food emissions to ~1,200 kg CO2/yr (a 58% drop).\n3. Reduce food waste, which accounts for 8% of global greenhouse emissions.`;
      }
      if (data.diet.type === 'balanced') {
        return `Your balanced diet accounts for ${diet} kg CO2/yr. You can optimize this by:\n1. Incorporating more plant-based meals weekly.\n2. Sourcing local and seasonal produce to minimize food miles.\n3. Reducing dairy consumption (cheese has a high carbon density).`;
      }
      return `Awesome! Having a ${data.diet.type} diet is fantastic. Your annual emissions from food are just ${diet} kg CO2. To optimize further, focus on composting organic waste to prevent landfill methane emissions.`;
    }

    // 4. Energy advice
    if (q.includes('energy') || q.includes('electricity') || q.includes('power') || q.includes('bill')) {
      let response = `Your home energy usage emissions are ${energy} kg CO2/yr based on ${data.energy.electricity} kWh/month. `;
      if (data.energy.renewable) {
        response += `Since your home uses renewable energy, your net carbon impact is already very low! Keep optimizing by:\n1. Upgrading to energy-efficient appliances (look for ENERGY STAR ratings).\n2. Using a smart thermostat to reduce heating/cooling waste.`;
      } else {
        response += `To reduce your home energy footprint:\n1. Consider signing up for a green energy utility option if available. This reduces your home energy emissions by up to 85%!\n2. Replace old lighting with LED bulbs (saves ~150 kg CO2/yr).\n3. Install smart power strips to eliminate 'vampire load' from electronics.`;
      }
      return response;
    }

    // 5. Help / Greeting / General
    if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('help')) {
      return `Hello! I can help you analyze your carbon footprint and plan reductions. Try asking me:\n- "How can I reduce my transport emissions?"\n- "What's the carbon impact of my diet?"\n- "Show me my current footprint breakdown."`;
    }

    // 6. Generic Fallback incorporating the specific context
    return `Interesting question! ${contextSummary} To lower this, the best next step is addressing your ${highestArea} footprint. Let me know if you want detailed suggestions on transportation, green energy, or sustainable dietary shifts!`;
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    addChatMessage('user', userMessage);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const responseText = generateContextualResponse(userMessage);
      addChatMessage('assistant', responseText);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="container" style={{ maxWidth: '800px', height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles style={{ color: 'var(--primary)' }} /> Eco-Assistant
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Get custom tips based on your calculator metrics.
          </p>
        </div>
        <button 
          onClick={clearHistory}
          className="btn-secondary" 
          style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
          title="Clear Chat Logs"
        >
          <Trash2 size={14} /> Clear Chat
        </button>
      </header>

      {/* Chat Area */}
      <div className="glass-card" style={{ 
        flexGrow: 1, 
        overflowY: 'auto', 
        marginBottom: '20px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '20px',
        padding: '24px',
        borderRadius: '16px'
      }}>
        {chatHistory.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div 
              key={msg.id} 
              style={{
                display: 'flex',
                gap: '12px',
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                flexDirection: isUser ? 'row-reverse' : 'row'
              }}
            >
              {/* Avatar */}
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: isUser ? 'var(--secondary)' : 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {isUser ? <User size={18} /> : <Bot size={18} />}
              </div>

              {/* Message Bubble */}
              <div className="chat-bubble" style={{
                background: isUser ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${isUser ? 'rgba(6, 182, 212, 0.2)' : 'var(--border-color)'}`,
                padding: '12px 16px',
                borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                whiteSpace: 'pre-wrap',
                fontSize: '0.95rem',
                lineHeight: 1.5
              }}>
                {msg.text}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot size={18} />
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              padding: '12px 16px',
              borderRadius: '4px 16px 16px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span className="dot-pulse" style={{ backgroundColor: 'var(--text-secondary)' }} />
              <span className="dot-pulse" style={{ backgroundColor: 'var(--text-secondary)', animationDelay: '0.2s' }} />
              <span className="dot-pulse" style={{ backgroundColor: 'var(--text-secondary)', animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px' }}>
        <input
          type="text"
          className="form-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your transport emissions, diet advice, energy efficiency..."
          disabled={isTyping}
          style={{ flexGrow: 1 }}
        />
        <button type="submit" className="btn-primary" disabled={isTyping || !input.trim()}>
          <Send size={18} />
        </button>
      </form>

      {/* Typing animation style */}
      <style>{`
        .dot-pulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
          animation: pulse 1s infinite ease-in-out;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
