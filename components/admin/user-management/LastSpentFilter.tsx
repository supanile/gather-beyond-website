import React, { useState } from "react";
import { CalendarDays, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterConfig } from "@/types/admin/userManagement";

interface LastSpentFilterProps {
  filterConfig: FilterConfig;
  onFilterChange: (filter: Partial<FilterConfig>) => void;
}

export const LastSpentFilter: React.FC<LastSpentFilterProps> = ({
  filterConfig,
  onFilterChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Helper function to get date range options
  const getDateRangeOptions = () => {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const week = 7 * day;
    const month = 30 * day;
    const quarter = 90 * day;
    const year = 365 * day;

    return [
      {
        label: "All Time",
        value: "all",
        range: [0, now] as [number, number],
      },
      {
        label: "Last 24 Hours",
        value: "24h",
        range: [now - day, now] as [number, number],
      },
      {
        label: "Last 7 Days",
        value: "7d",
        range: [now - week, now] as [number, number],
      },
      {
        label: "Last 30 Days",
        value: "30d",
        range: [now - month, now] as [number, number],
      },
      {
        label: "Last 90 Days",
        value: "90d",
        range: [now - quarter, now] as [number, number],
      },
      {
        label: "Last Year",
        value: "1y",
        range: [now - year, now] as [number, number],
      },
    ];
  };

  // Helper function to get current selected option
  const getCurrentOption = () => {
    const options = getDateRangeOptions();
    const currentRange = filterConfig.lastSpentDateRange;
    
    return options.find(option => 
      Math.abs(option.range[0] - currentRange[0]) < 60000 && // 1 minute tolerance
      Math.abs(option.range[1] - currentRange[1]) < 60000
    ) || options[0]; // Default to "All Time"
  };

  const handleDateRangeChange = (value: string) => {
    const options = getDateRangeOptions();
    const selectedOption = options.find(option => option.value === value);
    
    if (selectedOption) {
      onFilterChange({
        lastSpentDateRange: selectedOption.range,
      });
    }
    
    setIsOpen(false);
  };

  const clearFilter = () => {
    const now = Date.now();
    onFilterChange({
      lastSpentDateRange: [0, now],
    });
  };

  const isFiltered = () => {
    const currentOption = getCurrentOption();
    return currentOption.value !== "all";
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`h-8 border-dashed ${
              isFiltered() ? "border-blue-500 bg-blue-50 text-blue-700" : ""
            }`}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            Last Spent
            {isFiltered() && (
              <Badge variant="secondary" className="ml-2 px-1 text-xs">
                {getCurrentOption().label}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-0" align="start">
          <div className="p-2">
            <div className="mb-2">
              <h4 className="text-sm font-medium">Filter by last spent date</h4>
              <p className="text-xs text-muted-foreground">
                Select a time range for last spending activity
              </p>
            </div>
            <Select
              value={getCurrentOption().value}
              onValueChange={handleDateRangeChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getDateRangeOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>
      
      {isFiltered() && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={clearFilter}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
