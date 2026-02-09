import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import IPOList from './components/IPOList';
import LeadScreening from './components/LeadScreening';
import WelcomeScreen from './components/WelcomeScreen';
import InteractiveBackground from './components/InteractiveBackground';
import { Layout } from './components/Layout';
import { ViewState, IPOData, Lead, User } from './types';
import { generateLeadsFromIPOs } from './services/geminiService';

const MOCK_USER: User = {
  name: 'Alex',
  title: 'Senior Relationship Manager',
  avatar: 'AL'
};

export const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [leads, setLeads] = useState<Lead[]>([]);
  // loadingStatus acts as both a boolean (if not empty) and the message string
  const [loadingStatus, setLoadingStatus] = useState<string>('');

  const handleLogin = () => {
    setView('welcome');
  };

  const handleWelcomeComplete = () => {
    setView('ipo-list');
  };

  const handleLogout = () => {
    setView('landing');
    setLeads([]);
  };

  const handleRunScreening = async (ipos: IPOData[]) => {
    // Step 1: Scanning (1.5s)
    setLoadingStatus('Scanning Filing Documents...');
    await new Promise(r => setTimeout(r, 1500));

    // Step 2: Analysis (1.5s)
    setLoadingStatus('Analyzing Shareholder Structures...');
    await new Promise(r => setTimeout(r, 1500));

    // Step 3: Database Matching (1.0s)
    setLoadingStatus('Matching ETB individual...');
    await new Promise(r => setTimeout(r, 1000));
    
    // Step 4: Generation (Service takes ~800ms internally)
    const generatedLeads = await generateLeadsFromIPOs(ipos);
    
    // Step 5: Result Notification (1.0s)
    setLoadingStatus(`Success: ${generatedLeads.length} Opportunities Identified`);
    await new Promise(r => setTimeout(r, 1000));

    // Transition
    setLeads(generatedLeads);
    setLoadingStatus('');
    setView('lead-screening');
  };

  // View Router
  const renderView = () => {
    switch (view) {
      case 'landing':
        return <LandingPage onLogin={handleLogin} />;
      case 'welcome':
        return <WelcomeScreen user={MOCK_USER} onComplete={handleWelcomeComplete} />;
      case 'ipo-list':
        return (
          <Layout user={MOCK_USER} onLogout={handleLogout} onNavigate={setView}>
            <IPOList 
              onRunScreening={handleRunScreening} 
              loadingStatus={loadingStatus} 
            />
          </Layout>
        );
      case 'lead-screening':
        return (
          <Layout user={MOCK_USER} onLogout={handleLogout} onNavigate={setView}>
             <LeadScreening 
               leads={leads} 
               onBack={() => setView('ipo-list')} 
             />
          </Layout>
        );
      default:
        return <div>Unknown View</div>;
    }
  };

  return (
    <>
      <InteractiveBackground />
      {/* View Container */}
      <div className="relative z-10">
        {renderView()}
      </div>
    </>
  );
};