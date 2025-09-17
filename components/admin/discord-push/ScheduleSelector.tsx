"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScheduleSelectorProps } from "@/types/admin/discordPush";
import { Calendar as CalendarIcon, Clock, X } from "lucide-react";
import { format, addMinutes, startOfMinute } from "date-fns";

export function ScheduleSelector({ 
  scheduledAt, 
  onScheduleChange 
}: ScheduleSelectorProps) {
  const [isScheduled, setIsScheduled] = useState(!!scheduledAt);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    scheduledAt || undefined
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    scheduledAt ? format(scheduledAt, "HH:mm") : "09:00"
  );

  const handleScheduleToggle = (enabled: boolean) => {
    setIsScheduled(enabled);
    if (!enabled) {
      onScheduleChange(undefined);
      setSelectedDate(undefined);
    } else {
      // Set default to current date + 1 hour
      const defaultDate = addMinutes(startOfMinute(new Date()), 60);
      setSelectedDate(defaultDate);
      setSelectedTime(format(defaultDate, "HH:mm"));
      onScheduleChange(defaultDate);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    
    // Combine date with selected time
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const combinedDate = new Date(date);
    combinedDate.setHours(hours, minutes, 0, 0);
    
    onScheduleChange(combinedDate);
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    
    if (selectedDate) {
      const [hours, minutes] = time.split(":").map(Number);
      const combinedDate = new Date(selectedDate);
      combinedDate.setHours(hours, minutes, 0, 0);
      
      onScheduleChange(combinedDate);
    }
  };

  const clearSchedule = () => {
    setIsScheduled(false);
    setSelectedDate(undefined);
    onScheduleChange(undefined);
  };

  const quickScheduleOptions = [
    { label: "In 1 hour", minutes: 60 },
    { label: "In 4 hours", minutes: 240 },
    { label: "Tomorrow 9 AM", minutes: null, customDate: true },
    { label: "Next week", minutes: 7 * 24 * 60 },
  ];

  const handleQuickSchedule = (option: typeof quickScheduleOptions[0]) => {
    const now = new Date();
    let scheduledDate: Date;

    if (option.customDate && option.label === "Tomorrow 9 AM") {
      scheduledDate = new Date(now);
      scheduledDate.setDate(scheduledDate.getDate() + 1);
      scheduledDate.setHours(9, 0, 0, 0);
    } else if (option.minutes) {
      scheduledDate = addMinutes(now, option.minutes);
    } else {
      return;
    }

    setIsScheduled(true);
    setSelectedDate(scheduledDate);
    setSelectedTime(format(scheduledDate, "HH:mm"));
    onScheduleChange(scheduledDate);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <Label className="text-base font-semibold">Schedule Message</Label>
        </div>
        <Switch
          checked={isScheduled}
          onCheckedChange={handleScheduleToggle}
        />
      </div>

      {isScheduled && (
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
          {/* Quick Schedule Options */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quick Schedule</Label>
            <div className="flex flex-wrap gap-2">
              {quickScheduleOptions.map((option) => (
                <Button
                  key={option.label}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSchedule(option)}
                  className="text-xs"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Picker */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Input */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Time</Label>
              <Input
                type="time"
                value={selectedTime}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Scheduled Summary */}
          {scheduledAt && (
            <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <div>
                <p className="text-sm font-medium text-primary">
                  Scheduled for: {format(scheduledAt, "PPP 'at' p")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {scheduledAt > new Date() 
                    ? `In ${Math.ceil((scheduledAt.getTime() - new Date().getTime()) / (1000 * 60 * 60))} hours`
                    : "Past date - please select a future date"
                  }
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearSchedule}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            <p>• Messages will be sent automatically at the scheduled time</p>
            <p>• You can edit or cancel scheduled messages before they are sent</p>
            <p>• All times are in your local timezone</p>
          </div>
        </div>
      )}
    </div>
  );
}
