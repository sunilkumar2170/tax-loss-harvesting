import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SortColumn, SortOrder } from '../types';
import { formatCurrency, formatNumber } from '../utils';

const INITIAL_ROWS = 8;

// ── Sub-components ────────────────────────────────────────────────────────────

const SortIcon = ({ active, order }: { active: boolean; order: SortOrder }) => (
  <span className={`ml-1 inline-block text-xs transition-colors ${active ? 'text-blue-400' : 'text-slate-600'}`}>
    {active ? (order === 'asc' ? '↑' : '↓') : '⇅'}
  </span>
);

const GainCell = ({
  value,
  balance,
  coin,
}: {
  value: number;
  balance: number;
  coin: string;
}) => {
  const isZero = Math.abs(value) < 0.00001;
  const isPos  = value > 0;
  const color  = isZero ? 'text-slate-500' : isPos ? 'text-emerald-400' : 'text-red-400';
  return (
    <div>
      <div className={`text-xs sm:text-sm font-semibold font-mono ${color}`}>
        {!isZero && isPos ? '+' : ''}{formatCurrency(value)}
      </div>
      {balance > 0 && (
        <div className="text-slate-500 text-xs mt-0.5">
          {formatNumber(balance, 4)} {coin}
        </div>
      )}
    </div>
  );
};

const PriceCell = ({
  price,
  holding,
}: {
  price: number;
  holding: number;
}) => {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="text-xs sm:text-sm text-slate-200 font-mono cursor-help border-b border-dotted border-slate-600">
        {formatCurrency(price)}
      </span>

      {show && (
        <div className="absolute bottom-full left-0 mb-2 z-50 pointer-events-none">
          <div className="bg-[#161b30] border border-white/10 rounded-xl p-3 shadow-2xl w-52 text-xs">
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/5">
              <span className="text-slate-400">Exact Price</span>
              <span className="text-white font-mono font-medium">{formatCurrency(price)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Value</span>
              <span className="text-blue-300 font-mono font-bold">
                {formatCurrency(price * holding)}
              </span>
            </div>
          </div>
          {/* caret */}
          <div className="w-0 h-0 mx-4 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#161b30]" />
        </div>
      )}
    </div>
  );
};

const IndeterminateCheckbox = ({
  checked,
  indeterminate,
  onChange,
  onClick,
}: {
  checked: boolean;
  indeterminate: boolean;
  onChange: () => void;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      onClick={onClick}
      className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
    />
  );
};

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-white/5">
    {Array.from({ length: 7 }).map((_, i) => (
      <td key={i} className="px-3 py-4">
        <div className="h-4 rounded bg-white/5 w-full" />
      </td>
    ))}
  </tr>
);

// ── Main Component ────────────────────────────────────────────────────────────

const HoldingsTable = () => {
  const { state, dispatch, holdingId } = useApp();
  const { holdings, selectedIds, loading, sortColumn, sortOrder, showAll } = state;

  const allSelected  = holdings.length > 0 && selectedIds.size === holdings.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  const handleSort = (col: SortColumn) => {
    if (!col) return;
    const newOrder: SortOrder =
      sortColumn === col ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc';
    dispatch({ type: 'SET_SORT', column: col, order: newOrder });
  };

  const displayed = showAll ? holdings : holdings.slice(0, INITIAL_ROWS);

  const thBase =
    'px-3 sm:px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap select-none';
  const thSort = `${thBase} cursor-pointer hover:text-slate-200 transition-colors`;

  return (
    <div className="mt-6 sm:mt-8 mb-12">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Holdings</h2>

      <div className="bg-dark-700 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: '800px' }}>
            <thead>
              <tr className="border-b border-white/5 bg-dark-800/60">
                {/* checkbox */}
                <th className={thBase} style={{ width: '50px' }}>
                  <IndeterminateCheckbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={() =>
                      dispatch({ type: allSelected ? 'DESELECT_ALL' : 'SELECT_ALL' })
                    }
                  />
                </th>

                <th className={thBase} style={{ width: '190px' }}>Asset</th>

                <th className={thBase} style={{ width: '170px' }}>
                  Holdings
                  <span className="block text-slate-600 font-normal normal-case text-xs mt-0.5">
                    Avg Buy Price
                  </span>
                </th>

                <th
                  className={thSort}
                  style={{ width: '150px' }}
                  onClick={() => handleSort('currentPrice')}
                >
                  Current Price
                  <SortIcon active={sortColumn === 'currentPrice'} order={sortOrder} />
                </th>

                <th
                  className={thSort}
                  style={{ width: '150px' }}
                  onClick={() => handleSort('stcg')}
                >
                  Short-Term
                  <SortIcon active={sortColumn === 'stcg'} order={sortOrder} />
                </th>

                <th
                  className={thSort}
                  style={{ width: '150px' }}
                  onClick={() => handleSort('ltcg')}
                >
                  Long-Term
                  <SortIcon active={sortColumn === 'ltcg'} order={sortOrder} />
                </th>

                <th className={thBase} style={{ width: '150px' }}>Amount to Sell</th>
              </tr>
            </thead>

            <tbody>
              {loading.holdings
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
                : displayed.map((h, i) => {
                    const id       = holdingId(h, i);
                    const selected = selectedIds.has(id);

                    return (
                      <tr
                        key={id}
                        onClick={() => dispatch({ type: 'TOGGLE_SELECT', id })}
                        className={`border-b border-white/5 cursor-pointer transition-colors duration-100 group ${
                          selected
                            ? 'bg-blue-500/10 hover:bg-blue-500/15'
                            : 'hover:bg-white/[0.025]'
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="px-3 sm:px-4 py-3 sm:py-4">
                          <IndeterminateCheckbox
                            checked={selected}
                            indeterminate={false}
                            onChange={() => dispatch({ type: 'TOGGLE_SELECT', id })}
                            onClick={e => e.stopPropagation()}
                          />
                        </td>

                        {/* Asset name + logo */}
                        <td className="px-3 sm:px-4 py-3 sm:py-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={h.logo}
                              alt={h.coin}
                              className="w-8 h-8 rounded-full object-cover bg-dark-600 flex-shrink-0"
                              onError={e => {
                                (e.target as HTMLImageElement).src =
                                  'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg';
                              }}
                            />
                            <div className="min-w-0">
                              <div className="text-white text-sm font-semibold leading-tight">
                                {h.coin}
                              </div>
                              <div className="text-slate-500 text-xs truncate max-w-[130px]">
                                {h.coinName}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Holdings + avg buy price */}
                        <td className="px-3 sm:px-4 py-3 sm:py-4">
                          <div className="text-white text-xs sm:text-sm font-mono leading-tight">
                            {formatNumber(h.totalHolding, 4)} {h.coin}
                          </div>
                          <div className="text-slate-500 text-xs mt-0.5 font-mono">
                            {formatCurrency(h.averageBuyPrice)}/{h.coin}
                          </div>
                        </td>

                        {/* Current price with hover tooltip */}
                        <td className="px-3 sm:px-4 py-3 sm:py-4">
                          <PriceCell price={h.currentPrice} holding={h.totalHolding} />
                        </td>

                        {/* Short-term gain */}
                        <td className="px-3 sm:px-4 py-3 sm:py-4">
                          <GainCell value={h.stcg.gain} balance={h.stcg.balance} coin={h.coin} />
                        </td>

                        {/* Long-term gain */}
                        <td className="px-3 sm:px-4 py-3 sm:py-4">
                          <GainCell value={h.ltcg.gain} balance={h.ltcg.balance} coin={h.coin} />
                        </td>

                        {/* Amount to sell */}
                        <td className="px-3 sm:px-4 py-3 sm:py-4">
                          {selected ? (
                            <span className="text-blue-400 text-xs sm:text-sm font-mono font-semibold">
                              {formatNumber(h.totalHolding, 4)} {h.coin}
                            </span>
                          ) : (
                            <span className="text-slate-600 text-sm">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>

        {/* View All / Less toggle */}
        {!loading.holdings && holdings.length > INITIAL_ROWS && (
          <div className="flex justify-center py-4 border-t border-white/5 bg-dark-800/20">
            <button
              onClick={e => {
                e.stopPropagation();
                dispatch({ type: 'TOGGLE_SHOW_ALL' });
              }}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors flex items-center gap-1.5"
            >
              {showAll
                ? <><span>View less</span><span className="text-xs">↑</span></>
                : <><span>View all ({holdings.length})</span><span className="text-xs">↓</span></>
              }
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HoldingsTable;
