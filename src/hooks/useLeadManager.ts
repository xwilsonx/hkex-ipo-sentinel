import { useState } from 'react';
import { Lead, RelationshipManager } from '../types';

export const useLeadManager = (initialLeads: Lead[]) => {
  // Initialize state with sorted leads
  const [leadState, setLeadState] = useState<Lead[]>(() => {
    // Sort by match score ascending (lowest score = best opportunity/cleanest lead)
    return [...initialLeads].sort((a, b) => (a.matchScore ?? 100) - (b.matchScore ?? 100));
  });

  const [assigningLeadId, setAssigningLeadId] = useState<string | null>(null);
  const [postingStatus, setPostingStatus] = useState<'idle' | 'posting' | 'complete'>('idle');

  // Business Logic: Determine if a lead can be worked on
  const isLeadActionable = (lead: Lead) => {
    const score = lead.matchScore || 0;
    // Lead is actionable only if match score is <= 5% and no client key exists
    return score <= 5 && !lead.clientKey;
  };

  const startAssignment = (id: string) => {
    setAssigningLeadId(id);
    setPostingStatus('idle');
  };

  const cancelAssignment = () => {
    if (postingStatus === 'idle') {
      setAssigningLeadId(null);
    }
  };

  const completeAssignment = (rm: RelationshipManager) => {
    if (!assigningLeadId) return;

    setPostingStatus('posting');

    setTimeout(() => {
      setPostingStatus('complete');
      
      setTimeout(() => {
        setLeadState(prev => prev.map(l => 
          l.id === assigningLeadId 
            ? { ...l, status: 'Assigned', assignedTo: rm.name } 
            : l
        ));
        setAssigningLeadId(null);
        setPostingStatus('idle');
      }, 1000);
    }, 1000);
  };

  return {
    leads: leadState,
    assigningLeadId,
    postingStatus,
    isLeadActionable,
    startAssignment,
    cancelAssignment,
    completeAssignment
  };
};