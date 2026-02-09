import React from 'react';
import { Lead, RelationshipManager } from '../types';
import { useLeadManager } from '../hooks/useLeadManager';

interface LeadScreeningProps {
  leads: Lead[];
  onBack: () => void;
}

const TEAM_MEMBERS: RelationshipManager[] = [
  { id: 'rm1', name: 'Sarah Lee', initials: 'SL' },
  { id: 'rm2', name: 'David Wong', initials: 'DW' },
  { id: 'rm3', name: 'Jessica Chen', initials: 'JC' },
  { id: 'rm4', name: 'Robert Taylor', initials: 'RT' },
  { id: 'rm5', name: 'Wei Zhang', initials: 'WZ' },
];

const LeadScreening: React.FC<LeadScreeningProps> = ({ leads: initialLeads, onBack }) => {
  // Use Custom Hook for Logic
  const { 
    leads, 
    assigningLeadId, 
    postingStatus, 
    isLeadActionable, 
    startAssignment, 
    cancelAssignment, 
    completeAssignment 
  } = useLeadManager(initialLeads);

  // Helper for UI Badge logic (Presentational only)
  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'High': return 'text-[#db0011] bg-red-50 border-red-100 border';
      case 'Medium': return 'text-amber-700 bg-amber-50 border-amber-100 border';
      default: return 'text-emerald-700 bg-emerald-50 border-emerald-100 border';
    }
  };

  return (
    <div className="space-y-6 animate-slide-up relative pb-20">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6 md:mb-8">
        <button 
          onClick={onBack}
          className="p-3 bg-white text-[#595959] hover:text-[#db0011] hover:bg-gray-50 transition-all border border-gray-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-xl md:text-2xl font-light text-[#2d2d2d]">Generated <span className="font-bold">Opportunities</span></h2>
          <p className="text-[#595959] text-xs md:text-sm font-medium">Screening for New-to-Bank (NTB) prospects. Sorted by match confidence.</p>
        </div>
      </div>

      <div className="corporate-card overflow-hidden min-h-[400px]">
        {/* Table Header - Hidden on Mobile */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-5 bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-[#2d2d2d] uppercase tracking-wider">
          <div className="col-span-3">Prospect Profile</div>
          <div className="col-span-2">Match Check (ETB)</div>
          <div className="col-span-2">Est. Worth</div>
          <div className="col-span-1">Priority</div>
          <div className="col-span-2">AI Rationale</div>
          <div className="col-span-2 text-right">Workflow</div>
        </div>

        {/* List Items */}
        <div className="divide-y divide-gray-100">
          {leads.map((lead) => {
            const isActionable = isLeadActionable(lead);
            const isETB = !!lead.clientKey;
            
            return (
              <div 
                key={lead.id} 
                className={`flex flex-col md:grid md:grid-cols-12 gap-4 p-5 items-start md:items-center transition-colors group relative
                  ${!isActionable ? 'bg-gray-50/80 grayscale-[0.3]' : 'bg-white hover:bg-gray-50 border-l-4 border-l-[#db0011]'}
                `}
              >
                {/* Mobile: Top Row with Avatar, Name, Priority */}
                <div className="md:col-span-3 w-full flex flex-col justify-center">
                  <div className="flex items-center w-full">
                    <div className={`h-10 w-10 text-white flex items-center justify-center font-bold mr-4 text-xs shrink-0
                       ${!isActionable ? 'bg-gray-400' : 'bg-[#2d2d2d]'}
                    `}>
                      {lead.name.split(' ').map(n => n[0]).join('').substring(0,2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className={`font-bold ${!isActionable ? 'text-gray-500' : 'text-[#2d2d2d]'}`}>
                           {lead.name}
                        </div>
                        {isETB && (
                           <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-gray-200 text-gray-600 uppercase tracking-tight">
                             Client Found
                           </span>
                        )}
                      </div>
                      <div className="text-xs text-[#595959] font-medium">{lead.role}</div>
                    </div>
                  </div>
                  {/* Client Key Display for ETB */}
                  {lead.clientKey && (
                     <div className="mt-1 ml-14 text-[10px] text-gray-400 font-mono tracking-tighter">
                        Key: {lead.clientKey}
                     </div>
                  )}
                </div>

                {/* Match Score (ETB Probability) */}
                <div className="md:col-span-2 text-sm text-[#2d2d2d] font-medium w-full flex flex-col gap-1">
                  <div className="flex items-center gap-2 mb-1 md:mb-0">
                    <span className="md:hidden text-xs text-[#999] uppercase font-bold mr-2">Conflict:</span>
                    <div className="flex items-center w-full max-w-[120px]">
                      {/* Custom Match Meter */}
                      {lead.matchScore !== undefined ? (
                         <div className="flex flex-col w-full">
                            <div className="flex justify-between text-[10px] mb-0.5">
                               <span className={isActionable ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                                  {lead.matchScore}% Match
                               </span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                               <div 
                                  className={`h-full rounded-full ${isActionable ? 'bg-green-500' : 'bg-red-500'}`} 
                                  style={{width: `${Math.min(lead.matchScore, 100)}%`}}
                               ></div>
                            </div>
                            <span className="text-[9px] text-gray-400 leading-tight mt-0.5">
                               {isActionable ? 'New Client (Verified)' : 'Existing Database Match'}
                            </span>
                         </div>
                      ) : (
                        <span className="text-[10px] text-gray-400">N/A</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                     <span className="md:hidden text-xs text-[#999] uppercase font-bold mr-2">Target:</span>
                     <span className={`truncate text-xs ${!isActionable ? 'text-gray-400' : 'text-[#595959]'}`}>{lead.targetCompany}</span>
                  </div>
                </div>

                {/* Net Worth */}
                <div className="md:col-span-2 w-full flex justify-between md:block">
                  <span className="md:hidden text-xs text-[#999] uppercase font-bold mr-2">Worth:</span>
                  <span className={`font-mono text-xs font-semibold px-2 py-1 border inline-block
                    ${!isActionable ? 'bg-gray-50 text-gray-400 border-gray-100' : 'bg-gray-100 text-[#2d2d2d] border-gray-200'}
                  `}>
                    {lead.netWorthEstimate}
                  </span>
                </div>

                {/* Desktop Priority Badge */}
                <div className="hidden md:block col-span-1">
                  {isActionable ? (
                     <span className={`px-2.5 py-1 text-[10px] font-bold ${getPriorityBadge(lead.priority)} uppercase`}>
                       {lead.priority}
                     </span>
                  ) : (
                    <span className="text-[10px] text-gray-400 font-bold uppercase">--</span>
                  )}
                </div>
                
                {/* Mobile Priority Badge */}
                <div className="md:hidden w-full flex justify-between items-center my-2">
                   <span className="text-xs text-[#999] uppercase font-bold mr-2">Priority:</span>
                   {isActionable ? (
                      <span className={`px-2.5 py-1 text-[10px] font-bold ${getPriorityBadge(lead.priority)} uppercase`}>
                         {lead.priority}
                      </span>
                   ) : (
                     <span className="text-[10px] text-gray-400">--</span>
                   )}
                </div>

                {/* Rationale */}
                <div className={`md:col-span-2 text-xs leading-relaxed md:line-clamp-2 font-medium w-full
                   ${!isActionable ? 'text-gray-400' : 'text-[#595959]'}
                `}>
                  <span className="md:hidden block text-xs text-[#999] uppercase font-bold mb-1">Rationale:</span>
                  {lead.rationale}
                </div>

                {/* Actions */}
                <div className="md:col-span-2 w-full flex justify-end mt-2 md:mt-0">
                  {lead.status === 'New' ? (
                    isActionable ? (
                      <button 
                        onClick={(e) => { e.stopPropagation(); startAssignment(lead.id); }}
                        className="w-full md:w-auto px-4 py-2 bg-[#2d2d2d] text-white text-xs font-bold hover:bg-[#db0011] transform transition-all shadow-sm"
                      >
                        Assign
                      </button>
                    ) : (
                      <div className="flex flex-col items-end">
                         <button 
                           disabled
                           className="w-full md:w-auto px-4 py-2 bg-gray-100 text-gray-400 text-xs font-bold border border-gray-200 cursor-not-allowed"
                         >
                           {isETB ? 'Existing Client' : 'Potential Match'}
                         </button>
                      </div>
                    )
                  ) : (
                     <div className="flex items-center md:flex-col md:items-end animate-fade-in w-full md:w-auto justify-between md:justify-end">
                       <span className="px-3 py-1 bg-gray-100 text-[#2d2d2d] border border-gray-200 text-[10px] font-bold uppercase flex items-center mb-0 md:mb-1">
                         <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                         </svg>
                         Assigned
                       </span>
                       <span className="text-[10px] text-[#595959] font-semibold ml-2 md:ml-0">
                         RM: {lead.assignedTo}
                       </span>
                     </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assignment Modal */}
      {assigningLeadId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-[#2d2d2d]/60 backdrop-blur-sm transition-opacity"
            onClick={cancelAssignment}
          ></div>
          <div className="relative bg-white shadow-2xl w-full max-w-md overflow-hidden animate-slide-up border border-gray-300">
            
            {postingStatus === 'idle' ? (
              <>
                <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                  <h3 className="text-lg font-bold text-[#2d2d2d]">Select Relationship Manager</h3>
                  <button onClick={cancelAssignment} className="text-gray-400 hover:text-[#db0011] transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="p-0 max-h-[400px] overflow-y-auto custom-scrollbar">
                  <div className="divide-y divide-gray-100">
                    {TEAM_MEMBERS.map(rm => (
                      <button
                        key={rm.id}
                        onClick={() => completeAssignment(rm)}
                        className="w-full flex items-center p-4 hover:bg-gray-50 transition-all group text-left"
                      >
                        <div className="h-10 w-10 bg-[#f5f5f5] text-[#2d2d2d] border border-gray-200 flex items-center justify-center font-bold text-sm mr-4 group-hover:bg-[#db0011] group-hover:text-white transition-colors">
                          {rm.initials}
                        </div>
                        <div>
                          <div className="font-bold text-[#2d2d2d] group-hover:text-[#db0011]">{rm.name}</div>
                          <div className="text-xs text-[#595959] font-medium">Private Banking Team</div>
                        </div>
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-6 h-6 border border-[#db0011] bg-white flex items-center justify-center">
                                <svg className="w-3.5 h-3.5 text-[#db0011]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
                  <button 
                    onClick={cancelAssignment}
                    className="text-xs text-[#595959] hover:text-[#2d2d2d] font-bold uppercase tracking-wider transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="p-12 flex flex-col items-center justify-center text-center animate-fade-in">
                {postingStatus === 'posting' && (
                  <>
                     <div className="relative w-16 h-16 mb-6">
                       <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                       <div className="absolute inset-0 border-4 border-[#db0011] rounded-full border-t-transparent animate-spin"></div>
                     </div>
                     <h3 className="text-lg font-bold text-[#2d2d2d] mb-2">Posting Lead to MSD</h3>
                     <p className="text-sm text-[#595959]">Syncing with secure banking core...</p>
                  </>
                )}
                {postingStatus === 'complete' && (
                  <>
                     <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mb-6 animate-bounce-small text-green-700">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                     </div>
                     <h3 className="text-lg font-bold text-[#2d2d2d] mb-2">Assignment Complete</h3>
                     <p className="text-sm text-[#595959]">Lead successfully transferred.</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadScreening;