export interface GainData {
  balance: number;
  gain: number;
}

export interface Holding {
  coin: string;
  coinName: string;
  logo: string;
  currentPrice: number;
  totalHolding: number;
  averageBuyPrice: number;
  stcg: GainData;
  ltcg: GainData;
}

export interface CapitalGainsSide {
  profits: number;
  losses: number;
}

export interface CapitalGains {
  stcg: CapitalGainsSide;
  ltcg: CapitalGainsSide;
}

export interface CapitalGainsResponse {
  capitalGains: CapitalGains;
}

export type SortColumn = 'stcg' | 'ltcg' | 'currentPrice' | null;
export type SortOrder = 'asc' | 'desc';

export interface SortState {
  column: SortColumn;
  order: SortOrder;
}
