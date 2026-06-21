import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import React from 'react';

const ProblemChild = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  it('catches errors and displays fallback UI', () => {
    // Suppress console.error for this test
    const spy = vi.spyOn(console, 'error');
    spy.mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();

    spy.mockRestore();
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>All good</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('All good')).toBeInTheDocument();
  });
  
  it('reloads page on button click', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock window.location.reload
    const originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { reload: vi.fn() }
    });

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /reload page/i }));
    expect(window.location.reload).toHaveBeenCalled();

    window.location = originalLocation;
    spy.mockRestore();
  });
});
