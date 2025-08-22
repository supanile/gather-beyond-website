import React from "react";
import { ChevronRight, Calendar, Badge } from "lucide-react";
import { allProjects as projects, Project } from "@/data/admin/projectMockData";

interface Article {
  id?: number;
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  author?: string;
  publishedAt?: string;
  imageUrl?: string;
  type: "editorial" | "badge" | "audit" | "protocol";
  featured?: boolean;
  relatedProject?: Project;
}

interface MediaFeedProps {
  articles?: Article[];
}

// Generate articles based on project data
const generateArticlesFromProjects = (): Article[] => {
  const articleTemplates = [
    {
      type: "editorial" as const,
      templates: [
        "The Rise of {category} in Web3 Communities",
        "How {name} is Transforming {category}",
        "Understanding {category}: A Deep Dive into {name}",
        "The Future of {category}: Lessons from {name}",
      ]
    },
    {
      type: "badge" as const,
      templates: [
        "Badge Announcement: {name} Achieves Gold Trust Rating",
        "Verification Complete: {name} Joins Elite {category} Projects",
        "Trust Milestone: {name} Reaches {trustScore} Trust Score",
      ]
    },
    {
      type: "audit" as const,
      templates: [
        "Security Audit: {name} Protocol Review Complete",
        "Community Audit Results: {name} Security Assessment",
        "Trust Audit: {name} Governance Review",
      ]
    },
    {
      type: "protocol" as const,
      templates: [
        "Protocol News: {name} Integration Update",
        "Technical Update: {name} Protocol Enhancement",
        "Development News: {name} Latest Features",
      ]
    }
  ];

  const authors: string[] = [
    "Sarah Chen", "Michael Rodriguez", "Emma Thompson", "David Kim", 
    "Lisa Wang", "Alex Johnson", "Security Team", "Research Team"
  ];

  const timeframes: string[] = [
    "2 hours ago", "6 hours ago", "8 hours ago", "1 day ago", 
    "2 days ago", "3 days ago", "4 days ago", "1 week ago"
  ];

  const readTimes: string[] = ["3 min read", "5 min read", "8 min read", "6 min read", "4 min read", "7 min read"];

  const articles: Article[] = [];
  
  // Create articles for each project
  projects.forEach((project: Project, index: number) => {
    const templateGroup = articleTemplates[index % articleTemplates.length];
    const template = templateGroup.templates[Math.floor(Math.random() * templateGroup.templates.length)];
    
    const title = template
      .replace(/{name}/g, project.name)
      .replace(/{category}/g, project.category)
      .replace(/{trustScore}/g, project.trustScore.toString());
    
    const subtitle = generateSubtitle(project, templateGroup.type);
    
    articles.push({
      id: project.id,
      title,
      subtitle,
      category: project.category,
      readTime: readTimes[Math.floor(Math.random() * readTimes.length)],
      author: templateGroup.type !== "badge" ? authors[Math.floor(Math.random() * authors.length)] : undefined,
      publishedAt: timeframes[index % timeframes.length],
      type: templateGroup.type,
      featured: index === 0, // First article is featured
      relatedProject: project,
    });
  });

  return articles.slice(0, 6); // Return first 6 articles
};

const generateSubtitle = (project: Project, type: string): string => {
  const subtitleTemplates: { [key: string]: string[] } = {
    editorial: [
      `How ${project.name} is revolutionizing the ${project.category.toLowerCase()} space with innovative trust-building strategies`,
      `Exploring the impact of ${project.name} on decentralized ${project.category.toLowerCase()} communities`,
      `Understanding the technology and community behind ${project.name}'s success`,
    ],
    badge: [
      `${project.name} reaches milestone verification level with ${project.trustScore} trust score`,
      `Community-driven ${project.category.toLowerCase()} platform achieves verification standards`,
      `Latest verification milestone demonstrates strong community governance and security`,
    ],
    audit: [
      `Comprehensive audit reveals strong security practices and community governance for ${project.name}`,
      `Security assessment shows ${project.name} meets industry standards for ${project.category.toLowerCase()} projects`,
      `Independent review confirms ${project.name}'s commitment to transparency and security`,
    ],
    protocol: [
      `Latest updates on ${project.name}'s cross-chain community verification and reputation scoring`,
      `Technical improvements and new features enhance ${project.name}'s ${project.category.toLowerCase()} capabilities`,
      `Protocol updates strengthen ${project.name}'s position in the ${project.category.toLowerCase()} ecosystem`,
    ],
  };

  const templates = subtitleTemplates[type] || subtitleTemplates.editorial;
  return templates[Math.floor(Math.random() * templates.length)];
};

const MediaFeed: React.FC<MediaFeedProps> = ({
  articles = generateArticlesFromProjects(),
}) => {
  const handleArticleClick = (article: Article): void => {
    if (article.relatedProject) {
      // Navigate to project profile if it's related to a project
      window.location.href = `/project-profile?id=${article.relatedProject.id}`;
    } else if (article.id) {
      // Navigate to article page
      window.location.href = `/article/${article.id}`;
    }
  };

  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      DAO: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      DeFi: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      AI: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      Gaming: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      NFT: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
      Infrastructure: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
      Social: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
      Technology: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      Research: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      "Case Study": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      Audit: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      Protocol: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
      News: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      Analysis: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
      Badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      Metaverse: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      Wallet: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
    };
    return (
      colors[category] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    );
  };

  const getTypeIcon = (type: Article["type"]): React.ReactNode => {
    switch (type) {
      case "badge":
        return <Badge className="w-4 h-4" />;
      case "audit":
        return <Badge className="w-4 h-4" />;
      case "protocol":
        return <Badge className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  // Separate featured and regular articles
  const featuredArticles = articles.filter((article: Article) => article.featured);
  const regularArticles = articles.filter((article: Article) => !article.featured);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-slate-800 dark:from-gray-100 dark:to-slate-200 bg-clip-text text-transparent">
            Media Feed
          </h2>
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center gap-1">
            View all
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Featured Article (Full Width) */}
        {featuredArticles.length > 0 && (
          <div className="mb-8">
            <article
              onClick={() => handleArticleClick(featuredArticles[0])}
              className="group bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6 hover:border-foreground/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-medium ${getCategoryColor(
                        featuredArticles[0].category
                      )}`}
                    >
                      {featuredArticles[0].category}
                    </span>
                    <span className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
                      Featured
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {featuredArticles[0].readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-foreground group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300 line-clamp-2">
                    {featuredArticles[0].title}
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                    {featuredArticles[0].subtitle}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(featuredArticles[0].type)}
                      {featuredArticles[0].author ? (
                        <span>By {featuredArticles[0].author}</span>
                      ) : (
                        <span>{featuredArticles[0].publishedAt}</span>
                      )}
                    </div>
                    {featuredArticles[0].author && featuredArticles[0].publishedAt && (
                      <span>{featuredArticles[0].publishedAt}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <span className="text-sm text-muted-foreground group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                      Read more
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-gray-700 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </div>
            </article>
          </div>
        )}

        {/* Regular Articles (2-Column Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {regularArticles.map((article: Article, index: number) => (
            <article
              key={article.id || index}
              onClick={() => handleArticleClick(article)}
              className="group bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6 hover:border-foreground/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer animate-fade-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-medium ${getCategoryColor(
                      article.category
                    )}`}
                  >
                    {article.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {article.readTime}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-foreground group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300 line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                  {article.subtitle}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(article.type)}
                    {article.author ? (
                      <span>By {article.author}</span>
                    ) : (
                      <span>{article.publishedAt}</span>
                    )}
                  </div>
                  {article.author && article.publishedAt && (
                    <span>{article.publishedAt}</span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <span className="text-sm text-muted-foreground group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                    Read more
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-gray-700 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MediaFeed;