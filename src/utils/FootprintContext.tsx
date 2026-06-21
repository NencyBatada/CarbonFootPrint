import React, { createContext, useContext, useState, useEffect } from 'react';

export interface FootprintData {
  transport: {
    mode: 'car' | 'ev' | 'transit' | 'bike';
    distance: number; // km per week
  };
  diet: {
    type: 'heavy-meat' | 'balanced' | 'vegetarian' | 'vegan';
  };
  energy: {
    electricity: number; // kWh per month
    renewable: boolean;
  };
}

export interface RecommendedAction {
  id: string;
  title: string;
  category: 'transport' | 'diet' | 'energy' | 'lifestyle';
  impact: 'high' | 'medium' | 'low';
  reductionAmount: number; // kg CO2 saved per year
  description: string;
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

interface FootprintContextType {
  data: FootprintData;
  updateData: (newData: Partial<FootprintData>) => void;
  calculatedEmissions: {
    transport: number; // kg CO2 / year
    diet: number; // kg CO2 / year
    energy: number; // kg CO2 / year
    total: number;
  };
  actions: RecommendedAction[];
  toggleAction: (id: string) => void;
  chatHistory: ChatMessage[];
  addChatMessage: (sender: 'user' | 'assistant', text: string) => void;
  clearHistory: () => void;
}

const defaultData: FootprintData = {
  transport: { mode: 'transit', distance: 100 },
  diet: { type: 'balanced' },
  energy: { electricity: 150, renewable: false }
};

const defaultActions: RecommendedAction[] = [
  {
    id: '1',
    title: 'Switch to public transport',
    category: 'transport',
    impact: 'high',
    reductionAmount: 800,
    description: 'Replacing car trips with public transit drastically reduces personal daily emissions.',
    completed: false
  },
  {
    id: '2',
    title: 'Adopt a Meatless Monday',
    category: 'diet',
    impact: 'medium',
    reductionAmount: 350,
    description: 'Going vegetarian just one day a week saves significant water and greenhouse gas emissions.',
    completed: false
  },
  {
    id: '3',
    title: 'Unplug idle electronics',
    category: 'energy',
    impact: 'low',
    reductionAmount: 80,
    description: 'Vampire power draws electricity even when devices are off. Switch off power strips.',
    completed: false
  },
  {
    id: '4',
    title: 'Switch to LED bulbs',
    category: 'energy',
    impact: 'medium',
    reductionAmount: 150,
    description: 'LEDs use 75% less energy and last 25 times longer than regular incandescent bulbs.',
    completed: false
  },
  {
    id: '5',
    title: 'Compost organic waste',
    category: 'lifestyle',
    impact: 'medium',
    reductionAmount: 120,
    description: 'Composting prevents food waste from producing methane in landfills.',
    completed: false
  }
];

const FootprintContext = createContext<FootprintContextType | undefined>(undefined);

export const FootprintProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<FootprintData>(() => {
    const saved = localStorage.getItem('carbon_footprint_data');
    return saved ? JSON.parse(saved) : defaultData;
  });

  const [actions, setActions] = useState<RecommendedAction[]>(() => {
    const saved = localStorage.getItem('carbon_actions');
    return saved ? JSON.parse(saved) : defaultActions;
  });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('carbon_chat_history');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    }
    return [
      {
        id: 'welcome',
        sender: 'assistant',
        text: 'Hello! I am your Eco-Assistant. Calculate your footprint in the calculator tab or ask me how to optimize your diet, transport, or energy habits!',
        timestamp: new Date()
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('carbon_footprint_data', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('carbon_actions', JSON.stringify(actions));
  }, [actions]);

  useEffect(() => {
    localStorage.setItem('carbon_chat_history', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const updateData = (newData: Partial<FootprintData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const calculateEmissions = () => {
    // 1. Transport calculations: CO2 emissions per year
    // Factors (kg CO2 per km): Car = 0.18, EV = 0.05, Transit = 0.04, Bike = 0
    let transFactor = 0.18;
    if (data.transport.mode === 'ev') transFactor = 0.05;
    else if (data.transport.mode === 'transit') transFactor = 0.04;
    else if (data.transport.mode === 'bike') transFactor = 0;
    
    const transportEmissions = data.transport.distance * 52 * transFactor;

    // 2. Diet calculations: CO2 emissions per year
    // Factors (kg CO2 per year): Heavy meat = 2900, Balanced = 1900, Veg = 1200, Vegan = 700
    let dietEmissions = 1900;
    if (data.diet.type === 'heavy-meat') dietEmissions = 2900;
    else if (data.diet.type === 'vegetarian') dietEmissions = 1200;
    else if (data.diet.type === 'vegan') dietEmissions = 700;

    // 3. Energy calculations: CO2 emissions per year
    // Factor: Average of 0.4 kg CO2 per kWh. If renewable, reduced by 85%
    const energyFactor = data.energy.renewable ? 0.06 : 0.4;
    const energyEmissions = data.energy.electricity * 12 * energyFactor;

    const total = transportEmissions + dietEmissions + energyEmissions;

    return {
      transport: Math.round(transportEmissions),
      diet: Math.round(dietEmissions),
      energy: Math.round(energyEmissions),
      total: Math.round(total)
    };
  };

  const toggleAction = (id: string) => {
    setActions((prev) =>
      prev.map((act) => (act.id === id ? { ...act, completed: !act.completed } : act))
    );
  };

  const addChatMessage = (sender: 'user' | 'assistant', text: string) => {
    setChatHistory((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        sender,
        text,
        timestamp: new Date()
      }
    ]);
  };

  const clearHistory = () => {
    setChatHistory([
      {
        id: 'welcome',
        sender: 'assistant',
        text: 'Hello! Let\'s clean up your chat and restart our carbon reduction planning. How can I help you today?',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <FootprintContext.Provider
      value={{
        data,
        updateData,
        calculatedEmissions: calculateEmissions(),
        actions,
        toggleAction,
        chatHistory,
        addChatMessage,
        clearHistory
      }}
    >
      {children}
    </FootprintContext.Provider>
  );
};

export const useFootprint = () => {
  const context = useContext(FootprintContext);
  if (!context) {
    throw new Error('useFootprint must be used within a FootprintProvider');
  }
  return context;
};
