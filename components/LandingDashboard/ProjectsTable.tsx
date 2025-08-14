import React, { useState } from "react";
import { Star, Filter, ChevronDown, Search } from "lucide-react";

interface ProjectData {
  id: number;
  name: string;
  category: string;
  trustScore: number;
  mindshareScore: number;
  reviews: number;
  reviewCount: number;
  logo?: string;
  verified?: boolean;
}

interface ProjectsTableProps {
  projects?: ProjectData[];
  showSearch?: boolean;
  showFilters?: boolean;
}

const defaultProjects: ProjectData[] = [
  {
    id: 1,
    name: "DecentraDAO",
    category: "DAO",
    trustScore: 80,
    mindshareScore: 72,
    reviews: 3.5,
    reviewCount: 128,
    logo: "🏛️",
    verified: true,
  },
  {
    id: 2,
    name: "AiAgent Protocol",
    category: "AI",
    trustScore: 92,
    mindshareScore: 88,
    reviews: 5,
    reviewCount: 256,
    logo: "🤖",
    verified: true,
  },
  {
    id: 3,
    name: "CryptoGuild",
    category: "Gaming",
    trustScore: 28,
    mindshareScore: 65,
    reviews: 2.2,
    reviewCount: 94,
    logo: "⚔️",
    verified: false,
  },
  {
    id: 4,
    name: "DeFi Alliance",
    category: "DeFi",
    trustScore: 69,
    mindshareScore: 76,
    reviews: 4.6,
    reviewCount: 187,
    logo: "💰",
    verified: true,
  },
];

const ProjectsTable: React.FC<ProjectsTableProps> = ({
  projects = defaultProjects,
  showSearch = true,
  showFilters = true,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<
    "name" | "trustScore" | "mindshareScore" | "reviews"
  >("trustScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const categories = [
    "All",
    ...Array.from(new Set(projects.map((p) => p.category))),
  ];

  const filteredAndSortedProjects = projects
    .filter((project) => {
      const matchesSearch = project.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || project.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name) * direction;
        case "trustScore":
          return (a.trustScore - b.trustScore) * direction;
        case "mindshareScore":
          return (a.mindshareScore - b.mindshareScore) * direction;
        case "reviews":
          return (a.reviews - b.reviews) * direction;
        default:
          return 0;
      }
    });

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("desc");
    }
  };

  const handleProjectClick = (projectId: number) => {
    console.log(`Navigate to project ${projectId}`);
    // Add navigation logic here
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : i < rating
            ? "text-yellow-400 fill-current opacity-50"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  const getScoreColor = (score: number, type: "trust" | "mindshare") => {
    if (type === "trust") {
      return score >= 80
        ? "from-green-500 to-green-600"
        : score >= 60
        ? "from-yellow-500 to-yellow-600"
        : "from-red-500 to-red-600";
    } else {
      return "from-blue-500 to-purple-600";
    }
  };

  // New: text color to match the bar color
  const getScoreTextColor = (score: number, type: "trust" | "mindshare") => {
    if (type === "trust") {
      return score >= 80
        ? "text-green-600 dark:text-green-400"
        : score >= 60
        ? "text-yellow-600 dark:text-yellow-400"
        : "text-red-600 dark:text-red-400";
    }
    return "text-blue-600 dark:text-blue-400";
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-slate-800 dark:from-gray-100 dark:to-slate-200 bg-clip-text text-transparent">
            All Projects
          </h2>

          {/* Search and Filters */}
          {(showSearch || showFilters) && (
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {showSearch && (
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-background/60 backdrop-blur-xl border border-border/50 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
                  />
                </div>
              )}

              {showFilters && (
                <div className="flex gap-3">
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="appearance-none bg-background/60 backdrop-blur-xl border border-border/50 rounded-xl px-4 py-3 pr-8 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>

                  <button className="flex items-center gap-2 bg-background/60 backdrop-blur-xl border border-border/50 rounded-xl px-4 py-3 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-200">
                    <Filter className="w-4 h-4" />
                    More Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-accent/30">
                <tr>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-foreground cursor-pointer hover:bg-accent/50 transition-colors duration-200"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-2">
                      Project
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          sortBy === "name"
                            ? sortDirection === "desc"
                              ? "rotate-180"
                              : ""
                            : "opacity-50"
                        }`}
                      />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Category
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-foreground cursor-pointer hover:bg-accent/50 transition-colors duration-200"
                    onClick={() => handleSort("trustScore")}
                  >
                    <div className="flex items-center gap-2">
                      Trust Score
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          sortBy === "trustScore"
                            ? sortDirection === "desc"
                              ? "rotate-180"
                              : ""
                            : "opacity-50"
                        }`}
                      />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-foreground cursor-pointer hover:bg-accent/50 transition-colors duration-200"
                    onClick={() => handleSort("mindshareScore")}
                  >
                    <div className="flex items-center gap-2">
                      Mindshare Score
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          sortBy === "mindshareScore"
                            ? sortDirection === "desc"
                              ? "rotate-180"
                              : ""
                            : "opacity-50"
                        }`}
                      />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-foreground cursor-pointer hover:bg-accent/50 transition-colors duration-200"
                    onClick={() => handleSort("reviews")}
                  >
                    <div className="flex items-center gap-2">
                      Reviews
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          sortBy === "reviews"
                            ? sortDirection === "desc"
                              ? "rotate-180"
                              : ""
                            : "opacity-50"
                        }`}
                      />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredAndSortedProjects.map((project) => (
                  <tr
                    key={project.id}
                    onClick={() => handleProjectClick(project.id)}
                    className="hover:bg-accent/20 transition-all duration-200 cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {project.logo && (
                          <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-800 dark:to-slate-800 rounded-lg flex items-center justify-center text-lg">
                            {project.logo}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                            {project.name}
                          </div>
                          {project.verified && (
                            <div className="flex items-center gap-1 mt-1">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-green-600 dark:text-green-400">
                                Verified
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-secondary/50 text-secondary-foreground text-xs rounded-lg">
                        {project.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-secondary/50 rounded-full h-2 w-20">
                          <div
                            className={`bg-gradient-to-r ${getScoreColor(
                              project.trustScore,
                              "trust"
                            )} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${project.trustScore}%` }}
                          ></div>
                        </div>
                        <span
                          className={`text-sm font-semibold ${getScoreTextColor(
                            project.trustScore,
                            "trust"
                          )} min-w-[2rem]`}
                        >
                          {project.trustScore}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-secondary/50 rounded-full h-2 w-20">
                          <div
                            className={`bg-gradient-to-r ${getScoreColor(
                              project.mindshareScore,
                              "mindshare"
                            )} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${project.mindshareScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 min-w-[2rem]">
                          {project.mindshareScore}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {renderStars(project.reviews)}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({project.reviewCount})
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAndSortedProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No projects found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectsTable;
