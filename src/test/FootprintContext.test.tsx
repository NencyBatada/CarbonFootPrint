import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { FootprintProvider, useFootprint } from '../utils/FootprintContext';
import React from 'react';

describe('FootprintContext', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <FootprintProvider>{children}</FootprintProvider>
  );

  it('provides default data when localStorage is empty', () => {
    const { result } = renderHook(() => useFootprint(), { wrapper });
    expect(result.current.data.transport.mode).toBe('transit');
    expect(result.current.data.diet.type).toBe('balanced');
  });

  it('updates data correctly', () => {
    const { result } = renderHook(() => useFootprint(), { wrapper });
    
    act(() => {
      result.current.updateData({ transport: { mode: 'car', distance: 200 } });
    });

    expect(result.current.data.transport.mode).toBe('car');
    expect(result.current.data.transport.distance).toBe(200);
  });

  it('toggles actions correctly', () => {
    const { result } = renderHook(() => useFootprint(), { wrapper });
    
    act(() => {
      result.current.toggleAction('1');
    });

    expect(result.current.actions[0].completed).toBe(true);
    
    act(() => {
      result.current.toggleAction('1');
    });

    expect(result.current.actions[0].completed).toBe(false);
  });

  it('adds a chat message', () => {
    const { result } = renderHook(() => useFootprint(), { wrapper });
    
    act(() => {
      result.current.addChatMessage('user', 'Hello assistant');
    });

    expect(result.current.chatHistory.length).toBe(2); // welcome + new msg
    expect(result.current.chatHistory[1].text).toBe('Hello assistant');
  });

  it('clears chat history', () => {
    const { result } = renderHook(() => useFootprint(), { wrapper });
    
    act(() => {
      result.current.addChatMessage('user', 'Testing');
      result.current.clearHistory();
    });

    expect(result.current.chatHistory.length).toBe(1);
    expect(result.current.chatHistory[0].text).toContain('clean up your chat');
  });
});
