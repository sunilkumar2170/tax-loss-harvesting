import { CapitalGains } from '../types';
import { formatCurrency, calculateNet, calculateRealised } from '../utils';

interface Props {
  title: string;
  gains: CapitalGains;
  variant: 'dark' | 'blue';
  savings?: number;
}

const GainsCard = ({ title, gains, variant, savings }: Props) => {
  const stcgNet = calculateNet(gains.stcg.profits, gains.stcg.losses);
  const ltcgNet = calculateNet(gains.ltcg.profits, gains.ltcg.losses);
  // Clamp realised to 0 minimum for display
  const realisedRaw = calculateRealised(gains);
  const realised = realisedRaw;

  const isBlue = variant === 'blue';

  const cardClass = isBlue
    ? 'bg-gradient-to-br from-blue-600 to-blue-800 border border-blue-400/30 shadow-xl shadow-blue-900/40'
    : 'bg-dark-700 border border-white/5 shadow-xl shadow-black/30';

  const labelColor   = isBlue ? 'text-blue-100/70' : 'text-slate-400';
  const headerColor  = isBlue ? 'text-blue-100/50' : 'text-slate-500';
  const dividerColor = isBlue ? 'border-blue-400/20' : 'border-white/5';
  const netLabel     = isBlue ? 'text-blue-100' : 'text-slate-200';

  const profitColor = isBlue ? 'text-green-300' : 'text-emerald-400';
  const lossColor   = isBlue ? 'text-red-300'   : 'text-red-400';

  const netColor = (v: number) =>
    v < 0 ? lossColor : isBlue ? 'text-white' : 'text-white';

  const realisedColor = realised < 0 ? lossColor : 'text-white';

  return (
    <div className={`rounded-2xl p-5 sm:p-6 transition-all duration-300 ${cardClass}`}>
      <h3 className={`text-base sm:text-lg font-semibold mb-4 ${isBlue ? 'text-white' : 'text-slate-100'}`}>
        {title}
      </h3>

      <table className="w-full">
        <thead>
          <tr>
            <th className={`text-left pb-3 text-xs font-medium ${headerColor}`}></th>
            <th className={`text-right pb-3 text-xs font-medium ${headerColor}`}>Short-term</th>
            <th className={`text-right pb-3 text-xs font-medium ${headerColor}`}>Long-term</th>
          </tr>
        </thead>
        <tbody>
          {/* Profits — always green */}
          <tr className={`border-t ${dividerColor}`}>
            <td className={`py-2.5 text-xs sm:text-sm ${labelColor}`}>Profits</td>
            <td className={`text-right py-2.5 font-mono text-xs sm:text-sm font-medium ${profitColor}`}>
              {formatCurrency(gains.stcg.profits)}
            </td>
            <td className={`text-right py-2.5 font-mono text-xs sm:text-sm font-medium ${profitColor}`}>
              {formatCurrency(gains.ltcg.profits)}
            </td>
          </tr>

          {/* Losses — always red, shown negative */}
          <tr className={`border-t ${dividerColor}`}>
            <td className={`py-2.5 text-xs sm:text-sm ${labelColor}`}>Losses</td>
            <td className={`text-right py-2.5 font-mono text-xs sm:text-sm font-medium ${lossColor}`}>
              -{formatCurrency(gains.stcg.losses)}
            </td>
            <td className={`text-right py-2.5 font-mono text-xs sm:text-sm font-medium ${lossColor}`}>
              -{formatCurrency(gains.ltcg.losses)}
            </td>
          </tr>

          {/* Net — red if negative */}
          <tr className={`border-t ${dividerColor}`}>
            <td className={`py-2.5 text-xs sm:text-sm font-semibold ${netLabel}`}>
              Net Capital Gains
            </td>
            <td className={`text-right py-2.5 font-mono text-xs sm:text-sm font-semibold ${netColor(stcgNet)}`}>
              {formatCurrency(stcgNet)}
            </td>
            <td className={`text-right py-2.5 font-mono text-xs sm:text-sm font-semibold ${netColor(ltcgNet)}`}>
              {formatCurrency(ltcgNet)}
            </td>
          </tr>
        </tbody>
      </table>

      <div className={`border-t mt-3 mb-4 ${dividerColor}`} />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={`text-sm font-medium ${isBlue ? 'text-blue-100/80' : 'text-slate-300'}`}>
          {isBlue ? 'Effective Capital Gains:' : 'Realised Capital Gains:'}
        </span>
        <span className={`text-xl sm:text-2xl font-bold font-mono ${realisedColor}`}>
          {formatCurrency(realised)}
        </span>
      </div>

      {/* Savings badge — only on blue card when savings > 0 */}
      {isBlue && savings !== undefined && savings > 0 && (
        <div className="mt-4 flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3">
          <span className="text-lg">🎉</span>
          <span className="text-white text-xs sm:text-sm font-medium">
            You're going to save upto{' '}
            <span className="font-bold text-green-300">{formatCurrency(savings)}</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default GainsCard;
