import React from "react";
import { Shield, Activity, ChevronLeft, ChevronRight } from "lucide-react";

interface Project {
  id: number;
  name: string;
  logo: string;
  tags: string[];
  trustScore: number;
  mindshareScore: number;
  category: string;
}

interface FeaturedProjectsProps {
  projects?: Project[];
}

const defaultProjects: Project[] = [
  {
    id: 1,
    name: "DecentraDAO",
    logo: "🏛️",
    tags: ["Gaming", "DePIN"],
    trustScore: 85,
    mindshareScore: 72,
    category: "DAO",
  },
  {
    id: 2,
    name: "AiAgent Protocol",
    logo: "🤖",
    tags: ["AI", "Infrastructure"],
    trustScore: 20,
    mindshareScore: 28,
    category: "AI",
  },
  {
    id: 3,
    name: "CryptoGuild",
    logo: "⚔️",
    tags: ["Gaming", "NFT"],
    trustScore: 78,
    mindshareScore: 65,
    category: "Gaming",
  },
  {
    id: 4,
    name: "Web3Social",
    logo: "🌐",
    tags: ["Social", "DeFi"],
    trustScore: 92,
    mindshareScore: 88,
    category: "Social",
  },
  {
    id: 5,
    name: "MetaVerse Hub",
    logo: "🚀",
    tags: ["Metaverse", "VR"],
    trustScore: 67,
    mindshareScore: 54,
    category: "Metaverse",
  },
  {
    id: 6,
    name: "BlockChain Games",
    logo: "🎮",
    tags: ["Gaming", "Blockchain"],
    trustScore: 73,
    mindshareScore: 61,
    category: "Gaming",
  },
  {
    id: 7,
    name: "DeFi Protocol",
    logo: "💰",
    tags: ["DeFi", "Finance"],
    trustScore: 88,
    mindshareScore: 79,
    category: "DeFi",
  },
  {
    id: 8,
    name: "NFT Marketplace",
    logo: "🎨",
    tags: ["NFT", "Art"],
    trustScore: 81,
    mindshareScore: 68,
    category: "NFT",
  },
  {
    id: 9,
    name: "Smart Contracts",
    logo: "📋",
    tags: ["Smart Contract", "Security"],
    trustScore: 95,
    mindshareScore: 85,
    category: "Infrastructure",
  },
  {
    id: 10,
    name: "Crypto Wallet",
    logo: "💳",
    tags: ["Wallet", "Security"],
    trustScore: 90,
    mindshareScore: 82,
    category: "Wallet",
  },
];

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({
  projects = defaultProjects,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // Responsive cards per view
  const getCardsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) return 1; // Mobile
      if (window.innerWidth < 1024) return 2; // Tablet
      return 3; // Desktop
    }
    return 3;
  };

  const [cardsPerView, setCardsPerView] = React.useState(getCardsPerView());

  React.useEffect(() => {
    const handleResize = () => {
      setCardsPerView(getCardsPerView());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, Math.ceil(projects.length / cardsPerView) - 1);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleViewProfile = (projectId: number) => {
    console.log(`View profile for project ${projectId}`);
  };

  const getScoreColor = (score: number, type: "trust" | "mindshare") => {
    if (type === "trust") {
      return score >= 80
        ? "from-green-500 to-green-600"
        : score >= 60
        ? "from-yellow-500 to-yellow-600"
        : "from-red-500 to-red-600";
    } else {
      return "from-gray-500 to-slate-600";
    }
  };

  const getScoreTextColor = (score: number, type: "trust" | "mindshare") => {
    if (type === "trust") {
      return score >= 80
        ? "text-green-600 dark:text-green-400"
        : score >= 60
        ? "text-yellow-600 dark:text-yellow-400"
        : "text-red-600 dark:text-red-400";
    }
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-slate-800 dark:from-gray-100 dark:to-slate-200 bg-clip-text text-transparent px-2 sm:px-0">
            Featured Projects
          </h2>
        </div>

        <div className="relative overflow-hidden py-4">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {Array.from(
              { length: Math.ceil(projects.length / cardsPerView) },
              (_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0 flex">
                  {projects
                    .slice(slideIndex * cardsPerView, (slideIndex + 1) * cardsPerView)
                    .map((project) => (
                      <div
                        key={project.id}
                        className={`flex-shrink-0 px-2 sm:px-3 ${
                          cardsPerView === 1 ? 'w-full' : 
                          cardsPerView === 2 ? 'w-1/2' : 'w-1/3'
                        }`}
                      >
                        <div className="group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-gray-300/70 dark:hover:border-gray-600/70 hover:shadow-2xl dark:hover:shadow-gray-900/30 transition-all duration-300 hover:scale-105 h-full hover:z-10">
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/20 to-slate-50/20 dark:from-gray-950/20 dark:to-slate-950/20 rounded-xl sm:rounded-2xl"></div>

                          <div className="relative space-y-3 sm:space-y-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-800 dark:to-slate-800 rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                                {project.logo}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100 truncate">
                                  {project.name}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                  {project.category}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1 sm:gap-2">
                              {project.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 sm:px-3 py-1 bg-gray-100/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 text-xs rounded-md sm:rounded-lg border border-gray-200/30 dark:border-gray-700/30"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <div className="space-y-2 sm:space-y-3">
                              <div>
                                <div className="flex justify-between items-center mb-1 sm:mb-2">
                                  <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                    <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                                    Trust Score
                                  </span>
                                  <span
                                    className={`text-xs sm:text-sm font-semibold ${getScoreTextColor(
                                      project.trustScore,
                                      "trust"
                                    )}`}
                                  >
                                    {project.trustScore}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-1.5 sm:h-2">
                                  <div
                                    className={`bg-gradient-to-r ${getScoreColor(
                                      project.trustScore,
                                      "trust"
                                    )} h-1.5 sm:h-2 rounded-full transition-all duration-500`}
                                    style={{ width: `${project.trustScore}%` }}
                                  ></div>
                                </div>
                              </div>

                              <div>
                                <div className="flex justify-between items-center mb-1 sm:mb-2">
                                  <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                    <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
                                    Mindshare Score
                                  </span>
                                  <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
                                    {project.mindshareScore}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-1.5 sm:h-2">
                                  <div
                                    className="bg-gradient-to-r from-gray-500 to-slate-600 h-1.5 sm:h-2 rounded-full transition-all duration-500"
                                    style={{
                                      width: `${project.mindshareScore}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => handleViewProfile(project.id)}
                              className="w-full mt-3 sm:mt-4 bg-gradient-to-r from-gray-800 to-slate-700 dark:from-gray-200 dark:to-slate-300 text-white dark:text-black py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium hover:from-gray-900 hover:to-slate-800 dark:hover:from-gray-100 dark:hover:to-slate-200 transition-all duration-300 shadow-lg hover:shadow-xl dark:shadow-gray-900/50 dark:hover:shadow-gray-800/50 group-hover:shadow-xl text-sm sm:text-base"
                            >
                              View Profile
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  {/* Fill empty slots if less than cardsPerView cards in last slide */}
                  {projects.slice(slideIndex * cardsPerView, (slideIndex + 1) * cardsPerView).length < cardsPerView &&
                    Array.from(
                      {
                        length: cardsPerView - projects.slice(slideIndex * cardsPerView, (slideIndex + 1) * cardsPerView).length,
                      },
                      (_, emptyIndex) => (
                        <div
                          key={`empty-${emptyIndex}`}
                          className={`flex-shrink-0 px-2 sm:px-3 ${
                            cardsPerView === 1 ? 'w-full' : 
                            cardsPerView === 2 ? 'w-1/2' : 'w-1/3'
                          }`}
                        ></div>
                      )
                    )}
                </div>
              )
            )}
          </div>
        </div>

        {/* Navigation buttons and dots */}
        <div className="flex items-center justify-center space-x-4 sm:space-x-6 mt-6 sm:mt-8">
          {/* Navigation buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="p-2 sm:p-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl dark:shadow-gray-900/50 dark:hover:shadow-gray-800/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg dark:disabled:hover:shadow-gray-900/50 transition-all duration-200 hover:scale-110 disabled:hover:scale-100"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Dots indicator */}
            <div className="flex justify-center space-x-1 sm:space-x-2 mx-2 sm:mx-4">
              {Array.from(
                { length: Math.ceil(projects.length / cardsPerView) },
                (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-200 ${
                      currentIndex === i
                        ? "bg-gradient-to-r from-gray-800 to-slate-700 dark:from-gray-200 dark:to-slate-300 w-6 sm:w-8"
                        : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                    }`}
                  />
                )
              )}
            </div>

            <button
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              className="p-2 sm:p-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl dark:shadow-gray-900/50 dark:hover:shadow-gray-800/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg dark:disabled:hover:shadow-gray-900/50 transition-all duration-200 hover:scale-110 disabled:hover:scale-100"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};