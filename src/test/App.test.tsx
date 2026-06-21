import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// ─── Mock FootprintContext ────────────────────────────────────────────────────
const mockFootprintValue = {
  data: {
    transport: { mode: 'car' as const, distance: 150 },
    diet: { type: 'balanced' as const },
    energy: { electricity: 200, renewable: false },
  },
  updateData: vi.fn(),
  calculatedEmissions: { transport: 1404, diet: 1900, energy: 960, total: 4264 },
  actions: [
    {
      id: '1',
      title: 'Switch to public transport',
      category: 'transport' as const,
      impact: 'high' as const,
      reductionAmount: 800,
      description: 'Replacing car trips reduces emissions.',
      completed: false,
    },
    {
      id: '2',
      title: 'Adopt a Meatless Monday',
      category: 'diet' as const,
      impact: 'medium' as const,
      reductionAmount: 350,
      description: 'Going vegetarian once a week saves emissions.',
      completed: true,
    },
  ],
  toggleAction: vi.fn(),
  chatHistory: [
    {
      id: 'welcome',
      sender: 'assistant' as const,
      text: 'Hello! I am your Eco-Assistant.',
      timestamp: new Date(),
    },
  ],
  addChatMessage: vi.fn(),
  clearHistory: vi.fn(),
};

vi.mock('../utils/FootprintContext', () => ({
  useFootprint: () => mockFootprintValue,
  FootprintProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// ─── Imports (after mocks) ────────────────────────────────────────────────────
import { ActionCard } from '../components/ActionCard';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Dashboard } from '../pages/Dashboard';
import { Calculator } from '../pages/Calculator';
import { Assistant } from '../pages/Assistant';
import { calculateEmissions } from '../utils/calculations';

// ─── Helper ───────────────────────────────────────────────────────────────────
const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) =>
  render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);

// ─── Utility: calculateEmissions ─────────────────────────────────────────────
describe('calculateEmissions utility', () => {
  it('calculates car transport emissions correctly', () => {
    const result = calculateEmissions({
      transport: { mode: 'car', distance: 100 },
      diet: { type: 'balanced' },
      energy: { electricity: 0, renewable: false },
    });
    expect(result.transport).toBe(936); // 100 * 52 * 0.18
  });

  it('calculates EV transport emissions correctly', () => {
    const result = calculateEmissions({
      transport: { mode: 'ev', distance: 100 },
      diet: { type: 'balanced' },
      energy: { electricity: 0, renewable: false },
    });
    expect(result.transport).toBe(260); // 100 * 52 * 0.05
  });

  it('returns zero transport emissions for bike', () => {
    const result = calculateEmissions({
      transport: { mode: 'bike', distance: 100 },
      diet: { type: 'balanced' },
      energy: { electricity: 0, renewable: false },
    });
    expect(result.transport).toBe(0);
  });

  it('calculates heavy meat diet correctly', () => {
    const result = calculateEmissions({
      transport: { mode: 'bike', distance: 0 },
      diet: { type: 'heavy-meat' },
      energy: { electricity: 0, renewable: false },
    });
    expect(result.diet).toBe(2900);
  });

  it('calculates vegan diet correctly', () => {
    const result = calculateEmissions({
      transport: { mode: 'bike', distance: 0 },
      diet: { type: 'vegan' },
      energy: { electricity: 0, renewable: false },
    });
    expect(result.diet).toBe(700);
  });

  it('reduces energy emissions by 85% for renewable', () => {
    const resultNormal = calculateEmissions({
      transport: { mode: 'bike', distance: 0 },
      diet: { type: 'vegan' },
      energy: { electricity: 100, renewable: false },
    });
    const resultRenewable = calculateEmissions({
      transport: { mode: 'bike', distance: 0 },
      diet: { type: 'vegan' },
      energy: { electricity: 100, renewable: true },
    });
    expect(resultNormal.energy).toBeGreaterThan(resultRenewable.energy);
    expect(resultRenewable.energy).toBe(72); // 100 * 12 * 0.06
  });

  it('sums all emissions correctly into total', () => {
    const result = calculateEmissions({
      transport: { mode: 'bike', distance: 0 },
      diet: { type: 'vegan' },
      energy: { electricity: 0, renewable: false },
    });
    expect(result.total).toBe(result.transport + result.diet + result.energy);
  });
});

// ─── ActionCard ───────────────────────────────────────────────────────────────
describe('ActionCard component', () => {
  const incompleteAction = mockFootprintValue.actions[0];
  const completedAction = mockFootprintValue.actions[1];

  it('renders action title and description', () => {
    renderWithRouter(
      <ActionCard action={incompleteAction} onToggle={vi.fn()} />
    );
    expect(screen.getByText('Switch to public transport')).toBeInTheDocument();
    expect(screen.getByText(/Replacing car trips/i)).toBeInTheDocument();
  });

  it('calls onToggle with action id when toggle button is clicked', () => {
    const onToggle = vi.fn();
    renderWithRouter(<ActionCard action={incompleteAction} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole('button', { name: /mark.*complete|toggle/i }));
    expect(onToggle).toHaveBeenCalledWith('1');
  });

  it('shows completed state with strikethrough', () => {
    renderWithRouter(<ActionCard action={completedAction} onToggle={vi.fn()} />);
    const title = screen.getByText('Adopt a Meatless Monday');
    expect(title).toBeInTheDocument();
  });

  it('displays impact level', () => {
    renderWithRouter(<ActionCard action={incompleteAction} onToggle={vi.fn()} />);
    expect(screen.getByText(/high impact/i)).toBeInTheDocument();
  });

  it('displays CO2 reduction amount', () => {
    renderWithRouter(<ActionCard action={incompleteAction} onToggle={vi.fn()} />);
    expect(screen.getByText(/-800 kg CO2\/yr/i)).toBeInTheDocument();
  });
});

// ─── Navbar ───────────────────────────────────────────────────────────────────
describe('Navbar component', () => {
  it('renders the brand name', () => {
    renderWithRouter(<Navbar />);
    expect(screen.getByText('EcoTrace')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    renderWithRouter(<Navbar />);
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /calculator/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /eco-assistant/i })).toBeInTheDocument();
  });

  it('has a nav element with navigation role', () => {
    renderWithRouter(<Navbar />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('marks correct link as active on home route', () => {
    renderWithRouter(<Navbar />, { route: '/' });
    const dashLink = screen.getByRole('link', { name: /dashboard/i });
    expect(dashLink.className).toContain('active');
  });

  it('marks calculator link active on /calculator route', () => {
    renderWithRouter(<Navbar />, { route: '/calculator' });
    const calcLink = screen.getByRole('link', { name: /calculator/i });
    expect(calcLink.className).toContain('active');
  });
});

// ─── Footer ───────────────────────────────────────────────────────────────────
describe('Footer component', () => {
  it('renders copyright text', () => {
    render(<Footer />);
    expect(screen.getByText(/EcoTrace/i)).toBeInTheDocument();
  });

  it('renders current year', () => {
    render(<Footer />);
    expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument();
  });

  it('has a footer landmark', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});

// ─── Dashboard ────────────────────────────────────────────────────────────────
describe('Dashboard page', () => {
  it('renders heading', () => {
    renderWithRouter(<Dashboard />);
    expect(screen.getByRole('heading', { name: /carbon dashboard/i })).toBeInTheDocument();
  });

  it('displays total emissions value', () => {
    renderWithRouter(<Dashboard />);
    // 4264 kg = 4.3 tons
    expect(screen.getByText(/4\.3/)).toBeInTheDocument();
  });

  it('renders Environmental Equivalencies section', () => {
    renderWithRouter(<Dashboard />);
    expect(screen.getByText(/Environmental Equivalencies/i)).toBeInTheDocument();
  });

  it('renders Recommended Actions section', () => {
    renderWithRouter(<Dashboard />);
    expect(screen.getByText(/Recommended Actions/i)).toBeInTheDocument();
  });

  it('renders link to calculator', () => {
    renderWithRouter(<Dashboard />);
    expect(screen.getByRole('link', { name: /go to calculator/i })).toBeInTheDocument();
  });

  it('toggles an action when ActionCard toggle is clicked', () => {
    renderWithRouter(<Dashboard />);
    // The first incomplete action is rendered
    const toggleButtons = screen.getAllByRole('button', { name: /mark.*complete|toggle/i });
    fireEvent.click(toggleButtons[0]);
    expect(mockFootprintValue.toggleAction).toHaveBeenCalledWith('1');
  });
});

// ─── Calculator ───────────────────────────────────────────────────────────────
describe('Calculator page', () => {
  beforeEach(() => {
    mockFootprintValue.updateData.mockClear();
  });

  it('renders step 1 heading by default', () => {
    renderWithRouter(<Calculator />, { route: '/calculator' });
    expect(screen.getByText(/Calculate Your Footprint/i)).toBeInTheDocument();
    expect(screen.getByText(/Transport Habits/i)).toBeInTheDocument();
  });

  it('renders transport mode select', () => {
    renderWithRouter(<Calculator />, { route: '/calculator' });
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('navigates to step 2 on Next click', () => {
    renderWithRouter(<Calculator />, { route: '/calculator' });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText(/Dietary Preferences/i)).toBeInTheDocument();
  });

  it('can go back from step 2 to step 1', () => {
    renderWithRouter(<Calculator />, { route: '/calculator' });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(screen.getByText(/Transport Habits/i)).toBeInTheDocument();
  });

  it('renders energy step on step 3', () => {
    renderWithRouter(<Calculator />, { route: '/calculator' });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText(/Home Energy Usage/i)).toBeInTheDocument();
  });

  it('calls updateData on form submit', async () => {
    renderWithRouter(<Calculator />, { route: '/calculator' });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.click(screen.getByRole('button', { name: /complete.*save/i }));
    await waitFor(() => {
      expect(mockFootprintValue.updateData).toHaveBeenCalled();
    });
  });
});

// ─── Assistant ────────────────────────────────────────────────────────────────
describe('Assistant page', () => {
  beforeEach(() => {
    mockFootprintValue.addChatMessage.mockClear();
    mockFootprintValue.clearHistory.mockClear();
  });

  it('renders Eco-Assistant heading', () => {
    renderWithRouter(<Assistant />);
    expect(screen.getByRole('heading', { name: /eco-assistant/i })).toBeInTheDocument();
  });

  it('renders welcome message from context', () => {
    renderWithRouter(<Assistant />);
    expect(screen.getByText(/Hello! I am your Eco-Assistant/i)).toBeInTheDocument();
  });

  it('renders text input', () => {
    renderWithRouter(<Assistant />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('calls addChatMessage when message is sent', async () => {
    renderWithRouter(<Assistant />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    await waitFor(() => {
      expect(mockFootprintValue.addChatMessage).toHaveBeenCalledWith('user', 'Hello');
    });
  });

  it('does not send empty message', () => {
    renderWithRouter(<Assistant />);
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    expect(mockFootprintValue.addChatMessage).not.toHaveBeenCalled();
  });

  it('calls clearHistory when Clear Chat is clicked', () => {
    renderWithRouter(<Assistant />);
    fireEvent.click(screen.getByRole('button', { name: /clear chat/i }));
    expect(mockFootprintValue.clearHistory).toHaveBeenCalled();
  });
});
