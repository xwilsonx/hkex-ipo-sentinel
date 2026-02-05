import React from 'react';
import { User, ViewState } from '../types';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  onNavigate: (view: ViewState) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ user, onLogout, onNavigate, children }) => {
  return (
    <div className="relative z-10 min-h-screen flex flex-col selection:bg-[#db0011] selection:text-white">
      {/* Sticky Header - Corporate Panel */}
      <header className="sticky top-0 z-50 corporate-panel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              {/* Navigation functionality on Logo Click */}
              <div 
                className="cursor-pointer flex items-center gap-3 group" 
                onClick={() => onNavigate('ipo-list')}
                title="Return to Watchlist"
              >
                 {/* HSBC-style SVG Logo Mini */}
                 <div className="w-9 h-9 relative flex-shrink-0 transition-transform group-hover:scale-105">
                    <svg viewBox="0 0 100 87" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M25 0H75L100 43.3L75 86.6H25L0 43.3L25 0Z" fill="#db0011"/>
                      <path d="M25 0L75 86.6M75 0L25 86.6" stroke="white" strokeWidth="12" strokeLinecap="butt" />
                    </svg>
                 </div>
                 <div className="flex flex-col">
                  <span className="text-xl font-medium text-[#2d2d2d] tracking-tight group-hover:text-[#db0011] transition-colors">HSBC</span>
                  <span className="text-[10px] text-[#595959] tracking-wider uppercase font-medium">Global Private Banking</span>
                 </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden md:block text-right">
                <div className="text-sm font-bold text-[#2d2d2d]">{user.name}</div>
                <div className="text-xs text-[#595959]">{user.title}</div>
              </div>
              <div className="h-10 w-10 bg-[#db0011] text-white flex items-center justify-center font-medium text-sm">
                {user.avatar}
              </div>
              
              <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block"></div>
              
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 text-[#595959] hover:text-[#db0011] transition-colors text-sm font-medium group ml-2 md:ml-0"
                title="Log Off"
              >
                <span className="hidden md:inline">Log Off</span>
                <div className="p-2 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-[#595959] text-xs">
            © 2026 HSBC Group. All rights reserved.
          </p>
          <p className="text-[#595959] text-xs tracking-wider uppercase font-medium">
            Private Banking Confidential • Powered by Gemini
          </p>
        </div>
      </footer>
    </div>
  );
};