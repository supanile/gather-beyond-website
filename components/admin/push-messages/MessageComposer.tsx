"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageComposerForm } from "@/types/admin/discordPush";
import { Upload, Eye, Send, Calendar, Users, Plus, X, Mouse, Edit, ExternalLink } from "lucide-react";
import { MessagePreview } from "./MessagePreview";
import { UserSelector } from "./UserSelector";
import { ScheduleSelector } from "./ScheduleSelector";
import { mockDiscordUsers } from "@/data/admin/discordPushMockData";
import { MediaUploader } from "./MediaUploader";

interface CustomButton {
  id: string;
  label: string;
  style: "primary" | "secondary" | "success" | "danger" | "link";
  url?: string;
}

interface ExtendedMessageComposerForm extends MessageComposerForm {
  buttons?: CustomButton[];
}

interface MessageComposerProps {
  onSendMessage: (message: ExtendedMessageComposerForm) => void;
  onScheduleMessage: (message: ExtendedMessageComposerForm, scheduledAt: Date) => void;
  onSaveDraft: (message: ExtendedMessageComposerForm) => void;
}

export function MessageComposer({ 
  onSendMessage, 
  onScheduleMessage, 
  onSaveDraft 
}: MessageComposerProps) {
  const [formData, setFormData] = useState<ExtendedMessageComposerForm>({
    title: "",
    description: "",
    color: "#5865F2",
    largeImageUrl: "",
    thumbnailUrl: "",
    targetUsers: [],
    scheduledAt: undefined,
    buttons: [],
  });

  const [activeTab, setActiveTab] = useState<"compose" | "users" | "schedule" | "buttons">("compose");
  const [isLoading, setIsLoading] = useState(false);

  // Button management
  const [newButton, setNewButton] = useState<Partial<CustomButton>>({
    label: "",
    style: "primary",
    url: "",
  });

  const [editingButton, setEditingButton] = useState<string | null>(null);

  const handleInputChange = (field: keyof ExtendedMessageComposerForm, value: string | string[] | Date | undefined | CustomButton[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (url: string, type: "large" | "thumbnail") => {
    if (type === "large") {
      handleInputChange("largeImageUrl", url);
    } else {
      handleInputChange("thumbnailUrl", url);
    }
  };

  const handleAddButton = () => {
    if (!newButton.label?.trim()) return;

    const button: CustomButton = {
      id: `btn_${Date.now()}`,
      label: newButton.label,
      style: newButton.style || "primary",
      url: newButton.url || undefined,
    };

    const currentButtons = formData.buttons || [];
    handleInputChange("buttons", [...currentButtons, button]);

    // Reset form
    setNewButton({
      label: "",
      style: "primary",
      url: "",
    });
  };

  const handleEditButton = (buttonId: string) => {
    const button = formData.buttons?.find(btn => btn.id === buttonId);
    if (button) {
      setNewButton({
        label: button.label,
        style: button.style,
        url: button.url || "",
      });
      setEditingButton(buttonId);
    }
  };

  const handleUpdateButton = () => {
    if (!newButton.label?.trim() || !editingButton) return;

    const currentButtons = formData.buttons || [];
    const updatedButtons = currentButtons.map(btn =>
      btn.id === editingButton
        ? {
            ...btn,
            label: newButton.label!,
            style: newButton.style || "primary",
            url: newButton.url || undefined,
          }
        : btn
    );

    handleInputChange("buttons", updatedButtons);

    // Reset form
    setNewButton({
      label: "",
      style: "primary",
      url: "",
    });
    setEditingButton(null);
  };

  const handleCancelEdit = () => {
    setNewButton({
      label: "",
      style: "primary",
      url: "",
    });
    setEditingButton(null);
  };

  const handleRemoveButton = (buttonId: string) => {
    const currentButtons = formData.buttons || [];
    handleInputChange("buttons", currentButtons.filter(btn => btn.id !== buttonId));
    
    // If we were editing this button, cancel the edit
    if (editingButton === buttonId) {
      handleCancelEdit();
    }
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
        buttons: [],
      });
      setNewButton({ label: "", style: "primary", url: "" });
      setEditingButton(null);
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

  const buttonStyles = [
    { value: "primary", label: "Primary (Blue)", color: "bg-blue-600" },
    { value: "secondary", label: "Secondary (Gray)", color: "bg-gray-600" },
    { value: "success", label: "Success (Green)", color: "bg-green-600" },
    { value: "danger", label: "Danger (Red)", color: "bg-red-600" },
    { value: "link", label: "Link Style", color: "bg-transparent border" },
  ];

  const getButtonVariant = (style: CustomButton['style']) => {
    switch (style) {
      case 'primary': return 'default';
      case 'danger': return 'destructive';
      case 'success': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - Form */}
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 p-1 bg-gray-100 dark:bg-gray-900 rounded-lg">
          {[
            { id: "compose", label: "Compose", icon: Upload },
            { id: "users", label: "Recipients", icon: Users },
            { id: "schedule", label: "Schedule", icon: Calendar },
            { id: "buttons", label: "Buttons", icon: Mouse },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "compose" | "users" | "schedule" | "buttons")}
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
              {tab.id === "buttons" && formData.buttons && formData.buttons.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {formData.buttons.length}
                </Badge>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[500px]">
          {activeTab === "compose" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Message Composer</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="🤖 Super Connector Agent is here!"
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
                    placeholder="Introduce features, updates, and quick actions to engage your users."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={3}
                    className="text-sm resize-none"
                  />
                  <p className="text-xs text-gray-500">
                    {formData.description.length}/4096 characters
                  </p>
                </div>

                {/* Media Upload */}
                <MediaUploader
                  onImageUpload={handleImageUpload}
                  largeImageUrl={formData.largeImageUrl}
                  thumbnailUrl={formData.thumbnailUrl}
                />
              </CardContent>
            </Card>
          )}

          {activeTab === "buttons" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mouse className="w-5 h-5" />
                  <span>Interactive Buttons</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add/Edit Button Form */}
                <div className="space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">
                      {editingButton ? "Edit Button" : "Add New Button"}
                    </h4>
                    {editingButton && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelEdit}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="buttonLabel">Button Text *</Label>
                      <Input
                        id="buttonLabel"
                        placeholder="e.g., Visit Website"
                        value={newButton.label || ""}
                        onChange={(e) => setNewButton(prev => ({ ...prev, label: e.target.value }))}
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="buttonStyle">Button Style</Label>
                      <Select 
                        value={newButton.style || "primary"} 
                        onValueChange={(value: CustomButton['style']) => 
                          setNewButton(prev => ({ ...prev, style: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {buttonStyles.map((style) => (
                            <SelectItem key={style.value} value={style.value}>
                              <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded ${style.color}`}></div>
                                <span>{style.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="buttonUrl">URL (Optional)</Label>
                    <div className="relative">
                      <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="buttonUrl"
                        type="url"
                        placeholder="https://example.com"
                        value={newButton.url || ""}
                        onChange={(e) => setNewButton(prev => ({ ...prev, url: e.target.value }))}
                        className="text-sm pl-10"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={editingButton ? handleUpdateButton : handleAddButton}
                    disabled={!newButton.label?.trim() || (formData.buttons?.length || 0) >= 5}
                    className="w-full"
                  >
                    {editingButton ? (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Update Button
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Button
                      </>
                    )}
                  </Button>
                </div>

                {/* Existing Buttons */}
                {formData.buttons && formData.buttons.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Current Buttons ({formData.buttons.length}/5)</h4>
                      <div className="text-xs text-gray-500">
                        {5 - formData.buttons.length} remaining
                      </div>
                    </div>
                    
                    {formData.buttons.map((button, index) => (
                      <div key={button.id} className={`
                        flex items-center justify-between p-3 border rounded-lg transition-colors
                        ${editingButton === button.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}
                      `}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge 
                              variant={getButtonVariant(button.style)}
                              className={`
                                ${button.style === 'success' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
                                ${button.style === 'link' ? 'bg-transparent border text-blue-600' : ''}
                              `}
                            >
                              {button.style}
                            </Badge>
                            <span className="font-medium truncate">{button.label}</span>
                          </div>
                          {button.url && (
                            <p className="text-xs text-gray-500 truncate flex items-center">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              {button.url}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditButton(button.id)}
                            className="text-gray-600 hover:text-gray-800"
                            disabled={editingButton !== null && editingButton !== button.id}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveButton(button.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {formData.buttons && formData.buttons.length >= 5 && (
                  <div className="text-sm text-amber-600 bg-amber-50 dark:bg-amber-950/50 p-3 rounded-lg">
                    Maximum of 5 buttons allowed per message. Remove a button to add a new one.
                  </div>
                )}
              </CardContent>
            </Card>
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
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border">
          <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
            <span>Recipients: {formData.targetUsers.length}</span>
            {formData.buttons && formData.buttons.length > 0 && (
              <span>• Buttons: {formData.buttons.length}</span>
            )}
            {formData.scheduledAt && (
              <span>• Scheduled: {formData.scheduledAt.toLocaleString()}</span>
            )}
          </div>

          <div className="flex items-center space-x-2">
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

      {/* Right Column - Preview */}
      <div className="space-y-6">
        <MessagePreview
          title={formData.title}
          description={formData.description}
          color={formData.color}
          largeImageUrl={formData.largeImageUrl}
          thumbnailUrl={formData.thumbnailUrl}
          targetUsers={formData.targetUsers}
          buttons={formData.buttons}
        />
      </div>
    </div>
  );
}