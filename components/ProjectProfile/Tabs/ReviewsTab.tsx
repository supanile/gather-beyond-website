"use client"

import React from "react";
import {
  Star,
  Filter,
  MessageSquare,
  ThumbsUp,
  Shield,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Review {
  id: number;
  rating: number;
  comment: string;
  author: string;
  type: string;
  date: string;
  verified: boolean;
}

interface ReviewBreakdown {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

interface Reviews {
  averageRating: number;
  totalReviews: number;
  breakdown: ReviewBreakdown;
  recent: Review[];
}

interface ReviewsTabProps {
  reviews: Reviews;
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({ reviews }) => {
  const [selectedFilter, setSelectedFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("recent");

  const filters = [
    { key: "all", label: "All Reviews", count: reviews.totalReviews },
    {
      key: "verified",
      label: "Verified Only",
      count: reviews.recent.filter((r) => r.verified).length,
    },
    {
      key: "community",
      label: "Community Leaders",
      count: reviews.recent.filter((r) => r.type === "Community Leader").length,
    },
    {
      key: "agents",
      label: "Verified Agents",
      count: reviews.recent.filter((r) => r.type === "Verified Agent").length,
    },
  ];

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "w-3 h-3",
      md: "w-4 h-4",
      lg: "w-5 h-5",
    };

    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };

  const getFilteredReviews = () => {
    let filtered = reviews.recent;

    switch (selectedFilter) {
      case "verified":
        filtered = reviews.recent.filter((r) => r.verified);
        break;
      case "community":
        filtered = reviews.recent.filter((r) => r.type === "Community Leader");
        break;
      case "agents":
        filtered = reviews.recent.filter((r) => r.type === "Verified Agent");
        break;
      default:
        break;
    }

    // Sort by selected criteria
    if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "oldest") {
      filtered.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }
    // Default is recent (already sorted)

    return filtered;
  };

  const getAuthorTypeIcon = (type: string, verified: boolean) => {
    if (type === "Community Leader") {
      return <Shield className="w-4 h-4 text-blue-500" />;
    } else if (type === "Verified Agent") {
      return <User className="w-4 h-4 text-green-500" />;
    } else if (verified) {
      return <Shield className="w-4 h-4 text-gray-500" />;
    }
    return <User className="w-4 h-4 text-gray-400" />;
  };

  const getAuthorTypeBadge = (type: string, verified: boolean) => {
    if (type === "Community Leader") {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    } else if (type === "Verified Agent") {
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    } else if (verified) {
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
    return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
  };

  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rating Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {reviews.averageRating}
            </div>
            <div className="mb-3">
              {renderStars(Math.round(reviews.averageRating), "lg")}
            </div>
            <div className="text-muted-foreground text-sm">
              Based on {reviews.totalReviews} reviews
            </div>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="lg:col-span-2">
          <div className="bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Rating Breakdown
            </h4>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count =
                  reviews.breakdown[rating as keyof ReviewBreakdown];
                const percentage = (count / reviews.totalReviews) * 100;

                return (
                  <div key={rating} className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 w-16">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {rating}
                      </span>
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="flex-1 bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                selectedFilter === filter.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-gray-100 dark:bg-gray-800 text-muted-foreground hover:text-primary hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <Filter className="w-3 h-3" />
              {filter.label}
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  selectedFilter === filter.key
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="rating">Highest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {getFilteredReviews().map((review, index) => (
          <div
            key={review.id}
            className="bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 animate-fade-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {getAuthorTypeIcon(review.type, review.verified)}
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {review.author}
                  </span>
                </div>
                <Badge
                  className={getAuthorTypeBadge(review.type, review.verified)}
                >
                  {review.type}
                </Badge>
                {review.verified && (
                  <Badge variant="outline" className="text-xs">
                    Verified
                  </Badge>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {renderStars(review.rating)}
                <span className="text-sm text-muted-foreground">
                  {review.date}
                </span>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {review.comment}
            </p>

            <div className="flex items-center justify-between">
              <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span>Helpful</span>
              </button>

              <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span>Reply</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center">
        <button className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl font-medium transition-colors">
          Load More Reviews
        </button>
      </div>

      {/* Write Review CTA */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200/30 dark:border-blue-800/30 rounded-xl p-6 text-center">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Share Your Experience
        </h4>
        <p className="text-muted-foreground mb-4">
          Help others by sharing your experience with this project
        </p>
        <button className="px-6 py-3 bg-gradient-to-r from-gray-800 to-slate-700 dark:from-gray-200 dark:to-slate-300 text-white dark:text-black rounded-xl font-medium hover:from-gray-900 hover:to-slate-800 dark:hover:from-gray-100 dark:hover:to-slate-200 transition-all duration-300 shadow-lg transform hover:scale-105">
          Write a Review
        </button>
      </div>
    </div>
  );
};

export default ReviewsTab;