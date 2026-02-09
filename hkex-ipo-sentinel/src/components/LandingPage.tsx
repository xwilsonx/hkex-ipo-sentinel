import React, { useState } from 'react';

interface LandingPageProps {
  onLogin: () => void;
  onAdminEnter?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onAdminEnter }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEnter = () => {
    setIsLoading(true);
    // Simulate SSO delay
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative">
      {/* Admin Entry Point (Top Right) */}
      <div className="absolute top-0 right-0 p-6 z-50">
        <button 
          onClick={onAdminEnter}
          className="text-[10px] text-gray-300 hover:text-[#db0011] transition-colors font-medium tracking-widest uppercase opacity-50 hover:opacity-100"
        >
          Admin Access
        </button>
      </div>

      <div className="z-10 text-center max-w-3xl px-6 animate-fade-in">
        <div className="mb-12 relative flex flex-col items-center">
          
          {/* HSBC-style Hexagon Logo - SVG Version */}
          <div className="relative mb-8 w-24 h-24">
             <svg viewBox="0 0 100 87" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Red Hexagon Base */}
                <path d="M25 0H75L100 43.3L75 86.6H25L0 43.3L25 0Z" fill="#db0011"/>
                {/* White Saltire (Cross) */}
                <path d="M25 0L75 86.6M75 0L25 86.6" stroke="white" strokeWidth="10" strokeLinecap="butt" />
                {/* Triangle Separators (Optional refinement for exact brand look) */}
                <path d="M0 43.3H100" stroke="white" strokeWidth="0" /> 
             </svg>
          </div>

          <h2 className="text-base font-bold tracking-[0.2em] text-[#2d2d2d] mb-4 uppercase">Global Private Banking</h2>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-[#2d2d2d] mb-6">
            IPO <span className="font-bold">Sentinel</span>
          </h1>
          <div className="w-24 h-1 bg-[#db0011] mx-auto mb-8"></div>
          
          <p className="mt-4 text-xl text-[#595959] font-light leading-relaxed max-w-lg mx-auto">
            Secure Portal Access. <br/>
            Market intelligence and lead generation for February 2026.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <button
            onClick={handleEnter}
            disabled={isLoading}
            className={`group relative inline-flex items-center justify-center px-12 py-4 text-lg font-medium text-white transition-all duration-300 bg-[#db0011] hover:bg-[#b0000e] shadow-sm hover:shadow-md focus:outline-none w-full md:w-auto min-w-[280px] rounded-none ${isLoading ? 'opacity-90 cursor-wait' : ''}`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </span>
            ) : (
              <span className="flex items-center">
                Secure Log On
                <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            )}
          </button>
          
          <p className="text-[10px] text-[#595959] font-medium uppercase tracking-wider">
            Internal Use Only • Gemini Enterprise AI
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;