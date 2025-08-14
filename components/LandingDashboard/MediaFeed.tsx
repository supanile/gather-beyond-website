import React from "react";
import { ChevronRight, Calendar, User, Badge } from "lucide-react";

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
}

interface MediaFeedProps {
  articles?: Article[];
}

const defaultArticles: Article[] = [
  {
    id: 1,
    title: "The Rise of AI Agents in Web3 Communities",
    subtitle: "How artificial intelligence is transforming decentralized communities and creating new trust paradigms",
    category: "Technology",
    readTime: "5 min read",
    author: "Sarah Chen",
    publishedAt: "2 hours ago",
    type: "editorial",
    featured: true,
  },
  {
    id: 2,
    title: "Trust Metrics That Matter: New Verification Standards",
    subtitle: "Understanding the evolving paradigms of community verification and reputation systems",
    category: "Research",
    readTime: "8 min read",
    author: "Michael Rodriguez",
    publishedAt: "6 hours ago",
    type: "editorial",
  },
  {
    id: 3,
    title: "Badge Announcement: DecentraDAO Achieves Gold Trust Rating",
    subtitle: "Community-driven governance platform reaches milestone verification level",
    category: "Badge",
    readTime: "3 min read",
    publishedAt: "8 hours ago",
    type: "badge",
  },
  {
    id: 4,
    title: "Security Audit: MetaVerse DAO Protocol Review Complete",
    subtitle: "Comprehensive audit reveals strong security practices and community governance",
    category: "Audit",
    readTime: "6 min read",
    author: "Security Team",
    publishedAt: "1 day ago",
    type: "audit",
  },
  {
    id: 5,
    title: "Protocol News: New Trust Layer Integration",
    subtitle: "Latest updates on cross-chain community verification and reputation scoring",
    category: "Protocol",
    readTime: "4 min read",
    publishedAt: "1 day ago",
    type: "protocol",
  },
  {
    id: 6,
    title: "Campaign Success Stories: Learning from the Best",
    subtitle: "Analyzing the most effective community campaigns and their trust-building strategies",
    category: "Case Study",
    readTime: "7 min read",
    author: "Emma Thompson",
    publishedAt: "2 days ago",
    type: "editorial",
  },
];

const MediaFeed: React.FC<MediaFeedProps> = ({
  articles = defaultArticles,
}) => {
  const handleArticleClick = (articleId?: number) => {
    if (articleId) {
      console.log(`Navigate to article ${articleId}`);
      // Add navigation logic here
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Technology: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      Research: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      "Case Study": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      Badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      Audit: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      Protocol: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
      News: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      Analysis: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
    };
    return (
      colors[category] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    );
  };

  const getTypeIcon = (type: string) => {
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
  const featuredArticles = articles.filter(article => article.featured);
  const regularArticles = articles.filter(article => !article.featured);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-slate-800 dark:from-gray-100 dark:to-slate-200 bg-clip-text text-transparent">
            Media Feed
          </h2>
          <button className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-1">
            View all
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Featured Article (Full Width) */}
        {featuredArticles.length > 0 && (
          <div className="mb-8">
            <article
              onClick={() => handleArticleClick(featuredArticles[0].id)}
              className="group bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl p-8 hover:border-primary/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
            >
              <div className="flex items-start gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
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

                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {featuredArticles[0].title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed">
                    {featuredArticles[0].subtitle}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {featuredArticles[0].author && (
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>By {featuredArticles[0].author}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        {getTypeIcon(featuredArticles[0].type)}
                        <span>{featuredArticles[0].publishedAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-primary transition-colors duration-300">
                      <span>Read more</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        )}

        {/* Regular Articles (2-Column Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {regularArticles.map((article, index) => (
            <article
              key={article.id || index}
              onClick={() => handleArticleClick(article.id)}
              className="group bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6 hover:border-primary/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer animate-fade-up"
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

                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
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
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors duration-300">
                    Read more
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
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