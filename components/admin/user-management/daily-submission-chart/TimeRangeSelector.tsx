import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

interface TimeRangeSelectorProps {
  timeRange: string;
  filterType: string;
  onTimeRangeChange: (value: string) => void;
  onFilterTypeChange: (value: string) => void;
  dateRangeMode?: "relative" | "date" | "all";
  onDateRangeModeChange?: (mode: "relative" | "date" | "all") => void;
  customDateRange?: { from: Date | undefined; to: Date | undefined };
  onCustomDateRangeChange?: (range: { from: Date | undefined; to: Date | undefined }) => void;
}

export const TimeRangeSelector = ({
  timeRange,
  filterType,
  onTimeRangeChange,
  onFilterTypeChange,
  dateRangeMode = "relative",
  onDateRangeModeChange,
  customDateRange,
  onCustomDateRangeChange,
}: TimeRangeSelectorProps) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [tempDateRange, setTempDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });

  const handleFilterTypeChange = (value: string) => {
    onFilterTypeChange(value);
    if (value === "days") {
      onTimeRangeChange("30");
    } else {
      onTimeRangeChange("3");
    }
  };

  const handleDateRangeModeChange = (mode: "relative" | "date" | "all") => {
    onDateRangeModeChange?.(mode);
    if (mode === "relative") {
      onFilterTypeChange("days");
      onTimeRangeChange("30");
    }
  };

  const formatDateRange = () => {
    if (!customDateRange?.from) return "Select date range";
    if (!customDateRange?.to) return format(customDateRange.from, "PPP");
    
    if (customDateRange.from.getTime() === customDateRange.to.getTime()) {
      return format(customDateRange.from, "PPP");
    }
    
    return `${format(customDateRange.from, "PPP")} - ${format(customDateRange.to, "PPP")}`;
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setTempDateRange(customDateRange || { from: undefined, to: undefined });
    }
    setCalendarOpen(open);
  };

  const handleApply = () => {
    if (tempDateRange.from && tempDateRange.to) {
      onCustomDateRangeChange?.(tempDateRange);
      setCalendarOpen(false);
    }
  };

  const handleCancel = () => {
    setTempDateRange({ from: undefined, to: undefined });
    setCalendarOpen(false);
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {/* Date Range Mode Selector with Modern Hover Effects */}
      <div className="flex rounded-lg bg-muted/50 p-1 gap-1 backdrop-blur-sm border border-border/50">
        <Button
          variant={dateRangeMode === "relative" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleDateRangeModeChange("relative")}
          className={`
            text-xs px-3 py-1 
            transition-all duration-300 ease-out
            relative overflow-hidden
            ${dateRangeMode === "relative" 
              ? "shadow-md" 
              : "hover:bg-accent/80 hover:shadow-sm hover:scale-105"
            }
            ${dateRangeMode !== "relative" 
              ? "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/0 before:via-primary/10 before:to-primary/0 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700" 
              : ""
            }
          `}
        >
          <span className="relative z-10">Relative</span>
        </Button>
        <Button
          variant={dateRangeMode === "date" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleDateRangeModeChange("date")}
          className={`
            text-xs px-3 py-1 
            transition-all duration-300 ease-out
            relative overflow-hidden
            ${dateRangeMode === "date" 
              ? "shadow-md" 
              : "hover:bg-accent/80 hover:shadow-sm hover:scale-105"
            }
            ${dateRangeMode !== "date" 
              ? "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/0 before:via-primary/10 before:to-primary/0 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700" 
              : ""
            }
          `}
        >
          <span className="relative z-10">Date</span>
        </Button>
        <Button
          variant={dateRangeMode === "all" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleDateRangeModeChange("all")}
          className={`
            text-xs px-3 py-1 
            transition-all duration-300 ease-out
            relative overflow-hidden
            ${dateRangeMode === "all" 
              ? "shadow-md" 
              : "hover:bg-accent/80 hover:shadow-sm hover:scale-105"
            }
            ${dateRangeMode !== "all" 
              ? "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/0 before:via-primary/10 before:to-primary/0 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700" 
              : ""
            }
          `}
        >
          <span className="relative z-10">All</span>
        </Button>
      </div>

      {/* Conditional rendering based on mode */}
      {dateRangeMode === "relative" && (
        <>
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className="w-18 hover:border-primary/50 hover:shadow-sm transition-all duration-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filterType === "days" ? (
                <>
                  <SelectItem value="7">7</SelectItem>
                  <SelectItem value="14">14</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={handleFilterTypeChange}>
            <SelectTrigger className="w-26 sm:w-28 hover:border-primary/50 hover:shadow-sm transition-all duration-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="days">Days</SelectItem>
              <SelectItem value="months">Months</SelectItem>
            </SelectContent>
          </Select>
        </>
      )}

      {dateRangeMode === "date" && (
        <Popover 
          open={calendarOpen} 
          onOpenChange={handleOpenChange}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-auto justify-start text-left font-normal hover:border-primary/50 hover:shadow-md hover:bg-accent/50 transition-all duration-300"
            >
              <CalendarIcon className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              {formatDateRange()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              defaultMonth={customDateRange?.from || tempDateRange?.from}
              selected={tempDateRange}
              onSelect={(range) => {
                console.log('Calendar range selected:', range);
                
                if (range) {
                  setTempDateRange({ 
                    from: range.from, 
                    to: range.to 
                  });
                } else {
                  setTempDateRange({ from: undefined, to: undefined });
                }
              }}
              numberOfMonths={1}
            />
            <div className="p-3 border-t flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all duration-200"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleApply}
                disabled={!tempDateRange.from || !tempDateRange.to}
                className="hover:shadow-md hover:scale-105 transition-all duration-200 disabled:hover:scale-100"
              >
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};