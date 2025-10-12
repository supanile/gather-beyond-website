import React from 'react';
import { LocationFilter } from '@/types/trends';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

interface LocationFilterProps {
  selectedLocation: LocationFilter;
  onLocationChange: (location: LocationFilter) => void;
  className?: string;
}

const LocationFilterComponent: React.FC<LocationFilterProps> = ({
  selectedLocation,
  onLocationChange,
  className = ''
}) => {
  const locations: { label: string; value: LocationFilter }[] = [
    { label: 'Worldwide', value: 'worldwide' },
    { label: 'United States', value: 'us' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'Brazil', value: 'brazil' },
    { label: 'Japan', value: 'japan' },
  ];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Globe className="w-3 h-3 text-muted-foreground" />
      <Select value={selectedLocation} onValueChange={onLocationChange}>
        <SelectTrigger className="w-36 h-7 bg-background/60 backdrop-blur-xl border border-border/50 text-foreground shadow-lg hover:shadow-xl transition-all duration-300 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-background/90 backdrop-blur-xl border border-border/50">
          {locations.map((location) => (
            <SelectItem
              key={location.value}
              value={location.value}
              className="text-foreground hover:bg-accent/50 focus:bg-accent/50 text-xs"
            >
              {location.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LocationFilterComponent;
