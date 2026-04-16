import { useApp } from '../context/AppContext';
import { calculateRealised, formatCurrency } from '../utils';

const SavingsChart = () => {
  const { state } = useApp();
  const { baseCapitalGains, afterCapitalGains, loading } = state;

  if (loading.gains || !baseCapitalGains || !afterCapitalGains) return null;

  const pre  = Math.max(0, calculateRealised(baseCapitalGains));
  const after = Math.max(0, calculateRealised(afterCapitalGains));
  const savings = pre > after ? pre - after : 0;

  // % widths for bars (at least 8% so bar is always visible)
  const maxVal  = Math.max(pre, after, 1);
  const preW    = Math.max(8, (pre / maxVal) * 100);
  const afterW  = Math.max(8, (after / maxVal) * 100);

  const hasSavings = savings > 0;

  return (
    <div className="mt-4 sm:mt-6 bg-dark-700 border border-white/5 rounded-2xl p-5 sm:p-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-white">
            Tax Impact Visualiser
          </h3>
          <p className="text-slate-500 text-xs mt-0.5">
            Compare your capital gains before and after harvesting
          </p>
        </div>
        {hasSavings && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-1.5">
            <span className="text-base">🎉</span>
            <span className="text-emerald-400 text-xs sm:text-sm font-semibold">
              Saving {formatCurrency(savings)}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-5">
        {/* Pre-Harvesting bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              Before Harvesting
            </span>
            <span className="text-white text-sm font-mono font-semibold">
              {formatCurrency(pre)}
            </span>
          </div>
          <div className="h-9 bg-dark-600 rounded-lg overflow-hidden relative">
            <div
              className="h-full rounded-lg flex items-center px-3 transition-all duration-700 ease-out"
              style={{
                width: `${preW}%`,
                background: 'linear-gradient(90deg, #ef4444 0%, #f97316 100%)',
              }}
            >
              <span className="text-white text-xs font-semibold whitespace-nowrap">
                {formatCurrency(pre)}
              </span>
            </div>
          </div>
        </div>

        {/* After-Harvesting bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              After Harvesting
            </span>
            <span className={`text-sm font-mono font-semibold ${hasSavings ? 'text-emerald-400' : 'text-white'}`}>
              {formatCurrency(after)}
            </span>
          </div>
          <div className="h-9 bg-dark-600 rounded-lg overflow-hidden relative">
            <div
              className="h-full rounded-lg flex items-center px-3 transition-all duration-700 ease-out"
              style={{
                width: `${afterW}%`,
                background: hasSavings
                  ? 'linear-gradient(90deg, #10b981 0%, #3b82f6 100%)'
                  : 'linear-gradient(90deg, #ef4444 0%, #f97316 100%)',
              }}
            >
              <span className="text-white text-xs font-semibold whitespace-nowrap">
                {formatCurrency(after)}
              </span>
            </div>
          </div>
        </div>

        {/* Savings callout */}
        {hasSavings ? (
          <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 text-xs sm:text-sm">
                Estimated tax savings
              </span>
            </div>
            <span className="text-emerald-400 text-sm sm:text-base font-bold font-mono">
              {formatCurrency(savings)}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center bg-dark-600/50 rounded-xl px-4 py-3">
            <span className="text-slate-500 text-xs sm:text-sm">
              Select holdings with losses to unlock tax savings
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavingsChart;
