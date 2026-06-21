import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Assistant } from '../pages/Assistant';
import { FootprintProvider } from '../utils/FootprintContext';
import React from 'react';

vi.useFakeTimers();

describe('Assistant Component (Integration)', () => {
  it('generates responses based on user input', async () => {
    render(
      <FootprintProvider>
        <Assistant />
      </FootprintProvider>
    );

    // Initial message from context
    expect(screen.getByText(/Hello! I am your Eco-Assistant/)).toBeInTheDocument();

    const input = screen.getByRole('textbox');
    const sendBtn = screen.getByRole('button', { name: /send/i });

    // Send generic question
    fireEvent.change(input, { target: { value: 'help' } });
    fireEvent.click(sendBtn);

    act(() => {
      vi.advanceTimersByTime(1100);
    });

    // Check if the response includes the help text
    expect(screen.getByText(/How can I reduce my transport emissions/i)).toBeInTheDocument();

    // Ask about transport
    fireEvent.change(input, { target: { value: 'transport' } });
    fireEvent.click(sendBtn);
    act(() => {
      vi.advanceTimersByTime(1100);
    });
    expect(screen.getByText(/You travel 100 km\/week via transit/i)).toBeInTheDocument();

    // Ask about diet
    fireEvent.change(input, { target: { value: 'diet' } });
    fireEvent.click(sendBtn);
    act(() => {
      vi.advanceTimersByTime(1100);
    });
    expect(screen.getByText(/Your balanced diet accounts for/i)).toBeInTheDocument();

    // Ask about energy
    fireEvent.change(input, { target: { value: 'energy' } });
    fireEvent.click(sendBtn);
    act(() => {
      vi.advanceTimersByTime(1100);
    });
    expect(screen.getByText(/Your home energy usage emissions/i)).toBeInTheDocument();
    
    // Ask about footprint
    fireEvent.change(input, { target: { value: 'my footprint' } });
    fireEvent.click(sendBtn);
    act(() => {
      vi.advanceTimersByTime(1100);
    });
    expect(screen.getByText(/Your total carbon footprint is estimated at/i)).toBeInTheDocument();
  });
});
