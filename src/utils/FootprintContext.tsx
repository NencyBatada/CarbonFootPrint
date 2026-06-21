import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { calculateEmissions } from './calculations';

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
      const parsed = JSON.parse(saved) as Array<Omit<ChatMessage, 'timestamp'> & { timestamp: string }>;
      return parsed.map((msg) => ({
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

  const updateData = useCallback((newData: Partial<FootprintData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  }, []);

  // Delegated to the pure, testable calculateEmissions utility

  const toggleAction = useCallback((id: string) => {
    setActions((prev) =>
      prev.map((act) => (act.id === id ? { ...act, completed: !act.completed } : act))
    );
  }, []);

  const addChatMessage = useCallback((sender: 'user' | 'assistant', text: string) => {
    setChatHistory((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sender,
        text,
        timestamp: new Date()
      }
    ]);
  }, []);

  const clearHistory = useCallback(() => {
    setChatHistory([
      {
        id: 'welcome',
        sender: 'assistant',
        text: "Hello! Let's clean up your chat and restart our carbon reduction planning. How can I help you today?",
        timestamp: new Date()
      }
    ]);
  }, []);

  return (
    <FootprintContext.Provider
      value={{
        data,
        updateData,
        calculatedEmissions: calculateEmissions(data),
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
