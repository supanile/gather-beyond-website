import React from "react";
// import { Search } from "lucide-react";

interface HeroSectionProps {
  onSearch?: (searchTerm: string) => void;
  onFilterSelect?: (filter: string) => void;
  selectedFilter?: string; // Add this prop to track active filter
}

const HeroSection: React.FC<HeroSectionProps> = ({
  // onSearch,
  // onFilterSelect,
  // selectedFilter = "", // Default value
}) => {
  // const [searchTerm, setSearchTerm] = useState("");

  // const filters = [
  //   "Trending Now",
  //   "Highest Trust",
  //   "Most Active Communities",
  //   "New Projects",
  // ];

  // const handleSearch = () => {
  //   if (onSearch) {
  //     onSearch(searchTerm);
  //   }
  // };

  // const handleFilterClick = (filter: string) => {
  //   if (onFilterSelect) {
  //     // Toggle filter: if clicking the same filter, clear it
  //     const newFilter = selectedFilter === filter ? "" : filter;
  //     onFilterSelect(newFilter);
  //   }
  // };

  // const handleKeyPress = (e: React.KeyboardEvent) => {
  //   if (e.key === 'Enter') {
  //     handleSearch();
  //   }
  // };

  return (
    <section className="relative pt-28 md:pt-36 pb-12 sm:pb-16 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 to-slate-50/30 dark:from-gray-950/30 dark:to-slate-950/30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center space-y-6 sm:space-y-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-slate-800 to-zinc-700 dark:from-gray-100 dark:via-slate-200 dark:to-zinc-300 bg-clip-text text-transparent leading-tight px-2 sm:px-0">
            The Trust Layer for
            <br />
            <span className="block sm:inline">Communities, Campaigns,</span>
            <span className="block sm:inline"> and Culture.</span>
          </h1>

          {/* Search Bar */}
          {/* <div className="max-w-xl sm:max-w-2xl mx-auto relative px-2 sm:px-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 via-slate-500/20 to-zinc-500/20 rounded-xl sm:rounded-2xl blur-sm"></div>
              <div className="relative bg-background/80 backdrop-blur-xl border border-border/50 rounded-xl sm:rounded-2xl p-2 shadow-2xl">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground ml-2 sm:ml-4 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search project, campaign, or community..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 bg-transparent border-none outline-none text-sm sm:text-base text-foreground placeholder-muted-foreground py-2 sm:py-3 min-w-0"
                  />
                  <button 
                    onClick={handleSearch}
                    className="bg-gradient-to-r from-gray-800 to-slate-700 dark:from-gray-200 dark:to-slate-300 text-white dark:text-black px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium hover:from-gray-900 hover:to-slate-800 dark:hover:from-gray-100 dark:hover:to-slate-200 transition-all duration-300 shadow-lg transform hover:scale-105 text-sm sm:text-base whitespace-nowrap"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div> */}

          {/* Filter Chips */}
          {/* <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-4xl mx-auto px-2 sm:px-0">
            {filters.map((filter, index) => {
              const isSelected = selectedFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => handleFilterClick(filter)}
                  className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl border transition-all duration-300 transform hover:scale-105 animate-fade-up text-sm sm:text-base whitespace-nowrap ${
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary shadow-md shadow-primary/20'
                      : 'border-border/50 bg-background/60 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:border-border hover:bg-accent/50 hover:shadow-lg'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {filter}
                </button>
              );
            })}
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;