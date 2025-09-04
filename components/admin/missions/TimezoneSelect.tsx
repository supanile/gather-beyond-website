import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";
import { TIMEZONE_OPTIONS, getUserTimezone, setUserTimezone } from "@/lib/admin/missions/timezoneUtils";

interface TimezoneSelectProps {
  onTimezoneChange?: (timezone: string) => void;
  className?: string;
}

export const TimezoneSelect: React.FC<TimezoneSelectProps> = ({
  onTimezoneChange,
  className = ""
}) => {
  const [selectedTimezone, setSelectedTimezone] = React.useState<string>(() => getUserTimezone());

  // Find the selected timezone option to display its flag
  const selectedOption = TIMEZONE_OPTIONS.find(option => option.value === selectedTimezone);

  const handleTimezoneChange = (newTimezone: string) => {
    setSelectedTimezone(newTimezone);
    setUserTimezone(newTimezone);
    
    if (onTimezoneChange) {
      onTimezoneChange(newTimezone);
    }
    
    // Reload page to apply timezone changes throughout the app
    window.location.reload();
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedTimezone} onValueChange={handleTimezoneChange}>
        <SelectTrigger className="w-48 text-xs">
          <SelectValue 
            placeholder="Select timezone"
            asChild
          >
            <div className="flex items-center gap-2">
              {selectedOption && (
                <span className="text-base" role="img" aria-label={selectedOption.country}>
                  {selectedOption.flag}
                </span>
              )}
              <span>{selectedOption?.label || "Select timezone"}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {TIMEZONE_OPTIONS.map((timezone) => (
            <SelectItem 
              key={timezone.value} 
              value={timezone.value}
              className="text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="text-base" role="img" aria-label={timezone.country}>
                  {timezone.flag}
                </span>
                <span className="text-xs font-mono bg-muted px-1 rounded">
                  {timezone.country}
                </span>
                <span>{timezone.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};