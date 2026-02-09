import { IPOData, Lead } from "../types";
import { IBankingService } from "./interfaces";
import { MOCK_IPOS } from "../data/mockData";

const MOCK_DELAY = 600;

class GeminiMockService implements IBankingService {
  
  async getIPOs(): Promise<IPOData[]> {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    return MOCK_IPOS;
  }

  async generateLeads(ipos: IPOData[]): Promise<Lead[]> {
    // Simulate AI processing time
    await new Promise(r => setTimeout(r, 800));

    const leads: Lead[] = [];
    const timestamp = Date.now();
  
    // Deterministic mock logic ("The AI")
    ipos.forEach((ipo) => {
      // Logic for CloudWalk
      if (ipo.ticker === "9988.HK") {
        leads.push(
          {
            id: `lead-cw-1-${timestamp}`,
            name: "Dr. Leon Zhou",
            role: "CTO & Co-Founder",
            targetCompany: "CloudWalk Tech",
            netWorthEstimate: "$120M - $150M USD",
            rationale: "Holding significant equity pre-IPO. Likely looking for diversification strategies post-lockup period.",
            priority: "High",
            status: "New",
            matchScore: 2, 
          },
          {
            id: `lead-cw-new-2-${timestamp}`,
            name: "Sofia Rossi",
            role: "Global Strategy Director",
            targetCompany: "CloudWalk Tech",
            netWorthEstimate: "$45M USD",
            rationale: "Expatriate executive recently relocated to HK. No existing retail or private banking footprint found.",
            priority: "Medium",
            status: "New",
            matchScore: 1 
          },
          {
            id: `lead-cw-new-1-${timestamp}`,
            name: "Margaret Lo",
            role: "Non-Exec Director",
            targetCompany: "CloudWalk Tech",
            netWorthEstimate: "$65M USD",
            rationale: "Former regulatory head joining board. Identified via board resolution filings matching Premier Elite database.",
            priority: "Medium",
            status: "New",
            matchScore: 98,
            clientKey: "HK-772-104"
          },
          {
            id: `lead-cw-2-${timestamp}`,
            name: "Victor Li",
            role: "Angel Investor",
            targetCompany: "CloudWalk Tech",
            netWorthEstimate: "$45M USD",
            rationale: "Early round investor looking to diversify returns into fixed income and real estate.",
            priority: "Medium",
            status: "New",
            matchScore: 4
          }
        );
      } 
      // Logic for Apex Health
      else if (ipo.ticker === "6618.HK") {
        leads.push(
          {
            id: `lead-ah-1-${timestamp}`,
            name: "Dr. Sarah Wu",
            role: "Founder & CEO",
            targetCompany: "Apex Health",
            netWorthEstimate: "$200M+ USD",
            rationale: "Primary shareholder. Will need estate planning and trust structures for family office setup.",
            priority: "High",
            status: "New",
            matchScore: 95,
            clientKey: "HK-992-110"
          },
          {
            id: `lead-ah-new-1-${timestamp}`,
            name: "Kenneth Yip",
            role: "Series B Lead",
            targetCompany: "Apex Health",
            netWorthEstimate: "$30M USD",
            rationale: "Venture partner at BioFund. Partial name match found in external PEP database, requires EDD.",
            priority: "Low",
            status: "New",
            matchScore: 15
          },
          {
            id: `lead-ah-2-${timestamp}`,
            name: "James Wu",
            role: "Co-Founder / COO",
            targetCompany: "Apex Health",
            netWorthEstimate: "$80M USD",
            rationale: "Brother of founder, significant minority stake. Interested in luxury asset financing.",
            priority: "Medium",
            status: "New",
            matchScore: 3
          }
        );
      } 
      // Logic for Future Energy
      else if (ipo.ticker === "2359.HK") {
        leads.push({
          id: `lead-fe-1-${timestamp}`,
          name: "David Chen",
          role: "Chairman",
          targetCompany: "Future Energy",
          netWorthEstimate: "$450M USD",
          rationale: "Retaining 45% equity. High liquidity expected. Interested in philanthropy and impact investing.",
          priority: "High",
          status: "New",
          matchScore: 100,
          clientKey: "HK-102-992"
        });
      } 
      // Logic for Pacific Maritime
      else if (ipo.ticker === "1122.HK") {
        leads.push({
          id: `lead-pm-1-${timestamp}`,
          name: "Captain Zhang",
          role: "Executive Director",
          targetCompany: "Pacific Maritime",
          netWorthEstimate: "$60M USD",
          rationale: "Shipping tycoon family member. Requires cross-border currency hedging solutions.",
          priority: "Medium",
          status: "New",
          matchScore: 85
        });
      }
      // Logic for Sino-Euro
      else if (ipo.ticker === "8821.HK") {
        leads.push({
          id: `lead-se-1-${timestamp}`,
          name: "Robert Ho",
          role: "Managing Director",
          targetCompany: "Sino-Euro Prop",
          netWorthEstimate: "$90M USD",
          rationale: "Veteran developer cashing out minority stake. Interested in UK property market.",
          priority: "Medium",
          status: "New",
          matchScore: 94,
          clientKey: "HK-332-119"
        });
      }
      // Logic for Quantum Logistics
      else if (ipo.ticker === "9618.HK") {
        leads.push({
          id: `lead-ql-1-${timestamp}`,
          name: "James Liang",
          role: "CEO",
          targetCompany: "Quantum Logistics",
          netWorthEstimate: "$80M USD",
          rationale: "Founder led. Needs personal banking relationship for cross-border asset allocation.",
          priority: "Medium",
          status: "New",
          matchScore: 1
        });
      } 
      // Logic for Nebula Semi
      else if (ipo.ticker === "9888.HK") {
         leads.push(
          {
            id: `lead-ns-1-${timestamp}`,
            name: "Robert Chang",
            role: "Angel Investor",
            targetCompany: "Nebula Semi",
            netWorthEstimate: "$500M+ USD",
            rationale: "Early backer exiting with 50x returns. Requires complex tax structuring and global investment mandate.",
            priority: "High",
            status: "New",
            matchScore: 3
          },
          {
            id: `lead-ns-2-${timestamp}`,
            name: "Liang Wei",
            role: "Chief Architect",
            targetCompany: "Nebula Semi",
            netWorthEstimate: "$120M USD",
            rationale: "Key technical personnel with substantial RSU vesting. Needs wealth preservation strategy.",
            priority: "High",
            status: "New",
            matchScore: 4
          }
        );
      }
    });

    // Fallback logic
    if (leads.length === 0) {
      leads.push({
        id: `lead-gen-${timestamp}`,
        name: "Michael Tan",
        role: "CFO",
        targetCompany: "Generic Holdings",
        netWorthEstimate: "$50M USD",
        rationale: "Executive compensation package includes significant stock options.",
        priority: "Low",
        status: "New",
        matchScore: 3
      });
    }

    return leads;
  }
}

// Singleton export
export const geminiService = new GeminiMockService();

// Export legacy functions for backward compatibility with existing components
// In a full refactor, components would use the service instance directly.
export const fetchLatestIPOs = () => geminiService.getIPOs();
export const generateLeadsFromIPOs = (ipos: IPOData[]) => geminiService.generateLeads(ipos);
