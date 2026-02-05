import { renderHook, act } from '@testing-library/react';
import { useLeadManager } from './useLeadManager';
import { Lead, RelationshipManager } from '../types';
import { describe, it, expect, vi } from 'vitest';

const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    name: 'High Match Client',
    role: 'CEO',
    targetCompany: 'Test Co',
    netWorthEstimate: '$10M',
    rationale: 'Test',
    status: 'New',
    priority: 'High',
    matchScore: 95,
    clientKey: 'EXISTING'
  },
  {
    id: '2',
    name: 'Perfect Opportunity',
    role: 'Founder',
    targetCompany: 'Test Co',
    netWorthEstimate: '$10M',
    rationale: 'Test',
    status: 'New',
    priority: 'High',
    matchScore: 2
  },
  {
    id: '3',
    name: 'Borderline Case',
    role: 'Director',
    targetCompany: 'Test Co',
    netWorthEstimate: '$10M',
    rationale: 'Test',
    status: 'New',
    priority: 'Medium',
    matchScore: 10 // > 5% but no key
  }
];

const MOCK_RM: RelationshipManager = { id: 'rm1', name: 'Test RM', initials: 'TR' };

describe('useLeadManager', () => {
  it('should sort leads by match score ascending on initialization', () => {
    const { result } = renderHook(() => useLeadManager(MOCK_LEADS));
    
    // Index 0 should be the lowest score (2%)
    expect(result.current.leads[0].id).toBe('2');
    // Index 1 should be the next lowest (10%)
    expect(result.current.leads[1].id).toBe('3');
    // Index 2 should be the highest (95%)
    expect(result.current.leads[2].id).toBe('1');
  });

  it('should correctly identify actionable leads', () => {
    const { result } = renderHook(() => useLeadManager(MOCK_LEADS));
    const { isLeadActionable } = result.current;

    // Score 2% -> Actionable
    expect(isLeadActionable(MOCK_LEADS[1])).toBe(true);
    
    // Score 95% + Key -> Not Actionable
    expect(isLeadActionable(MOCK_LEADS[0])).toBe(false);

    // Score 10% -> Not Actionable (Must be <= 5%)
    expect(isLeadActionable(MOCK_LEADS[2])).toBe(false);
  });

  it('should handle lead assignment workflow', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useLeadManager(MOCK_LEADS));

    // Start assignment
    act(() => {
      result.current.startAssignment('2');
    });
    expect(result.current.assigningLeadId).toBe('2');

    // Complete assignment
    act(() => {
      result.current.completeAssignment(MOCK_RM);
    });
    
    // Fast forward first delay (Posting)
    expect(result.current.postingStatus).toBe('posting');
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    // Fast forward second delay (Completion)
    expect(result.current.postingStatus).toBe('complete');
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Final state
    expect(result.current.postingStatus).toBe('idle');
    expect(result.current.assigningLeadId).toBeNull();
    
    // Check if lead was updated in state
    const assignedLead = result.current.leads.find(l => l.id === '2');
    expect(assignedLead?.status).toBe('Assigned');
    expect(assignedLead?.assignedTo).toBe('Test RM');

    vi.useRealTimers();
  });
});
