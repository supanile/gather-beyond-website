"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { AvatarModal } from "./AvatarModal";

interface UserAvatarProps {
  discordId?: string;
  username?: string;
  avatarUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  clickable?: boolean; // เพิ่ม prop นี้
}

export function UserAvatar({ 
  discordId, 
  username, 
  avatarUrl: providedAvatarUrl, 
  size = "md", 
  className = "",
  clickable = true // default เป็น true
}: UserAvatarProps) {
  const [discordData, setDiscordData] = useState<{
    username: string;
    avatarUrl: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // เพิ่ม state สำหรับ modal

  // Size classes - updated for responsive design
  const sizeClasses = {
    sm: "w-6 h-6 sm:w-8 sm:h-8",
    md: "w-8 h-8 sm:w-10 sm:h-10", 
    lg: "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
  };

  // Fetch Discord data if discordId is provided and no direct data is given
  useEffect(() => {
    // Fetch if we have discordId but no avatarUrl provided (we may still want Discord avatar even if we have username)
    if (discordId && !providedAvatarUrl) {
      setLoading(true);
      fetch('/api/discord/discord-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ discord_id: discordId }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.username || data.avatarUrl) {
            setDiscordData({
              username: data.username || username || "Unknown User",
              avatarUrl: data.avatarUrl
            });
          } else {
            setError(true);
          }
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }
  }, [discordId, providedAvatarUrl, username]);

  // Determine what data to use - prioritize provided props over fetched data
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

  // Handle avatar click
  const handleClick = () => {
    if (clickable) {
      setIsModalOpen(true);
    }
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
    <>
      <Avatar 
        className={`${sizeClasses[size]} ${className} ${clickable ? 'cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all duration-200' : ''}`}
        onClick={handleClick} // เพิ่ม onClick handler
      >
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
      
      {/* เพิ่ม AvatarModal */}
      <AvatarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        username={displayUsername}
        avatarUrl={displayAvatarUrl}
        discordId={discordId}
      />
    </>
  );
}