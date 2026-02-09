import { IPOData, Lead } from "../types";

export interface IBankingService {
  /**
   * Fetches the list of upcoming IPOs from the exchange or data provider.
   */
  getIPOs(): Promise<IPOData[]>;

  /**
   * Generates leads based on selected IPOs using AI analysis.
   * @param selectedIPOs List of IPOs to analyze
   */
  generateLeads(selectedIPOs: IPOData[]): Promise<Lead[]>;
}
