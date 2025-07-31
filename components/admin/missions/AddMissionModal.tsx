"use client";

import React, { useEffect, useState } from "react";
import { Plus, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  NewMissionForm,
  PARTNER_OPTIONS,
  TYPE_OPTIONS,
  PLATFORM_OPTIONS,
} from "@/types/admin/missions/missionTypes";

// Import the Mission Targeting Form component
import MissionTargetingForm from "./MissionTargetingForm";

// Define targeting data interface
interface MissionTargetingData {
  audienceType: "global" | "custom";
  behaviorFilters: {
    xpLevel: { enabled: boolean; min: number; max: number };
    missionStreak: { enabled: boolean; value: number };
    lastActive: { enabled: boolean; value: string };
    failedMissions: { enabled: boolean; value: number };
    trustScore: { enabled: boolean; value: number[] };
    connectedWallet: { enabled: boolean; value: boolean };
    joinedViaPartner: { enabled: boolean; value: string };
    referredUsers: { enabled: boolean; value: number };
    agentHealth: { enabled: boolean; value: number[] };
    memoryProofSubmitted: { enabled: boolean; value: boolean };
    taggedInterests: { enabled: boolean; value: string[] };
  };
  demographicFilters: {
    location: string[];
    language: string[];
    ageRange: string;
    gender: string;
  };
  deliveryOptions: {
    channel: string;
    scope: string;
    schedule: string;
    scheduledDate: string;
  };
}

interface AddMissionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newMission: NewMissionForm;
  onMissionChange: (
    mission: NewMissionForm | ((prev: NewMissionForm) => NewMissionForm)
  ) => void;
  onSubmit: () => Promise<void>;
  isEditMode?: boolean;
  title?: string;
}

// Time picker component
const TimePicker = ({
  value,
  onChange,
}: {
  value?: string;
  onChange: (time: string) => void;
  placeholder?: string;
}) => {
  const [hours, setHours] = useState(value ? value.split(":")[0] : "12");
  const [minutes, setMinutes] = useState(value ? value.split(":")[1] : "00");

  const updateTime = (newHours: string, newMinutes: string) => {
    const timeString = `${newHours.padStart(2, "0")}:${newMinutes.padStart(
      2,
      "0"
    )}`;
    onChange(timeString);
  };

  return (
    <div className="flex items-center space-x-2">
      <Select
        value={hours}
        onValueChange={(newHours) => {
          setHours(newHours);
          updateTime(newHours, minutes);
        }}
      >
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 24 }, (_, i) => (
            <SelectItem key={i} value={i.toString().padStart(2, "0")}>
              {i.toString().padStart(2, "0")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-muted-foreground">:</span>
      <Select
        value={minutes}
        onValueChange={(newMinutes) => {
          setMinutes(newMinutes);
          updateTime(hours, newMinutes);
        }}
      >
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 60 }, (_, i) => (
            <SelectItem key={i} value={i.toString().padStart(2, "0")}>
              {i.toString().padStart(2, "0")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

// DateTime picker component
const DateTimePicker = ({
  value,
  onChange,
  placeholder = "Pick a date and time",
}: {
  value?: string;
  onChange: (datetime: string) => void;
  placeholder?: string;
}) => {
  const [date, setDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );
  const [time, setTime] = useState<string>(
    value ? format(new Date(value), "HH:mm") : "12:00"
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      const [hours, minutes] = time.split(":");
      selectedDate.setHours(parseInt(hours), parseInt(minutes));
      onChange(selectedDate.toISOString().slice(0, 16));
    }
  };

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    if (date) {
      const [hours, minutes] = newTime.split(":");
      const newDate = new Date(date);
      newDate.setHours(parseInt(hours), parseInt(minutes));
      onChange(newDate.toISOString().slice(0, 16));
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "PPP") + " at " + time
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 border-b">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
        </div>
        <div className="p-3">
          <Label className="text-sm font-medium mb-2 block">Time</Label>
          <TimePicker value={time} onChange={handleTimeChange} />
        </div>
        <div className="p-3 pt-0">
          <Button className="w-full" onClick={() => setIsOpen(false)} size="sm">
            Confirm
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const AddMissionModal: React.FC<AddMissionModalProps> = ({
  isOpen,
  onOpenChange,
  newMission,
  onMissionChange,
  onSubmit,
  isEditMode = false,
  title = "Add New Mission",
}) => {
  // State for mission targeting
  const [missionTargeting, setMissionTargeting] =
    useState<MissionTargetingData | null>(null);

  // Debug effect to log incoming data
  useEffect(() => {
    if (isOpen) {
      console.log("🔧 AddMissionModal opened with data:", newMission);
      console.log("🔧 Partner value:", newMission.partner);
    }
  }, [isOpen, newMission]);

  const handleInputChange = (
    field: keyof NewMissionForm,
    value: string | number
  ) => {
    console.log(`🔧 Field ${field} changed to:`, value);
    onMissionChange((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };
      console.log(`🔧 Updated form state for ${field}:`, updated[field]);
      console.log(`🔧 Full updated form state:`, updated);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔧 Submitting form with data:", newMission);
    console.log("🔧 Mission targeting data:", missionTargeting);

    // You can process targeting data here before submission
    // For now, we'll just submit the mission as usual
    await onSubmit();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {!isEditMode && (
        <DialogTrigger asChild>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Mission
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic-info" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic-info">Basic Information</TabsTrigger>
              <TabsTrigger value="targeting">Mission Targeting</TabsTrigger>
            </TabsList>

            <TabsContent value="basic-info" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={newMission.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter mission title"
                    className="w-full"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={newMission.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Enter mission description"
                    rows={4}
                    className="w-full resize-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Type */}
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm font-medium">
                    Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={newMission.type || ""}
                    onValueChange={(value) => handleInputChange("type", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {TYPE_OPTIONS.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Platform */}
                <div className="space-y-2">
                  <Label htmlFor="platform" className="text-sm font-medium">
                    Platform <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={newMission.platform || ""}
                    onValueChange={(value) =>
                      handleInputChange("platform", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {PLATFORM_OPTIONS.map((platform) => (
                        <SelectItem key={platform.value} value={platform.value}>
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Partner */}
                <div className="space-y-2">
                  <Label htmlFor="partner" className="text-sm font-medium">
                    Partner <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={newMission.partner && newMission.partner.trim() !== "" ? newMission.partner : undefined}
                    onValueChange={(value) => {
                      console.log("🔧 Partner selected:", value);
                      handleInputChange("partner", value);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select partner" />
                    </SelectTrigger>
                    <SelectContent>
                      {PARTNER_OPTIONS.map((partner) => (
                        <SelectItem key={partner} value={partner}>
                          {partner}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Level Required */}
                <div className="space-y-2">
                  <Label
                    htmlFor="level_required"
                    className="text-sm font-medium"
                  >
                    Level Required
                  </Label>
                  <Input
                    id="level_required"
                    type="number"
                    value={newMission.level_required || 1}
                    onChange={(e) =>
                      handleInputChange(
                        "level_required",
                        parseInt(e.target.value) || 1
                      )
                    }
                    min="1"
                    placeholder="1"
                    className="w-full"
                  />
                </div>
                {/* Reward */}
                <div className="space-y-2">
                  <Label htmlFor="reward" className="text-sm font-medium">
                    Reward
                  </Label>
                  <Input
                    id="reward"
                    value={newMission.reward || ""}
                    onChange={(e) =>
                      handleInputChange("reward", e.target.value)
                    }
                    placeholder='{"amount": "100", "token": "XP"}'
                    className="w-full font-mono text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Format */}
                <div className="space-y-2">
                  <Label htmlFor="format" className="text-sm font-medium">
                    Format
                  </Label>
                  <Input
                    id="format"
                    value={newMission.format || ""}
                    onChange={(e) =>
                      handleInputChange("format", e.target.value)
                    }
                    placeholder="Enter format"
                    className="w-full"
                  />
                </div>

                {/* Useful Link */}
                <div className="space-y-2">
                  <Label htmlFor="useful_link" className="text-sm font-medium">
                    Useful Link
                  </Label>
                  <Input
                    id="useful_link"
                    type="url"
                    value={newMission.useful_link || ""}
                    onChange={(e) =>
                      handleInputChange("useful_link", e.target.value)
                    }
                    placeholder="https://example.com"
                    className="w-full"
                  />
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-medium">
                    Start Date & Time
                  </Label>
                  <DateTimePicker
                    value={newMission.startDate}
                    onChange={(value) => handleInputChange("startDate", value)}
                    placeholder="Select start date and time"
                  />
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-sm font-medium">
                    End Date & Time
                  </Label>
                  <DateTimePicker
                    value={newMission.endDate}
                    onChange={(value) => handleInputChange("endDate", value)}
                    placeholder="Select end date and time"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Action Request */}
                <div className="space-y-2">
                  <Label
                    htmlFor="action_request"
                    className="text-sm font-medium"
                  >
                    Action Request
                  </Label>
                  <Textarea
                    id="action_request"
                    value={newMission.action_request || ""}
                    onChange={(e) =>
                      handleInputChange("action_request", e.target.value)
                    }
                    placeholder="Enter action request"
                    rows={3}
                    className="w-full resize-none"
                  />
                </div>

                {/* Requirements - Full width */}
                <div className="space-y-2">
                  <Label htmlFor="requirements" className="text-sm font-medium">
                    Requirements
                  </Label>
                  <Textarea
                    id="requirements"
                    value={newMission.requirements || ""}
                    onChange={(e) =>
                      handleInputChange("requirements", e.target.value)
                    }
                    placeholder="Enter requirements"
                    rows={3}
                    className="w-full resize-none"
                  />
                </div>

                {/* Regex Pattern - Full width */}
                <div className="space-y-2">
                  <Label htmlFor="regex" className="text-sm font-medium">
                    Regex Pattern
                  </Label>
                  <Input
                    id="regex"
                    value={newMission.regex || ""}
                    onChange={(e) => handleInputChange("regex", e.target.value)}
                    placeholder="Enter regex pattern"
                    className="w-full font-mono text-sm"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="targeting" className="space-y-6 mt-6">
              <MissionTargetingForm
                onTargetingChange={setMissionTargeting}
                initialData={missionTargeting}
              />
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2"
              >
                👁️ Preview Mission
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2"
              >
                💾 Save Draft
              </Button>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 px-6"
              >
                {isEditMode ? "Update Mission" : "🚀 Publish to Audience"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
