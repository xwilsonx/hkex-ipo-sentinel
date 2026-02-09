export interface IPOData {
  ticker: string;
  companyName: string;
  sector: string;
  listingDate: string;
  offeringSize: string;
  description: string;
  underwriters: string[];
}

export interface Lead {
  id: string;
  name: string;
  role: string;
  targetCompany: string;
  netWorthEstimate: string;
  rationale: string;
  status: 'New' | 'Assigned' | 'Contacted';
  priority: 'High' | 'Medium' | 'Low';
  assignedTo?: string; // Name of the RM assigned
  clientKey?: string; // Existing to Bank (ETB) Key, e.g., "HK-123456"
  matchScore?: number; // AI Confidence score 0-100
}

export interface RelationshipManager {
  id: string;
  name: string;
  initials: string;
}

export type ViewState = 'landing' | 'welcome' | 'ipo-list' | 'lead-screening';

export interface User {
  name: string;
  title: string;
  avatar: string;
}