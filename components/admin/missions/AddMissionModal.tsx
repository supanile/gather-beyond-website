"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Plus,
  CalendarIcon,
  AlertCircle,
  CheckCircle,
  X,
  Save,
  RefreshCw,
  Send,
  Eye,
} from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  NewMissionForm,
  PARTNER_OPTIONS,
  TYPE_OPTIONS,
  PLATFORM_OPTIONS,
  FORMAT_OPTIONS,
  MissionTargetingData,
} from "@/types/admin/missions/missionTypes";

// Import the Mission Targeting Form component
import MissionTargetingForm from "./MissionTargetingForm";
// Import the new Preview Modal component
import { MissionPreviewModal } from "./MissionPreviewModal";

// Define the NewMissionForm interface
interface DraftData {
  basicInfo: NewMissionForm;
  targetingData: MissionTargetingData | null;
  savedAt: string;
}

interface AddMissionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newMission: NewMissionForm;
  onMissionChange: (
    mission: NewMissionForm | ((prev: NewMissionForm) => NewMissionForm)
  ) => void;
  onSubmit: () => Promise<void>;
  onSaveDraft?: () => Promise<void>;
  isEditMode?: boolean;
  title?: string;
  isSubmitting?: boolean;
}

// Validation errors interface with level_required
interface ValidationErrors {
  title?: string;
  description?: string;
  type?: string;
  platform?: string;
  partner?: string;
  reward?: string;
  format?: string;
  useful_link?: string;
  startDate?: string;
  endDate?: string;
  action_request?: string;
  requirements?: string;
  level_required?: string;
  discordServers?: string;
}

// interface for notification alert
interface NotificationAlert {
  show: boolean;
  type: "success" | "error";
  title: string;
  description: string;
}

// Enhanced DateTime picker
const DateTimePicker = ({
  value,
  onChange,
  placeholder = "Pick a date and time",
  error,
}: {
  value?: string;
  onChange: (datetime: string) => void;
  placeholder?: string;
  error?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  const parseISOToLocal = (isoString: string) => {
    // Parse the ISO string manually to avoid timezone conversion
    const match = isoString.match(
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/
    );
    if (match) {
      return {
        year: parseInt(match[1]),
        month: parseInt(match[2]) - 1,
        day: parseInt(match[3]),
        hours: parseInt(match[4]),
        minutes: parseInt(match[5]),
      };
    }

    const date = new Date(isoString);
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
      hours: date.getHours(),
      minutes: date.getMinutes(),
    };
  };

  // Separate state for hours, minutes using parsed values
  const [hours, setHours] = useState<string>(() => {
    if (value) {
      const parsed = parseISOToLocal(value);
      return String(parsed.hours).padStart(2, "0");
    }
    return "12";
  });

  const [minutes, setMinutes] = useState<string>(() => {
    if (value) {
      const parsed = parseISOToLocal(value);
      return String(parsed.minutes).padStart(2, "0");
    }
    return "00";
  });

  const updateDateTime = (date: Date, h: string, m: string) => {
    if (date && h && m) {
      // สร้าง Date object ใหม่โดยใช้ local timezone
      const year = date.getFullYear();
      const month = date.getMonth(); // เก็บเป็น 0-based index
      const day = date.getDate();
      const hour = parseInt(h);
      const minute = parseInt(m);

      // สร้าง Date object ใหม่โดยใช้ constructor ที่รักษา local timezone
      const localDateTime = new Date(year, month, day, hour, minute, 0);

      // แปลงเป็น ISO string โดยใช้ local timezone
      const isoString = localDateTime.toISOString();

      console.log(
        `Setting time: ${h}:${m} -> Local DateTime: ${localDateTime.toString()} -> ISO: ${isoString}`
      );
      onChange(isoString);
    }
  };

  // Update local state when value prop changes
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      const newHours = String(date.getHours()).padStart(2, "0");
      const newMinutes = String(date.getMinutes()).padStart(2, "0");

      // Only update if the values are actually different to prevent loops
      if (
        !selectedDate ||
        selectedDate.getTime() !== date.getTime() ||
        hours !== newHours ||
        minutes !== newMinutes
      ) {
        setSelectedDate(date);
        setHours(newHours);
        setMinutes(newMinutes);
      }
    } else if (!value && selectedDate) {
      // Only clear if currently has a value
      setSelectedDate(undefined);
      setHours("12");
      setMinutes("00");
    }
  }, [value, selectedDate, hours, minutes]);

  // Generate options for dropdowns
  const hourOptions = Array.from({ length: 24 }, (_, i) => ({
    value: String(i).padStart(2, "0"),
    label: String(i).padStart(2, "0"),
  }));

  const minuteOptions = Array.from({ length: 60 }, (_, i) => ({
    value: String(i).padStart(2, "0"),
    label: String(i).padStart(2, "0"),
  }));

  // Format date for display
  const formatDisplayDate = (date: Date | undefined): string => {
    if (!date) return placeholder;

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handle date selection from calendar
  const handleDateSelect = (date: Date | undefined) => {
    console.log("Date selected:", date);
    if (date) {
      setSelectedDate(date);
      updateDateTime(date, hours, minutes);
    }
  };

  // Handle time changes - NOW defined AFTER updateDateTime
  const handleHoursChange = (newHours: string) => {
    setHours(newHours);
    if (selectedDate) {
      updateDateTime(selectedDate, newHours, minutes);
    }
  };

  const handleMinutesChange = (newMinutes: string) => {
    setMinutes(newMinutes);
    if (selectedDate) {
      updateDateTime(selectedDate, hours, newMinutes);
    }
  };

  // Current year for calendar year limitation
  const fromYear = 2025;
  const toYear = 2025;

  return (
    <div className="relative w-full">
      <Popover modal={true} open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal h-10 px-3",
              "hover:bg-accent hover:text-accent-foreground",
              "focus:ring-2 focus:ring-ring focus:ring-offset-2",
              !selectedDate && "text-muted-foreground",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500"
            )}
          >
            <CalendarIcon className="mr-3 h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <span className="flex-1">{formatDisplayDate(selectedDate)}</span>
              {selectedDate && (
                <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
                  <span className="text-muted-foreground">at</span>
                  <span className="font-medium">
                    {hours}:{minutes}
                  </span>
                </div>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
          side="bottom"
          sideOffset={4}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div
            className="flex flex-col"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Calendar with limited year range */}
            <Calendar
              mode="single"
              selected={selectedDate}
              captionLayout="dropdown"
              fromYear={fromYear}
              toYear={toYear}
              onSelect={handleDateSelect}
              disabled={(date) =>
                date < new Date(new Date().setHours(0, 0, 0, 0))
              }
              className="border-0 border-b rounded-none"
            />

            {/* Time Picker with Dropdowns */}
            <div className="border-t bg-muted/50 p-3">
              <Label className="text-xs text-muted-foreground mb-3 block">
                Time
              </Label>
              <div className="flex items-center gap-2">
                {/* Hours Dropdown */}
                <div className="flex flex-col items-center gap-1">
                  <Label className="text-xs text-muted-foreground">Hours</Label>
                  <Select value={hours} onValueChange={handleHoursChange}>
                    <SelectTrigger className="w-20 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {hourOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <span className="text-muted-foreground mt-5">:</span>

                {/* Minutes Dropdown */}
                <div className="flex flex-col items-center gap-1">
                  <Label className="text-xs text-muted-foreground">
                    Minutes
                  </Label>
                  <Select value={minutes} onValueChange={handleMinutesChange}>
                    <SelectTrigger className="w-20 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {minuteOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Quick Actions - Only Now button */}
            <div className="flex gap-1 p-2 border-t bg-background">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full h-8 text-xs"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  const now = new Date();
                  setSelectedDate(now);
                  const currentHours = String(now.getHours()).padStart(2, "0");
                  const currentMinutes = String(now.getMinutes()).padStart(
                    2,
                    "0"
                  );
                  setHours(currentHours);
                  setMinutes(currentMinutes);

                  // ใช้ฟังก์ชัน updateDateTime ที่แก้ไขแล้ว
                  updateDateTime(now, currentHours, currentMinutes);
                  setTimeout(() => setIsOpen(false), 100);
                }}
              >
                Now
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

// Reward Input Component
const RewardInput = ({
  value,
  onChange,
  error,
}: {
  value?: string;
  onChange: (value: string) => void;
  error?: boolean;
}) => {
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("XP");

  // Token options
  const TOKEN_OPTIONS = [
    { value: "XP", label: "XP" },
    { value: "COINS", label: "Coins" },
    { value: "GEMS", label: "Gems" },
    { value: "TOKENS", label: "Tokens" },
    { value: "POINTS", label: "Points" },
    { value: "CREDITS", label: "Credits" },
  ];

  // Parse existing value on component mount and when value changes
  useEffect(() => {
    if (value && value.trim()) {
      try {
        const parsed = JSON.parse(value);
        if (
          parsed.amount !== undefined &&
          parsed.amount.toString() !== amount
        ) {
          setAmount(parsed.amount.toString());
        }
        if (parsed.token && parsed.token !== token) {
          setToken(parsed.token);
        }
      } catch {
        // If parsing fails, keep existing value
      }
    }
    // Only depend on value, not amount or token to avoid loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Update parent component when amount or token changes
  const updateReward = (newAmount: string, newToken: string) => {
    if (newAmount && newToken) {
      const rewardObject = {
        amount: parseInt(newAmount) || 0,
        token: newToken,
      };
      onChange(JSON.stringify(rewardObject));
    } else {
      onChange("");
    }
  };

  const handleAmountChange = (newAmount: string) => {
    setAmount(newAmount);
    updateReward(newAmount, token);
  };

  const handleTokenChange = (newToken: string) => {
    setToken(newToken);
    updateReward(amount, newToken);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-3">
        {/* Amount Input */}
        <div className="space-y-2 col-span-1">
          <Label
            htmlFor="reward-amount"
            className="text-xs text-muted-foreground"
          >
            Amount
          </Label>
          <Input
            id="reward-amount"
            type="number"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="100"
            min="0"
            className={cn("w-full", error && "border-red-500")}
          />
        </div>

        {/* Token Select */}
        <div className="space-y-2 col-span-1">
          <Label
            htmlFor="reward-token"
            className="text-xs text-muted-foreground"
          >
            Token Type
          </Label>
          <Select value={token} onValueChange={handleTokenChange}>
            <SelectTrigger className={cn("w-full", error && "border-red-500")}>
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent>
              {TOKEN_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* JSON Preview - 2/4 */}
        {amount && token && (
          <div className="space-y-2 col-span-2">
            <Label className="text-xs text-muted-foreground">
              JSON Output:
            </Label>
            <div className="p-2 bg-muted/50 rounded-md border min-h-[40px] flex items-start">
              <div className="text-xs font-mono text-foreground whitespace-pre-wrap break-all">
                {`{"amount": ${parseInt(amount) || 0}, "token": "${token}"}`}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const AddMissionModal: React.FC<AddMissionModalProps> = ({
  isOpen,
  onOpenChange,
  newMission,
  onMissionChange,
  onSubmit,
  onSaveDraft,
  isEditMode = false,
  title = "Add New Mission",
  isSubmitting = false,
}) => {
  // State for mission targeting
  const [missionTargeting, setMissionTargeting] =
    useState<MissionTargetingData | null>(null);

  // Memoized callback for targeting changes to prevent infinite loops
  const handleTargetingChange = useCallback(
    (data: MissionTargetingData | null) => {
      console.log("🎯 handleTargetingChange called with:", data);
      setMissionTargeting(data);

      // Also update parent component immediately
      onMissionChange((prev) => {
        const updated = {
          ...prev,
          missionTargeting: data,
        };
        console.log("🎯 Updated mission with targeting:", updated);
        return updated;
      });
    },
    [onMissionChange]
  );

  // Internal loading state for better UX
  const [internalLoading, setInternalLoading] = useState(false);

  // Preview modal state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // draft key
  const draftKey = `mission_draft_${
    isEditMode ? newMission.title || "edit" : "new"
  }`;
  const isLoading = isSubmitting || internalLoading;

  // validation errors state
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [showValidationAlert, setShowValidationAlert] = useState(false);

  // state for notification alert
  const [notificationAlert, setNotificationAlert] = useState<NotificationAlert>(
    {
      show: false,
      type: "success",
      title: "",
      description: "",
    }
  );

  // missing handlePreviewMission function
  const handlePreviewMission = () => {
    setIsPreviewOpen(true);
  };

  // Fixed Functions for draft with localStorage
  const saveDraft = useCallback(() => {
    try {
      const draftData: DraftData = {
        basicInfo: newMission,
        targetingData: missionTargeting,
        savedAt: new Date().toISOString(),
      };

      // Save to localStorage
      localStorage.setItem(draftKey, JSON.stringify(draftData));
      console.log("Draft saved successfully:", draftKey);
      return true;
    } catch (error) {
      console.error("Error saving draft:", error);
      return false;
    }
  }, [draftKey, newMission, missionTargeting]);

  const clearDraft = () => {
    try {
      localStorage.removeItem(draftKey);
      console.log("Draft cleared:", draftKey);
    } catch (error) {
      console.error("Error clearing draft:", error);
    }
  };

  // useEffect for load draft
  useEffect(() => {
    if (isOpen && !isEditMode) {
      // check if there is a draft
      try {
        const savedDraft = localStorage.getItem(draftKey);
        if (savedDraft) {
          const draftData: DraftData = JSON.parse(savedDraft);

          // Load basic info
          onMissionChange(draftData.basicInfo);

          // Load targeting data
          if (draftData.targetingData) {
            setMissionTargeting(draftData.targetingData);
          }

          console.log("Draft loaded successfully:", draftKey);

          // show notification that draft has been loaded
          setNotificationAlert({
            show: true,
            type: "success",
            title: "Draft Loaded",
            description: "Your previously saved draft has been loaded.",
          });
        }
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    }
  }, [isOpen, isEditMode, draftKey, onMissionChange]);

  // useEffect for edit mode - load existing mission targeting data
  useEffect(() => {
    if (isOpen && isEditMode) {
      console.log("=== EDIT MODE LOADING ===");
      console.log("newMission:", newMission);
      console.log("newMission.missionTargeting:", newMission.missionTargeting);
      console.log("newMission.serverId:", newMission.serverId);

      // Load targeting data from existing mission
      if (newMission.missionTargeting) {
        console.log("Loading from newMission.missionTargeting");
        setMissionTargeting(newMission.missionTargeting);
      } else if (newMission.serverId) {
        // If serverId exists but no missionTargeting, reconstruct targeting data
        console.log("Reconstructing targeting data from serverId");
        try {
          const serverIds = JSON.parse(newMission.serverId);
          console.log("Parsed serverIds:", serverIds);
          if (Array.isArray(serverIds) && serverIds.length > 0) {
            const reconstructedTargeting: MissionTargetingData = {
              audienceType: "custom-discord",
              discordFilters: {
                servers: serverIds,
                roles: [],
                channels: [],
              },
              behaviorFilters: {
                xpLevel: { enabled: false, min: 0, max: 100 },
                missionStreak: { enabled: false, value: 0 },
                lastActive: { enabled: false, value: "today" },
                failedMissions: { enabled: false, value: 0 },
                trustScore: { enabled: false, value: [50] },
                connectedWallet: { enabled: false, value: false },
                joinedViaPartner: { enabled: false, value: "" },
                referredUsers: { enabled: false, value: 0 },
                agentHealth: { enabled: false, value: [50] },
                memoryProofSubmitted: { enabled: false, value: false },
                taggedInterests: { enabled: false, value: [] },
              },
              demographicFilters: {
                location: [],
                language: [],
                ageRange: "",
                gender: "",
              },
              deliveryOptions: {
                channel: "discord",
                scope: "targeted",
                schedule: "immediate",
                scheduledDate: "",
              },
            };
            console.log(
              "Setting reconstructed targeting:",
              reconstructedTargeting
            );
            setMissionTargeting(reconstructedTargeting);
          } else {
            console.log("No server IDs found or empty array");
          }
        } catch (error) {
          console.error("Error parsing serverId:", error);
        }
      } else {
        console.log("No targeting data and no serverId to reconstruct from");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isEditMode]);

  // auto-save useEffect
  useEffect(() => {
    if (!isOpen || isEditMode) return;

    const autoSaveInterval = setInterval(() => {
      const hasData =
        newMission.title ||
        newMission.description ||
        newMission.type ||
        newMission.platform ||
        newMission.partner ||
        newMission.reward ||
        newMission.format ||
        newMission.useful_link ||
        newMission.startDate ||
        newMission.endDate ||
        newMission.action_request ||
        newMission.requirements ||
        missionTargeting;

      if (hasData) {
        try {
          const draftData: DraftData = {
            basicInfo: newMission,
            targetingData: missionTargeting,
            savedAt: new Date().toISOString(),
          };

          // Save to localStorage
          localStorage.setItem(draftKey, JSON.stringify(draftData));
          console.log("Auto-saved draft at:", new Date().toLocaleTimeString());
        } catch (error) {
          console.error("Error auto-saving draft:", error);
        }
      }
    }, 10000); // Auto-save every 10 seconds

    return () => clearInterval(autoSaveInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isEditMode]);

  // Auto-hide notification alert after 5 seconds
  useEffect(() => {
    if (notificationAlert.show) {
      const timer = setTimeout(() => {
        setNotificationAlert((prev) => ({ ...prev, show: false }));
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notificationAlert.show]);

  // validation function with level_required
  const validateForm = (): ValidationErrors => {
    const errors: ValidationErrors = {};

    // Required fields validation
    if (!newMission.title?.trim()) {
      errors.title = "Title is required";
    }

    if (!newMission.description?.trim()) {
      errors.description = "Description is required";
    }

    if (!newMission.type?.trim()) {
      errors.type = "Type is required";
    }

    if (!newMission.platform?.trim()) {
      errors.platform = "Platform is required";
    }

    if (!newMission.partner?.trim()) {
      errors.partner = "Partner is required";
    }

    if (!newMission.reward?.trim()) {
      errors.reward = "Reward is required";
    }

    if (!newMission.format?.trim()) {
      errors.format = "Format is required";
    }

    if (!newMission.startDate?.trim()) {
      errors.startDate = "Start Date is required";
    }

    if (!newMission.endDate?.trim()) {
      errors.endDate = "End Date is required";
    }

    if (!newMission.action_request?.trim()) {
      errors.action_request = "Action Request is required";
    }

    // Level Required validation
    if (!newMission.level_required || newMission.level_required < 1) {
      errors.level_required = "Level Required must be at least 1";
    }

    // Discord server validation - check if targeting data exists and is custom-discord
    if (missionTargeting?.audienceType === "custom-discord") {
      if (!missionTargeting?.discordFilters?.servers?.length) {
        errors.discordServers = "At least one Discord server must be selected";
      }
    }

    // URL validation for useful_link
    if (newMission.useful_link && newMission.useful_link.trim()) {
      try {
        new URL(newMission.useful_link);
      } catch {
        errors.useful_link = "Please enter a valid URL";
      }
    }

    // Date validation - End date should be after start date
    if (newMission.startDate && newMission.endDate) {
      const startDate = new Date(newMission.startDate);
      const endDate = new Date(newMission.endDate);
      if (endDate <= startDate) {
        errors.endDate = "End date must be after start date";
      }
    }

    return errors;
  };

  const handleInputChange = (
    field: keyof NewMissionForm,
    value: string | number
  ) => {
    onMissionChange((prev) => {
      const updated = {
        ...prev,
        [field]: value,
        // Always preserve missionTargeting from either source
        missionTargeting: prev.missionTargeting || missionTargeting || null,
      };

      return updated;
    });

    // Clear validation error for this field when user starts typing
    if (validationErrors[field as keyof ValidationErrors]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[field as keyof ValidationErrors];
        return updated;
      });
    }

    // Hide validation alert if user starts correcting errors
    if (showValidationAlert) {
      setShowValidationAlert(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent double submission
    if (isLoading) return;

    // validation with better UX
    const errors = validateForm();
    setValidationErrors(errors);

    const hasErrors = Object.keys(errors).length > 0;

    if (hasErrors) {
      setShowValidationAlert(true);
      // Scroll to top to show validation alert
      const modalContent = document.querySelector(".modal-content");
      if (modalContent) {
        modalContent.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    try {
      setInternalLoading(true);
      let finalServerId: string;

      // Check if missionTargeting exists and has servers
      const hasTargetingServers =
        missionTargeting?.discordFilters?.servers &&
        Array.isArray(missionTargeting.discordFilters.servers) &&
        missionTargeting.discordFilters.servers.length > 0;

      if (hasTargetingServers) {
        finalServerId = JSON.stringify(missionTargeting.discordFilters.servers);
      } else if (
        isEditMode &&
        newMission.serverId &&
        newMission.serverId !== "" &&
        newMission.serverId !== "[]"
      ) {
        // In edit mode, if no new targeting data but existing serverId is not empty array, preserve it
        finalServerId = newMission.serverId;
      } else {
        // Default to empty array in JSON format
        finalServerId = "[]";
      }

      // ENSURE missionTargeting is included in the final submission
      const missionWithTargeting = {
        ...newMission,
        missionTargeting: missionTargeting, // Always include current targeting state
        serverId: finalServerId,
      };

      // Update mission form data with targeting before calling onSubmit
      onMissionChange(missionWithTargeting);

      // Wait a moment to ensure state is updated
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Call the parent's submit handler
      await onSubmit();
      // Clear draft on successful submission
      clearDraft();

      // Clear validation states on successful submission
      setValidationErrors({});
      setShowValidationAlert(false);
    } catch (error) {
      console.error("Error in form submission:", error);
    } finally {
      // Reset internal loading state
      setInternalLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (isLoading) return;

    try {
      setInternalLoading(true);

      // Calculate server ID from targeting data (similar to handleFormSubmit)
      let finalServerId = "[]";

      const hasTargetingServers =
        missionTargeting?.discordFilters?.servers &&
        Array.isArray(missionTargeting.discordFilters.servers) &&
        missionTargeting.discordFilters.servers.length > 0;

      if (hasTargetingServers) {
        finalServerId = JSON.stringify(missionTargeting.discordFilters.servers);
      } else if (
        isEditMode &&
        newMission.serverId &&
        newMission.serverId !== "" &&
        newMission.serverId !== "[]"
      ) {
        finalServerId = newMission.serverId;
      }

      // Save targeting data before saving draft
      const missionWithTargeting = {
        ...newMission,
        missionTargeting: missionTargeting,
        serverId: finalServerId,
      };

      // Update mission state
      onMissionChange(missionWithTargeting);

      // Save to localStorage
      const success = saveDraft();

      if (success) {
        setNotificationAlert({
          show: true,
          type: "success",
          title: "Draft Saved Successfully",
          description: "You can close and come back later to continue editing.",
        });
      } else {
        setNotificationAlert({
          show: true,
          type: "error",
          title: "Failed to Save Draft",
          description:
            "Please try again or contact support if the issue persists.",
        });
      }

      // Scroll to top after saving draft
      setTimeout(() => {
        const modalContent = document.querySelector(".modal-content");
        if (modalContent) {
          modalContent.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 100);

      // call onSaveDraft if provided
      if (onSaveDraft) {
        await onSaveDraft();
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      setNotificationAlert({
        show: true,
        type: "error",
        title: "Failed to Save Draft",
        description: "An unexpected error occurred. Please try again.",
      });

      // Scroll to top after showing error alert
      setTimeout(() => {
        const modalContent = document.querySelector(".modal-content");
        if (modalContent) {
          modalContent.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 100);
    } finally {
      setInternalLoading(false);
    }
  };

  // error message summary for the alert
  const getErrorSummary = () => {
    const errorCount = Object.keys(validationErrors).length;
    if (errorCount === 0) return "";

    const fieldNames = Object.keys(validationErrors).map((key) => {
      // Convert field names to readable labels
      const fieldLabels: Record<string, string> = {
        title: "Title",
        description: "Description",
        type: "Type",
        platform: "Platform",
        partner: "Partner",
        reward: "Reward",
        format: "Format",
        useful_link: "Useful Link",
        startDate: "Start Date",
        endDate: "End Date",
        action_request: "Action Request",
        requirements: "Requirements",
        level_required: "Level Required",
        discordServers: "Discord Servers",
      };
      return fieldLabels[key] || key;
    });

    return `Please fill in the following required fields: ${fieldNames.join(
      ", "
    )}`;
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        {!isEditMode && (
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-black/90 hover:text-white dark:bg-white dark:text-black dark:hover:bg-white/90 dark:hover:text-black cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Add Mission
            </Button>
          </DialogTrigger>
        )}
        <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto modal-content">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          </DialogHeader>

          {/* Notification Alert */}
          {notificationAlert.show && (
            <Alert
              className={cn(
                "mb-6 relative transform transition-all duration-300 ease-in-out animate-in slide-in-from-top-2 fade-in-0",
                notificationAlert.type === "success"
                  ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                  : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
              )}
            >
              {notificationAlert.type === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              )}
              <AlertDescription
                className={cn(
                  "pr-8",
                  notificationAlert.type === "success"
                    ? "text-green-700 dark:text-green-300"
                    : "text-red-700 dark:text-red-300"
                )}
              >
                <strong>{notificationAlert.title}</strong>
                <br />
                {notificationAlert.description}
              </AlertDescription>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-transparent"
                onClick={() =>
                  setNotificationAlert((prev) => ({ ...prev, show: false }))
                }
              >
                <X className="h-3 w-3" />
              </Button>
            </Alert>
          )}

          {/* Validation Alert */}
          {showValidationAlert && Object.keys(validationErrors).length > 0 && (
            <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-700 dark:text-red-300">
                <strong>Please correct the following errors:</strong>
                <br />
                {getErrorSummary()}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="basic-info" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic-info" className="cursor-pointer">
                  Basic Information
                </TabsTrigger>
                <TabsTrigger value="targeting" className="cursor-pointer">
                  Mission Targeting
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic-info" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* Title with improved validation */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">
                      Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={newMission.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="Enter mission title"
                      className={cn(
                        "w-full",
                        validationErrors.title &&
                          "border-red-500 focus:border-red-500 focus:ring-red-500"
                      )}
                    />
                    {validationErrors.title && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {validationErrors.title}
                      </p>
                    )}
                  </div>

                  {/* Description with improved validation */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium"
                    >
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
                      className={cn(
                        "w-full resize-none",
                        validationErrors.description &&
                          "border-red-500 focus:border-red-500 focus:ring-red-500"
                      )}
                    />
                    {validationErrors.description && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {validationErrors.description}
                      </p>
                    )}
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
                      onValueChange={(value) =>
                        handleInputChange("type", value)
                      }
                    >
                      <SelectTrigger
                        className={cn(
                          "w-full",
                          validationErrors.type && "border-red-500"
                        )}
                      >
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
                    {validationErrors.type && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {validationErrors.type}
                      </p>
                    )}
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
                      <SelectTrigger
                        className={cn(
                          "w-full",
                          validationErrors.platform && "border-red-500"
                        )}
                      >
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {PLATFORM_OPTIONS.map((platform) => (
                          <SelectItem
                            key={platform.value}
                            value={platform.value}
                          >
                            {platform.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.platform && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {validationErrors.platform}
                      </p>
                    )}
                  </div>

                  {/* Partner */}
                  <div className="space-y-2">
                    <Label htmlFor="partner" className="text-sm font-medium">
                      Partner <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={
                        newMission.partner && newMission.partner.trim() !== ""
                          ? newMission.partner
                          : undefined
                      }
                      onValueChange={(value) => {
                        handleInputChange("partner", value);
                      }}
                    >
                      <SelectTrigger
                        className={cn(
                          "w-full",
                          validationErrors.partner && "border-red-500"
                        )}
                      >
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
                    {validationErrors.partner && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {validationErrors.partner}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Level Required */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="level_required"
                      className="text-sm font-medium"
                    >
                      Level Required <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="level_required"
                      type="number"
                      value={newMission.level_required || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                          handleInputChange("level_required", "");
                        } else {
                          const numValue = parseInt(value);
                          if (!isNaN(numValue) && numValue >= 1) {
                            handleInputChange("level_required", numValue);
                          }
                        }
                      }}
                      min="1"
                      placeholder="1"
                      className={cn(
                        "w-full",
                        validationErrors.level_required &&
                          "border-red-500 focus:border-red-500 focus:ring-red-500"
                      )}
                    />
                    {validationErrors.level_required && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {validationErrors.level_required}
                      </p>
                    )}
                  </div>

                  {/* Reward - 3/4 columns */}
                  <div className="space-y-2 col-span-3">
                    <Label htmlFor="reward" className="text-sm font-medium">
                      Reward <span className="text-red-500">*</span>
                    </Label>
                    <RewardInput
                      value={newMission.reward || ""}
                      onChange={(value) => handleInputChange("reward", value)}
                      error={!!validationErrors.reward}
                    />
                    {validationErrors.reward && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {validationErrors.reward}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Format */}
                  <div className="space-y-2">
                    <Label htmlFor="format" className="text-sm font-medium">
                      Format <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={newMission.format || ""}
                      onValueChange={(value) =>
                        handleInputChange("format", value)
                      }
                    >
                      <SelectTrigger
                        className={cn(
                          "w-full",
                          validationErrors.format && "border-red-500"
                        )}
                      >
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        {FORMAT_OPTIONS.map((format) => (
                          <SelectItem key={format.value} value={format.value}>
                            {format.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.format && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {validationErrors.format}
                      </p>
                    )}
                  </div>

                  {/* Useful Link */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="useful_link"
                      className="text-sm font-medium"
                    >
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
                      className={cn(
                        "w-full",
                        validationErrors.useful_link &&
                          "border-red-500 focus:border-red-500 focus:ring-red-500"
                      )}
                    />
                    {validationErrors.useful_link && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {validationErrors.useful_link}
                      </p>
                    )}
                  </div>

                  {/* Start Date */}
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-sm font-medium">
                      Start Date & Time <span className="text-red-500">*</span>
                    </Label>
                    <DateTimePicker
                      value={newMission.startDate}
                      onChange={(value) =>
                        handleInputChange("startDate", value)
                      }
                      placeholder="Select start date and time"
                      error={!!validationErrors.startDate}
                    />
                    {validationErrors.startDate && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {validationErrors.startDate}
                      </p>
                    )}
                  </div>

                  {/* End Date */}
                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-sm font-medium">
                      End Date & Time <span className="text-red-500">*</span>
                    </Label>
                    <DateTimePicker
                      value={newMission.endDate}
                      onChange={(value) => handleInputChange("endDate", value)}
                      placeholder="Select end date and time"
                      error={!!validationErrors.endDate}
                    />
                    {validationErrors.endDate && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {validationErrors.endDate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {/* Action Request */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="action_request"
                      className="text-sm font-medium"
                    >
                      Action Request <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="action_request"
                      value={newMission.action_request || ""}
                      onChange={(e) =>
                        handleInputChange("action_request", e.target.value)
                      }
                      placeholder="Enter action request"
                      rows={3}
                      className={cn(
                        "w-full resize-none",
                        validationErrors.action_request &&
                          "border-red-500 focus:border-red-500 focus:ring-red-500"
                      )}
                    />
                    {validationErrors.action_request && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {validationErrors.action_request}
                      </p>
                    )}
                  </div>

                  {/* Requirements */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="requirements"
                      className="text-sm font-medium"
                    >
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
                      className={cn(
                        "w-full resize-none",
                        validationErrors.requirements &&
                          "border-red-500 focus:border-red-500 focus:ring-red-500"
                      )}
                    />
                    {validationErrors.requirements && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {validationErrors.requirements}
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="targeting" className="space-y-6 mt-6">
                <MissionTargetingForm
                  onTargetingChange={handleTargetingChange}
                  initialData={missionTargeting}
                  validationErrors={validationErrors}
                />
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t max-sm:flex-col max-sm:gap-4">
              <div className="flex items-center gap-3 max-sm:flex-col max-sm:w-full max-sm:gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2 cursor-pointer max-sm:w-full max-sm:justify-center"
                  disabled={isLoading}
                  onClick={handlePreviewMission}
                >
                  <Eye className="h-4 w-4" />
                  Preview Mission
                </Button>
                {!isEditMode && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2 cursor-pointer max-sm:w-full max-sm:justify-center"
                    disabled={isLoading}
                    onClick={handleSaveDraft}
                  >
                    <Save className="h-4 w-4" />
                    Save Draft
                  </Button>
                )}
              </div>

              <div
                className={cn(
                  "flex gap-3 max-sm:w-full",
                  isEditMode && "w-full justify-end"
                )}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="px-6 cursor-pointer max-sm:flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-black text-white hover:bg-black/90 hover:text-white dark:bg-white dark:text-black dark:hover:bg-white/90 dark:hover:text-black px-6 cursor-pointer max-sm:flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </div>
                  ) : isEditMode ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Update Mission
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Publish to Users
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Mission Preview Modal */}
      <MissionPreviewModal
        isOpen={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        mission={newMission}
      />
    </>
  );
};
