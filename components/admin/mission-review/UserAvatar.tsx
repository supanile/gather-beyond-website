"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { User } from "lucide-react";

interface UserAvatarProps {
  discordId?: string;
  username?: string;
  avatarUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function UserAvatar({ 
  discordId, 
  username, 
  avatarUrl: providedAvatarUrl, 
  size = "md", 
  className = "" 
}: UserAvatarProps) {
  const [discordData, setDiscordData] = useState<{
    username: string;
    avatarUrl: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Size classes
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10", 
    lg: "w-12 h-12"
  };

  // Fetch Discord data if discordId is provided and no direct data is given
  useEffect(() => {
    if (discordId && !providedAvatarUrl && !username) {
      setLoading(true);
      fetch(`/api/discord/${discordId}`)
        .then(res => res.json())
        .then(data => {
          if (data.username && data.avatarUrl) {
            setDiscordData(data);
          } else {
            setError(true);
          }
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }
  }, [discordId, providedAvatarUrl, username]);

  // Determine what data to use
  const displayUsername = username || discordData?.username || "Unknown User";
  const displayAvatarUrl = providedAvatarUrl || discordData?.avatarUrl;

  // Generate initials from username
  const getInitials = (name: string) => {
    const words = name.split(/[\s._-]+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <Avatar className={`${sizeClasses[size]} ${className}`}>
        <AvatarFallback>
          <div className="animate-pulse bg-gray-300 rounded-full w-full h-full" />
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {displayAvatarUrl && !error && (
        <AvatarImage 
          src={displayAvatarUrl} 
          alt={`${displayUsername}'s avatar`}
          onError={() => setError(true)}
        />
      )}
      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
        {error ? (
          <User className={size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4"} />
        ) : (
          getInitials(displayUsername)
        )}
      </AvatarFallback>
    </Avatar>
  );
}
