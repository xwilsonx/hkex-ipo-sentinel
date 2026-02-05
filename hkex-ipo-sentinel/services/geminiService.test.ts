import { describe, it, expect } from 'vitest';
import { geminiService } from './geminiService';

describe('GeminiMockService', () => {
  it('should fetch IPO data successfully', async () => {
    const ipos = await geminiService.getIPOs();
    expect(ipos).toBeDefined();
    expect(ipos.length).toBeGreaterThan(0);
    expect(ipos[0].ticker).toBeDefined();
  });

  it('should generate leads for known tickers', async () => {
    const ipos = await geminiService.getIPOs();
    const cloudWalkIPO = ipos.find(i => i.ticker === '9988.HK');
    
    if (cloudWalkIPO) {
      const leads = await geminiService.generateLeads([cloudWalkIPO]);
      expect(leads.length).toBeGreaterThan(0);
      
      // Check for specific deterministic mock data
      const sofia = leads.find(l => l.name === 'Sofia Rossi');
      expect(sofia).toBeDefined();
      expect(sofia?.matchScore).toBe(1);
    }
  });

  it('should return fallback data for empty selection', async () => {
    const leads = await geminiService.generateLeads([]);
    expect(leads.length).toBe(1);
    expect(leads[0].targetCompany).toBe('Generic Holdings');
  });
});
