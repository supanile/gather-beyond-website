import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeRangeSelectorProps {
  timeRange: string;
  filterType: string;
  onTimeRangeChange: (value: string) => void;
  onFilterTypeChange: (value: string) => void;
}

export const TimeRangeSelector = ({
  timeRange,
  filterType,
  onTimeRangeChange,
  onFilterTypeChange,
}: TimeRangeSelectorProps) => {
  const handleFilterTypeChange = (value: string) => {
    onFilterTypeChange(value);
    if (value === "days") {
      onTimeRangeChange("30");
    } else {
      onTimeRangeChange("3");
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <Select value={timeRange} onValueChange={onTimeRangeChange}>
        <SelectTrigger className="w-18">
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
        <SelectTrigger className="w-26 sm:w-28">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="days">Days</SelectItem>
          <SelectItem value="months">Months</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
