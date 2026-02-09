import React, { useEffect } from 'react';
import { User } from '../types';

interface WelcomeScreenProps {
  user: User;
  onComplete: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ user, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500); // Display welcome screen for 2.5 seconds
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative animate-fade-in">
       <div className="text-center transform transition-all">
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center animate-slide-up shadow-sm">
              <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-medium tracking-widest text-[#595959] mb-3 uppercase animate-slide-up" style={{animationDelay: '0.1s'}}>
            Identity Verified
          </h2>
          <h1 className="text-5xl md:text-6xl font-light text-[#2d2d2d] mb-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
            Welcome, <span className="font-bold">{user.name}</span>
          </h1>
          <div className="w-12 h-1 bg-[#db0011] mx-auto mb-6 animate-slide-up" style={{animationDelay: '0.25s'}}></div>
          <p className="text-[#595959] text-lg animate-slide-up font-light" style={{animationDelay: '0.3s'}}>
            Initializing secure environment...
          </p>
       </div>
    </div>
  );
};

export default WelcomeScreen;