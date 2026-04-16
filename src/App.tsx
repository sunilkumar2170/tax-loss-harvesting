import { useApp } from './context/AppContext';
import { calculateRealised } from './utils';
import Navbar from './components/Navbar';
import GainsCard from './components/GainsCard';
import HoldingsTable from './components/HoldingsTable';
import SkeletonCard from './components/SkeletonCard';
import Disclaimer from './components/Disclaimer';
import SavingsChart from './components/SavingsChart';

function App() {
  const { state } = useApp();
  const { baseCapitalGains, afterCapitalGains, loading, error } = state;

  const preRealised   = baseCapitalGains  ? calculateRealised(baseCapitalGains)  : 0;
  const afterRealised = afterCapitalGains ? calculateRealised(afterCapitalGains) : 0;
  const savings = preRealised > afterRealised ? preRealised - afterRealised : 0;

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Page header */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Tax Harvesting</h1>
          <a
            href="#"
            className="text-blue-400 text-sm hover:text-blue-300 underline underline-offset-2 transition-colors"
          >
            How it works?
          </a>
        </div>

        <Disclaimer />

        {error && (
          <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 mb-6 text-red-300 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Pre / After cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {loading.gains ? (
            <>
              <SkeletonCard />
              <SkeletonCard blue />
            </>
          ) : (
            <>
              {baseCapitalGains && (
                <GainsCard
                  title="Pre Harvesting"
                  gains={baseCapitalGains}
                  variant="dark"
                />
              )}
              {afterCapitalGains && (
                <GainsCard
                  title="After Harvesting"
                  gains={afterCapitalGains}
                  variant="blue"
                  savings={savings}
                />
              )}
            </>
          )}
        </div>

        {/* Tax Impact Chart */}
        <SavingsChart />

        {/* Holdings table */}
        <HoldingsTable />

      </main>
    </div>
  );
}

export default App;
