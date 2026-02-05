import React, { useEffect, useState, useMemo } from 'react';
import { IPOData } from '../types';
import { fetchLatestIPOs } from '../services/geminiService';

interface IPOListProps {
  onRunScreening: (ipos: IPOData[]) => void;
  loadingStatus: string;
}

const IPOList: React.FC<IPOListProps> = ({ onRunScreening, loadingStatus }) => {
  const [ipos, setIpos] = useState<IPOData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTickers, setSelectedTickers] = useState<Set<string>>(new Set());
  const [dateFilter, setDateFilter] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchLatestIPOs();
      setIpos(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredIPOs = useMemo(() => {
    if (!dateFilter) return ipos;
    return ipos.filter(ipo => ipo.listingDate === dateFilter);
  }, [ipos, dateFilter]);

  const toggleSelection = (ticker: string) => {
    const newSelection = new Set(selectedTickers);
    if (newSelection.has(ticker)) {
      newSelection.delete(ticker);
    } else {
      newSelection.add(ticker);
    }
    setSelectedTickers(newSelection);
  };

  const handleRunClick = () => {
    const selectedData = ipos.filter(i => selectedTickers.has(i.ticker));
    onRunScreening(selectedData);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-20 md:pb-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-gray-200 pb-6">
        <div>
          <h2 className="text-3xl font-light text-[#2d2d2d]">IPO <span className="font-bold">Watchlist</span></h2>
          <p className="text-[#595959] mt-2 font-light">Real-time filings and prospect exposure analysis.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
           {/* Date Filter */}
           <div className="flex flex-col w-full sm:w-auto">
             <label className="text-[10px] font-bold text-[#595959] uppercase tracking-wider mb-2">Listing Date</label>
             <input 
               type="date" 
               className="w-full sm:w-auto px-4 py-2.5 bg-white border border-gray-300 rounded-none text-sm text-[#2d2d2d] focus:ring-1 focus:ring-[#db0011] focus:border-[#db0011] outline-none shadow-sm transition-all"
               value={dateFilter}
               min="2026-02-01"
               max="2026-03-31"
               onChange={(e) => {
                 setDateFilter(e.target.value);
                 setSelectedTickers(new Set());
               }}
             />
           </div>

          <button
            onClick={handleRunClick}
            disabled={loading || !!loadingStatus || selectedTickers.size === 0}
            className={`group relative flex items-center justify-center px-8 py-2.5 rounded-none font-medium transition-all overflow-hidden h-[44px] mt-auto w-full sm:w-auto
              ${selectedTickers.size > 0 ? 'bg-[#db0011] text-white hover:bg-[#b0000e] shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
            `}
          >
             {loadingStatus && (
               <div className="absolute inset-0 bg-[#db0011] flex items-center justify-center z-10 px-4">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-white text-sm font-medium animate-pulse whitespace-nowrap overflow-hidden text-ellipsis">
                    {loadingStatus}
                  </span>
               </div>
             )}
            
            <span className="flex items-center">
              {selectedTickers.size > 0 ? (
                <>
                  <span className="relative flex h-2.5 w-2.5 mr-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                  </span>
                  IPO PDF screening ({selectedTickers.size})
                </>
              ) : (
                <>Select Listings</>
              )}
            </span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white p-6 border border-gray-200 shadow-sm animate-pulse h-72">
              <div className="h-6 bg-gray-100 w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-50 w-full mb-2"></div>
              <div className="h-4 bg-gray-50 w-2/3 mb-4"></div>
              <div className="h-24 bg-gray-50 w-full"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIPOs.length === 0 ? (
             <div className="col-span-full py-16 flex flex-col items-center justify-center text-gray-400 border border-gray-200 bg-white">
               <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
               <p className="font-medium">No filings found matching your criteria.</p>
             </div>
          ) : (
            filteredIPOs.map((ipo) => {
              const isSelected = selectedTickers.has(ipo.ticker);
              return (
                <div 
                  key={ipo.ticker} 
                  onClick={() => toggleSelection(ipo.ticker)}
                  className={`group relative corporate-card overflow-hidden cursor-pointer
                    ${isSelected ? 'border-[#db0011] bg-white ring-1 ring-[#db0011]' : 'bg-white hover:border-[#db0011]'}
                  `}
                >
                  <div className="absolute top-0 right-0 z-10">
                     <div className={`w-8 h-8 flex items-center justify-center transition-all ${isSelected ? 'bg-[#db0011]' : 'bg-transparent'}`}>
                        {isSelected && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                     </div>
                  </div>

                  <div className="p-7">
                    <div className="flex justify-between items-start mb-6 pr-8">
                      <div>
                        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide border mb-3 transition-colors ${isSelected ? 'bg-[#db0011] text-white border-[#db0011]' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                          {ipo.ticker}
                        </span>
                        <h3 className="text-xl font-bold text-[#2d2d2d] leading-tight">{ipo.companyName}</h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-100">
                        <div>
                           <p className="text-[10px] text-[#595959] uppercase tracking-wide mb-1 font-semibold">Sector</p>
                           <div className="flex items-center text-sm font-semibold text-[#2d2d2d]">
                             {ipo.sector}
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] text-[#595959] uppercase tracking-wide mb-1 font-semibold">Offering Size</p>
                           <p className="text-sm font-bold text-[#2d2d2d] tracking-wide">{ipo.offeringSize}</p>
                        </div>
                    </div>

                    <p className="text-sm text-[#595959] line-clamp-3 mb-6 leading-relaxed">
                      {ipo.description}
                    </p>

                    <div className="flex flex-col gap-2">
                       <p className="text-[10px] text-[#595959] uppercase tracking-wide font-bold">Underwriters</p>
                       <div className="flex flex-wrap gap-2">
                        {ipo.underwriters.slice(0, 2).map((uw, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-1 bg-gray-50 text-[#2d2d2d] border border-gray-200 font-medium">
                            {uw}
                          </span>
                        ))}
                        {ipo.underwriters.length > 2 && (
                          <span className="text-[10px] px-2 py-1 bg-gray-50 text-[#595959] border border-gray-200 font-medium">
                            +{ipo.underwriters.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-7 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-[#595959] font-medium font-mono">{ipo.listingDate}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider transition-all flex items-center ${isSelected ? 'text-[#db0011]' : 'text-gray-400'}`}>
                      {isSelected ? 'Selected' : 'Click to Select'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default IPOList;