import { useState } from 'react';

const Disclaimer = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-dark-700 border border-white/10 rounded-xl overflow-hidden mb-6">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm text-slate-300 hover:text-white transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-blue-400">ℹ</span>
          <span className="font-medium">Important Notes & Disclaimers</span>
        </div>
        <span className="text-slate-500 transition-transform duration-200" style={{ transform: open ? 'rotate(180deg)' : '' }}>
          ▾
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4 text-xs text-slate-400 space-y-2 border-t border-white/5 pt-3 animate-fade-in">
          <p>• Tax Loss Harvesting involves selling assets at a loss to offset capital gains taxes. This tool provides estimates based on current data.</p>
          <p>• The savings shown are indicative and may differ from actual tax savings based on your specific tax situation and jurisdiction.</p>
          <p>• Always consult a qualified tax professional before making any investment decisions based on tax considerations.</p>
          <p>• Past performance is not indicative of future results. Prices shown are for illustrative purposes only.</p>
        </div>
      )}
    </div>
  );
};

export default Disclaimer;
