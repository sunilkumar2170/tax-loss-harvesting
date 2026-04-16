const Navbar = () => (
  <nav className="sticky top-0 z-50 bg-dark-900/95 backdrop-blur border-b border-white/5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center h-14 sm:h-16">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs sm:text-sm">K</span>
          </div>
          <span className="text-white font-bold text-base sm:text-lg tracking-tight">
            KoinX
          </span>
          <span className="text-blue-400 text-xs ml-0.5">✦</span>
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;
