import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, ChevronDown, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DateFilter } from "@/types/admin/missions/missionTypes";

interface DateFilterDropdownProps {
  onFilterChange: (filter: DateFilter) => void;
  currentFilter: DateFilter;
}

export const DateFilterDropdown: React.FC<DateFilterDropdownProps> = ({
  onFilterChange,
  currentFilter,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    currentFilter.date ? new Date(currentFilter.date + "T00:00:00") : undefined
  );

  // Update selectedDate when currentFilter changes
  useEffect(() => {
    if (currentFilter.date) {
      // Parse date string with explicit local time to avoid timezone issues
      setSelectedDate(new Date(currentFilter.date + "T00:00:00"));
    } else {
      setSelectedDate(undefined);
    }
  }, [currentFilter.date]);

  const getFilterIcon = () => {
    return currentFilter.type === "all" ? (
      <CalendarIcon className="w-3 h-3" />
    ) : (
      <Clock className="w-3 h-3" />
    );
  };

  const getFilterLabel = () => {
    if (currentFilter.type === "all") {
      return "All";
    }
    if (currentFilter.date) {
      const date = new Date(currentFilter.date + "T00:00:00");
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    return "Select Date";
  };

  const handleDateSelect = (date: Date | undefined) => {
    console.log("Date selected:", date);
    if (date) {
      // Use local date formatting to avoid timezone conversion
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;

      console.log("Formatted date string:", dateString);

      setSelectedDate(date);
      onFilterChange({ type: "date", date: dateString });

      // Close calendar after selection for better UX
      setIsCalendarOpen(false);
    }
  };

  const handleClearFilter = (e?: React.MouseEvent) => {
    console.log("Clear filter clicked");
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedDate(undefined);
    onFilterChange({ type: "all" });
    setIsCalendarOpen(false);
  };

  const handleQuickDate = (daysOffset: number = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);

    // Use local date formatting
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    setSelectedDate(date);
    onFilterChange({ type: "date", date: dateString });
    setIsCalendarOpen(false);
  };

  // Date limits for calendar
  const fromYear = 2025;
  const toYear = new Date().getFullYear()

  return (
    <div className="flex items-center gap-1">
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-6 px-2 text-xs border-muted-foreground/20 gap-1 ml-3"
          >
            {getFilterIcon()}
            <span className="max-w-20 truncate">{getFilterLabel()}</span>
            <ChevronDown className="w-3 h-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-3"
          align="start"
          side="bottom"
          sideOffset={4}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div
            className="space-y-3"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Quick Options */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">
                Quick Options
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickDate(0);
                  }}
                  className="text-xs h-7 px-3"
                  type="button"
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickDate(-1);
                  }}
                  className="text-xs h-7 px-3"
                  type="button"
                >
                  Yesterday
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickDate(1);
                  }}
                  className="text-xs h-7 px-3"
                  type="button"
                >
                  Tomorrow
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearFilter();
                  }}
                  className="text-xs h-7 px-3"
                  type="button"
                >
                  <X className="w-3 h-3" />
                  Clear
                </Button>
              </div>
            </div>

            <div className="border-t pt-3">
              <div className="text-xs font-medium text-muted-foreground mb-2">
                Select Date
              </div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) =>
                  date < new Date(fromYear, 0, 1) // เอาเงื่อนไข date > new Date() ออก
                }
                initialFocus
                fromYear={fromYear}
                toYear={toYear}
                captionLayout="dropdown"
                className="rounded-md border-0"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Clear Button - Outside of popover */}
      {currentFilter.type !== "all" && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilter}
          className="h-6 w-6 p-0 hover:bg-muted"
          type="button"
        >
          <X className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
};