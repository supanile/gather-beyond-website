import React from 'react';
import { TimeRange } from '@/types/trends';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface TimeRangeSelectorProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
  className?: string;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  selectedRange,
  onRangeChange,
  className = ''
}) => {
  const timeRanges: { label: string; value: TimeRange }[] = [
    { label: '24H', value: '24H' },
    { label: '48H', value: '48H' },
    { label: '7D', value: '7D' },
    { label: '30D', value: '30D' },
    { label: '3M', value: '3M' },
    { label: '6M', value: '6M' },
    { label: '12M', value: '12M' },
  ];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Clock className="w-3 h-3 text-muted-foreground" />
      <div className="flex space-x-1">
        {timeRanges.map((range) => (
          <Button
            key={range.value}
            variant={selectedRange === range.value ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onRangeChange(range.value)}
            className={`h-7 px-2 text-xs transition-all duration-300 ${
              selectedRange === range.value
                ? 'bg-gradient-to-r from-gray-800 to-slate-700 dark:from-gray-200 dark:to-slate-300 text-white dark:text-black shadow-lg hover:shadow-xl'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 border border-border/30 hover:border-border/50'
            }`}
          >
            {range.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TimeRangeSelector;
