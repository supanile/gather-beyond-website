"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageComposer } from "./MessageComposer";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import { MessageComposerForm, DiscordMessage } from "@/types/admin/discordPush";
import { mockDiscordMessages } from "@/data/admin/discordPushMockData";
import { 
  MessageSquare, 
  BarChart3, 
  Send, 
  Calendar, 
  Clock, 
  Users,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { format } from "date-fns";

export function DiscordPushPage() {
  const [activeTab, setActiveTab] = useState("composer");
  const [messages, setMessages] = useState<DiscordMessage[]>(mockDiscordMessages);

  const handleSendMessage = async (messageData: MessageComposerForm) => {
    console.log("Sending message immediately:", messageData);
    
    const newMessage: DiscordMessage = {
      id: `msg_${Date.now()}`,
      title: messageData.title,
      description: messageData.description,
      color: messageData.color,
      largeImageUrl: messageData.largeImageUrl || undefined,
      thumbnailUrl: messageData.thumbnailUrl || undefined,
      createdAt: new Date().toISOString(),
      status: "sent",
      targetUsers: messageData.targetUsers,
      deliveryStats: {
        totalSent: messageData.targetUsers.length,
        delivered: messageData.targetUsers.length,
        failed: 0,
        opened: 0,
        clickThrough: 0,
        deliveryRate: 100,
        openRate: 0,
        clickThroughRate: 0
      }
    };

    setMessages(prev => [newMessage, ...prev]);
    // Here you would integrate with your Discord bot API
  };

  const handleScheduleMessage = async (messageData: MessageComposerForm, scheduledAt: Date) => {
    console.log("Scheduling message:", messageData, "for", scheduledAt);
    
    const newMessage: DiscordMessage = {
      id: `msg_${Date.now()}`,
      title: messageData.title,
      description: messageData.description,
      color: messageData.color,
      largeImageUrl: messageData.largeImageUrl || undefined,
      thumbnailUrl: messageData.thumbnailUrl || undefined,
      createdAt: new Date().toISOString(),
      scheduledAt: scheduledAt.toISOString(),
      status: "scheduled",
      targetUsers: messageData.targetUsers,
      deliveryStats: {
        totalSent: 0,
        delivered: 0,
        failed: 0,
        opened: 0,
        clickThrough: 0,
        deliveryRate: 0,
        openRate: 0,
        clickThroughRate: 0
      }
    };

    setMessages(prev => [newMessage, ...prev]);
  };

  const handleSaveDraft = async (messageData: MessageComposerForm) => {
    console.log("Saving draft:", messageData);
    
    const newMessage: DiscordMessage = {
      id: `msg_${Date.now()}`,
      title: messageData.title,
      description: messageData.description,
      color: messageData.color,
      largeImageUrl: messageData.largeImageUrl || undefined,
      thumbnailUrl: messageData.thumbnailUrl || undefined,
      createdAt: new Date().toISOString(),
      status: "draft",
      targetUsers: messageData.targetUsers,
      deliveryStats: {
        totalSent: 0,
        delivered: 0,
        failed: 0,
        opened: 0,
        clickThrough: 0,
        deliveryRate: 0,
        openRate: 0,
        clickThroughRate: 0
      }
    };

    setMessages(prev => [newMessage, ...prev]);
  };

  const getStatusBadge = (status: DiscordMessage["status"]) => {
    const variants = {
      sent: { variant: "default" as const, label: "Sent", icon: Send },
      scheduled: { variant: "secondary" as const, label: "Scheduled", icon: Calendar },
      draft: { variant: "outline" as const, label: "Draft", icon: Edit },
      failed: { variant: "destructive" as const, label: "Failed", icon: Trash2 }
    };

    const { variant, label, icon: Icon } = variants[status];
    
    return (
      <Badge variant={variant} className="flex items-center space-x-1">
        <Icon className="w-3 h-3" />
        <span>{label}</span>
      </Badge>
    );
  };

  const sentMessages = messages.filter(m => m.status === "sent");
  const scheduledMessages = messages.filter(m => m.status === "scheduled");
  const draftMessages = messages.filter(m => m.status === "draft");
  const totalRecipients = sentMessages.reduce((sum, msg) => sum + msg.targetUsers.length, 0);

  const statItems = [
    {
      title: "Sent Messages",
      value: sentMessages.length,
      icon: Send,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Scheduled",
      value: scheduledMessages.length,
      icon: Calendar,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Draft Messages",
      value: draftMessages.length,
      icon: Edit,
      color: "text-gray-600 dark:text-gray-400",
      bgColor: "bg-gray-100 dark:bg-gray-900/20",
    },
    {
      title: "Total Recipients",
      value: totalRecipients,
      icon: Users,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item) => (
          <Card key={item.title} className="transition-all hover:shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${item.bgColor}`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                    {item.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {item.value.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="composer" className="flex items-center space-x-2 text-sm">
            <MessageSquare className="w-4 h-4" />
            <span>Compose</span>
          </TabsTrigger>
          {/* <TabsTrigger value="analytics" className="flex items-center space-x-2 text-sm">
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-2 text-sm">
            <Clock className="w-4 h-4" />
            <span>History</span>
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="composer">
          <MessageComposer
            onSendMessage={handleSendMessage}
            onScheduleMessage={handleScheduleMessage}
            onSaveDraft={handleSaveDraft}
          />
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Message History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No messages yet. Create your first message in the Compose tab.
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {message.title}
                          </h3>
                          {getStatusBadge(message.status)}
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                          {message.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{message.targetUsers.length} recipients</span>
                          </span>
                          
                          <span>
                            Created: {format(new Date(message.createdAt), "MMM dd, yyyy HH:mm")}
                          </span>
                          
                          {message.scheduledAt && (
                            <span>
                              Scheduled: {format(new Date(message.scheduledAt), "MMM dd, yyyy HH:mm")}
                            </span>
                          )}
                          
                          {message.deliveryStats && message.deliveryStats.totalSent > 0 && (
                            <span className="flex items-center space-x-1">
                              <Eye className="w-3 h-3" />
                              <span>{message.deliveryStats.openRate}% opened</span>
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}