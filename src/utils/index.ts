import { CapitalGains, Holding } from '../types';

// ─── Formatting ──────────────────────────────────────────────────────────────

export const formatCurrency = (value: number): string => {
  const abs = Math.abs(value);
  if (abs > 0 && abs < 0.005) return value < 0 ? '-₹0.00' : '₹0.00';
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(abs);
  return value < 0 ? `-₹${formatted}` : `₹${formatted}`;
};

export const formatNumber = (value: number, decimals = 6): string => {
  if (Math.abs(value) < 1e-10) return '0';
  if (Math.abs(value) < 0.000001) return value.toExponential(2);
  return value.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

// ─── Gain Calculations ────────────────────────────────────────────────────────

export const calculateNet = (profits: number, losses: number): number =>
  profits - losses;

export const calculateRealised = (gains: CapitalGains): number => {
  const stcgNet = calculateNet(gains.stcg.profits, gains.stcg.losses);
  const ltcgNet = calculateNet(gains.ltcg.profits, gains.ltcg.losses);
  return stcgNet + ltcgNet;
};

/**
 * KoinX Assignment Logic (exact spec):
 *
 * For each selected asset:
 *   stcg.gain > 0  →  add to stcg.profits
 *   stcg.gain < 0  →  add abs(gain) to stcg.losses
 *   ltcg.gain > 0  →  add to ltcg.profits
 *   ltcg.gain < 0  →  add abs(gain) to ltcg.losses
 *
 * Always recompute from fresh clone of baseGains — no mutation, no double-add.
 */
export const applyHarvesting = (
  baseGains: CapitalGains,
  selectedAssets: Holding[]
): CapitalGains => {
  // Fresh clone — never mutate base
  const result: CapitalGains = {
    stcg: { profits: baseGains.stcg.profits, losses: baseGains.stcg.losses },
    ltcg: { profits: baseGains.ltcg.profits, losses: baseGains.ltcg.losses },
  };

  for (const asset of selectedAssets) {
    if (asset.stcg.gain > 0)       result.stcg.profits += asset.stcg.gain;
    else if (asset.stcg.gain < 0)  result.stcg.losses  += Math.abs(asset.stcg.gain);

    if (asset.ltcg.gain > 0)       result.ltcg.profits += asset.ltcg.gain;
    else if (asset.ltcg.gain < 0)  result.ltcg.losses  += Math.abs(asset.ltcg.gain);
  }

  return result;
};

// ─── Sorting ──────────────────────────────────────────────────────────────────

export const sortHoldings = (
  holdings: Holding[],
  column: 'stcg' | 'ltcg' | 'currentPrice',
  order: 'asc' | 'desc'
): Holding[] => {
  return [...holdings].sort((a, b) => {
    let valA: number, valB: number;
    if (column === 'stcg')         { valA = a.stcg.gain;      valB = b.stcg.gain; }
    else if (column === 'ltcg')    { valA = a.ltcg.gain;      valB = b.ltcg.gain; }
    else                           { valA = a.currentPrice;   valB = b.currentPrice; }
    return order === 'asc' ? valA - valB : valB - valA;
  });
};
