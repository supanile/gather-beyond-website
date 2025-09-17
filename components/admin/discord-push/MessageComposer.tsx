"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageComposerForm } from "@/types/admin/discordPush";
import { Upload, Eye, Send, Calendar, Users } from "lucide-react";
import { MessagePreview } from "./MessagePreview";
import { UserSelector } from "./UserSelector";
import { ScheduleSelector } from "./ScheduleSelector";
import { mockDiscordUsers } from "@/data/admin/discordPushMockData";

interface MessageComposerProps {
  onSendMessage: (message: MessageComposerForm) => void;
  onScheduleMessage: (message: MessageComposerForm, scheduledAt: Date) => void;
  onSaveDraft: (message: MessageComposerForm) => void;
}

export function MessageComposer({ 
  onSendMessage, 
  onScheduleMessage, 
  onSaveDraft 
}: MessageComposerProps) {
  const [formData, setFormData] = useState<MessageComposerForm>({
    title: "",
    description: "",
    color: "#5865F2",
    largeImageUrl: "",
    thumbnailUrl: "",
    targetUsers: [],
    scheduledAt: undefined,
  });

  const [activeTab, setActiveTab] = useState<"compose" | "preview" | "users" | "schedule">("compose");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof MessageComposerForm, value: string | string[] | Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSendNow = async () => {
    setIsLoading(true);
    try {
      await onSendMessage(formData);
      // Reset form after successful send
      setFormData({
        title: "",
        description: "",
        color: "#5865F2",
        largeImageUrl: "",
        thumbnailUrl: "",
        targetUsers: [],
        scheduledAt: undefined,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSchedule = async (scheduledAt: Date) => {
    setIsLoading(true);
    try {
      await onScheduleMessage(formData, scheduledAt);
      setFormData(prev => ({ ...prev, scheduledAt }));
    } catch (error) {
      console.error("Failed to schedule message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsLoading(true);
    try {
      await onSaveDraft(formData);
    } catch (error) {
      console.error("Failed to save draft:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.title.trim() && formData.description.trim() && formData.targetUsers.length > 0;

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 p-1 bg-gray-100 dark:bg-gray-900 rounded-lg">
        {[
          { id: "compose", label: "Compose", icon: Upload },
          { id: "preview", label: "Preview", icon: Eye },
          { id: "users", label: "Recipients", icon: Users },
          { id: "schedule", label: "Schedule", icon: Calendar },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "compose" | "preview" | "users" | "schedule")}
            className={`
              flex items-center space-x-2 px-3 py-2 rounded-md font-medium transition-all duration-200 text-sm
              ${activeTab === tab.id
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              }
            `}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {tab.id === "users" && formData.targetUsers.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {formData.targetUsers.length}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">{/* ลดขนาดลงจาก 600px */}
        {activeTab === "compose" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Message Composer</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">{/* ลดจาก space-y-6 */}
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="🎄 Our Christmas selection is here!"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="text-sm"
                />
                <p className="text-xs text-gray-500">
                  {formData.title.length}/256 characters
                </p>
              </div>

              {/* Sidebar Color */}
              <div className="space-y-2">
                <Label htmlFor="color">Sidebar Color</Label>
                <div className="flex items-center space-x-3">
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => handleInputChange("color", e.target.value)}
                    className="w-12 h-8 p-1 border-2"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) => handleInputChange("color", e.target.value)}
                    placeholder="#5865F2"
                    className="font-mono text-sm"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Lots of ideas, discounts and more."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                  className="text-sm resize-none"
                />
                <p className="text-xs text-gray-500">
                  {formData.description.length}/4096 characters
                </p>
              </div>

              {/* Large Image URL */}
              <div className="space-y-2">
                <Label htmlFor="largeImageUrl">Large Image URL</Label>
                <Input
                  id="largeImageUrl"
                  type="url"
                  placeholder="https://example.com/large-image.jpg"
                  value={formData.largeImageUrl}
                  onChange={(e) => handleInputChange("largeImageUrl", e.target.value)}
                />
                {formData.largeImageUrl && (
                  <div className="mt-2">
                    <Image
                      src={formData.largeImageUrl}
                      alt="Large preview"
                      width={200}
                      height={120}
                      className="max-w-48 h-auto rounded-lg border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Thumbnail URL */}
              <div className="space-y-2">
                <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                <Input
                  id="thumbnailUrl"
                  type="url"
                  placeholder="https://example.com/thumbnail.jpg"
                  value={formData.thumbnailUrl}
                  onChange={(e) => handleInputChange("thumbnailUrl", e.target.value)}
                />
                {formData.thumbnailUrl && (
                  <div className="mt-2">
                    <Image
                      src={formData.thumbnailUrl}
                      alt="Thumbnail preview"
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded border object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "preview" && (
          <MessagePreview 
            title={formData.title}
            description={formData.description}
            color={formData.color}
            largeImageUrl={formData.largeImageUrl}
            thumbnailUrl={formData.thumbnailUrl}
          />
        )}

        {activeTab === "users" && (
          <UserSelector
            selectedUsers={formData.targetUsers}
            onSelectionChange={(users: string[]) => handleInputChange("targetUsers", users)}
            availableUsers={mockDiscordUsers}
          />
        )}

        {activeTab === "schedule" && (
          <ScheduleSelector
            scheduledAt={formData.scheduledAt}
            onScheduleChange={(date?: Date) => handleInputChange("scheduledAt", date)}
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
          <span>Recipients: {formData.targetUsers.length}</span>
          {formData.scheduledAt && (
            <span>• Scheduled: {formData.scheduledAt.toLocaleString()}</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveDraft}
            disabled={isLoading}
          >
            Save Draft
          </Button>
          
          {activeTab === "schedule" ? (
            <Button
              size="sm"
              onClick={() => formData.scheduledAt && handleSchedule(formData.scheduledAt)}
              disabled={!isFormValid || isLoading || !formData.scheduledAt}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Calendar className="w-4 h-4 mr-1" />
              Schedule
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleSendNow}
              disabled={!isFormValid || isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="w-4 h-4 mr-1" />
              Send Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
