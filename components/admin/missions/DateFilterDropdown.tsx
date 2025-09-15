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
    currentFilter.date ? new Date(currentFilter.date) : undefined
  );

  // Update selectedDate when currentFilter changes
  useEffect(() => {
    if (currentFilter.date) {
      setSelectedDate(new Date(currentFilter.date));
    } else {
      setSelectedDate(undefined);
    }
  }, [currentFilter.date]);

  const getFilterIcon = () => {
    return currentFilter.type === 'all' ? 
      <CalendarIcon className="w-3 h-3" /> : 
      <Clock className="w-3 h-3" />;
  };

  const getFilterLabel = () => {
    if (currentFilter.type === 'all') {
      return 'All';
    }
    if (currentFilter.date) {
      const date = new Date(currentFilter.date);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    return 'Select Date';
  };

  const handleDateSelect = (date: Date | undefined) => {
    console.log("Date selected:", date);
    if (date) {
      setSelectedDate(date);
      const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      onFilterChange({ type: 'date', date: dateString });
      // Keep calendar open for easier date selection
      // setIsCalendarOpen(false);
    }
  };

  const handleClearFilter = (e?: React.MouseEvent) => {
    console.log("Clear filter clicked");
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedDate(undefined);
    onFilterChange({ type: 'all' });
    setIsCalendarOpen(false);
  };

  const handleQuickDate = (daysOffset: number = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    const dateString = date.toISOString().split('T')[0];
    setSelectedDate(date);
    onFilterChange({ type: 'date', date: dateString });
    setIsCalendarOpen(false);
  };

  // Date limits for calendar
  const fromYear = 2025;
  const toYear = new Date().getFullYear();

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
        >
        <div className="space-y-3">
          {/* Quick Options */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Quick Options</div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickDate(0)}
                className="text-xs h-7 px-3"
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickDate(-1)}
                className="text-xs h-7 px-3"
              >
                Yesterday
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleClearFilter()}
                className="text-xs h-7 px-3"
              >
                <X className="w-3 h-3" />
                Clear
              </Button>
            </div>
          </div>
          
          <div className="border-t pt-3">
            <div className="text-xs font-medium text-muted-foreground mb-2">Select Date</div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) =>
                date > new Date() || 
                date < new Date(fromYear, 0, 1)
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
    {currentFilter.type !== 'all' && (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClearFilter}
        className="h-6 w-6 p-0 hover:bg-muted"
      >
        <X className="w-3 h-3" />
      </Button>
    )}
  </div>
  );
};
