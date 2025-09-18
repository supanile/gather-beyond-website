"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Eye } from "lucide-react";

interface Button {
  id: string;
  label: string;
  style: "primary" | "secondary" | "success" | "danger" | "link";
  url?: string;
}

interface MessagePreviewProps {
  title: string;
  description: string;
  color: string;
  largeImageUrl?: string;
  thumbnailUrl?: string;
  targetUsers?: string[];
  buttons?: Button[];
}

export function MessagePreview({
  title,
  description,
  color,
  largeImageUrl,
  thumbnailUrl,
  targetUsers = [],
  buttons = [],
}: MessagePreviewProps) {
  // Create stable timestamp and key to prevent unnecessary re-renders
  const [timestamp] = React.useState(() => new Date().toISOString());
  
  // Check if we have content to show
  const hasContent = title.trim() || description.trim();
  
  // Create a stable key based on content to force proper re-mounting when needed
  const contentKey = React.useMemo(() => {
    return `${hasContent ? 'content' : 'empty'}-${title?.slice(0, 5) || ''}-${description?.slice(0, 5) || ''}-${buttons.length}`;
  }, [hasContent, title, description, buttons.length]);

  const getButtonStyle = (buttonStyle: Button['style']) => {
    switch (buttonStyle) {
      case 'primary':
        return 'bg-[#5865F2] hover:bg-[#4752C4] text-white border-0';
      case 'secondary':
        return 'bg-[#4F545C] hover:bg-[#40444B] text-white border-0';
      case 'success':
        return 'bg-[#57F287] hover:bg-[#3BA55D] text-black border-0';
      case 'danger':
        return 'bg-[#ED4245] hover:bg-[#C03537] text-white border-0';
      case 'link':
        return 'bg-transparent hover:bg-[#40444B] text-[#00AFF4] border border-[#4F545C] hover:border-[#40444B]';
      default:
        return 'bg-[#5865F2] hover:bg-[#4752C4] text-white border-0';
    }
  };

  return (
    <Card className="h-fit sticky top-4">
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
          
          {/* Discord Message Container */}
          <div className="bg-[#36393F] rounded-lg p-4 font-['Whitney','Helvetica_Neue',Helvetica,Arial,sans-serif]" key={contentKey}>
            {/* User Info */}
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-[#5865F2] rounded-full flex items-center justify-center text-white font-semibold mr-4">
                SA
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-white font-semibold">Super Agent</span>
                <div className="bg-[#5865F2] text-white text-xs px-1 rounded font-semibold">BOT</div>
                <span className="text-[#72767D] text-xs">{new Date(timestamp).toLocaleString()}</span>
              </div>
            </div>

            {/* Message Content */}
            {hasContent ? (
              <div className="ml-14">
                {/* Embed */}
                <div className="border-l-4 pl-4 bg-[#2F3136] rounded p-4 max-w-lg" style={{ borderLeftColor: color }}>
                  {/* Embed Header */}
                  {title && (
                    <div className="text-white font-semibold mb-2 text-base">
                      {title}
                    </div>
                  )}
                  
                  {/* Embed Description */}
                  {description && (
                    <div className="text-[#DCDDDE] text-sm leading-relaxed whitespace-pre-wrap mb-3">
                      {description}
                    </div>
                  )}

                  {/* Embed Images */}
                  <div className="space-y-3">
                    {largeImageUrl && (
                      <div>
                        <img 
                          src={largeImageUrl} 
                          alt="Large image" 
                          className="max-w-full h-auto rounded"
                          style={{ maxHeight: '300px' }}
                        />
                      </div>
                    )}
                    
                    {thumbnailUrl && (
                      <div className="flex">
                        <img 
                          src={thumbnailUrl} 
                          alt="Thumbnail" 
                          className="w-20 h-20 object-cover rounded ml-auto"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions Buttons - Outside the embed */}
                {buttons && buttons.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="text-[#B9BBBE] text-xs font-semibold uppercase tracking-wide">
                      Quick Actions
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {buttons.map((button) => (
                        <Button
                          key={button.id}
                          size="sm"
                          className={`
                            text-sm h-8 px-4 font-medium rounded transition-all duration-150
                            ${getButtonStyle(button.style)}
                          `}
                          onClick={() => {
                            if (button.url) {
                              window.open(button.url, '_blank');
                            }
                            console.log(`Button clicked: ${button.label}`);
                          }}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <span>{button.label}</span>
                            {button.url && <ExternalLink className="w-3 h-3" />}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="ml-14 text-[#72767D] text-sm italic">
                Start typing to see your message preview...
              </div>
            )}
          </div>

          {/* Message Details */}
          <div className="space-y-2 text-xs text-gray-500">
            <div className="flex justify-between">
              <span className="font-medium">Title:</span>
              <span className="truncate ml-2 max-w-[200px]">{title || "Not set"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Color:</span>
              <div className="flex items-center space-x-1">
                <span 
                  className="w-3 h-3 rounded border" 
                  style={{ backgroundColor: color }}
                />
                <span className="font-mono">{color}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Recipients:</span>
              <span>{targetUsers.length} users</span>
            </div>
            {buttons.length > 0 && (
              <div className="flex justify-between">
                <span className="font-medium">Buttons:</span>
                <span>{buttons.length} button{buttons.length !== 1 ? 's' : ''}</span>
              </div>
            )}
            {largeImageUrl && (
              <div className="flex justify-between">
                <span className="font-medium">Large Image:</span>
                <span className="text-green-600">✓ Set</span>
              </div>
            )}
            {thumbnailUrl && (
              <div className="flex justify-between">
                <span className="font-medium">Thumbnail:</span>
                <span className="text-green-600">✓ Set</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}