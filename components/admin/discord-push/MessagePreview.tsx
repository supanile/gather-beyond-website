"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { DiscordMessages, DiscordMessage, DiscordEmbed } from "@derockdev/discord-components-react";

interface MessagePreviewProps {
  title: string;
  description: string;
  color: string;
  largeImageUrl?: string;
  thumbnailUrl?: string;
}

export function MessagePreview({
  title,
  description,
  color,
  largeImageUrl,
  thumbnailUrl,
}: MessagePreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Eye className="w-5 h-5" />
          <span>Message Preview</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            This is how your message will appear in Discord:
          </div>
          
          <div className="bg-[#313338] p-4 rounded-lg">
            <DiscordMessages>
              <DiscordMessage
                author="Gather Beyond Bot"
                avatar="/images/gb-logo-dark.png"
                bot={true}
                timestamp="Today at 2:30 PM"
              >
                {title || description ? (
                  <DiscordEmbed
                    slot="embeds"
                    color={color}
                    embedTitle={title || undefined}
                    image={largeImageUrl || undefined}
                    thumbnail={thumbnailUrl || undefined}
                  >
                    {description}
                  </DiscordEmbed>
                ) : (
                  <div className="text-gray-400 italic">
                    Start typing to see your message preview...
                  </div>
                )}
              </DiscordMessage>
            </DiscordMessages>
          </div>

          {/* Message Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Title:</strong> {title || "Not set"}
            </div>
            <div>
              <strong>Color:</strong> 
              <span className="ml-2 inline-flex items-center">
                <span 
                  className="w-4 h-4 rounded border mr-1" 
                  style={{ backgroundColor: color }}
                ></span>
                {color}
              </span>
            </div>
            <div className="col-span-2">
              <strong>Description:</strong> {description || "Not set"}
            </div>
            {largeImageUrl && (
              <div className="col-span-2">
                <strong>Large Image:</strong> {largeImageUrl}
              </div>
            )}
            {thumbnailUrl && (
              <div className="col-span-2">
                <strong>Thumbnail:</strong> {thumbnailUrl}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
