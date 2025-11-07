import { LocationFilter, LanguageFilter } from '@/types/trends';
import { getLocationConfig } from '@/config/locations';

/**
 * Get default language based on location
 */
export const getDefaultLanguageForLocation = (location: LocationFilter): LanguageFilter => {
  const locationConfig = getLocationConfig(location);
  
  // Map location languages to supported language filters
  switch (locationConfig.language) {
    case 'th':
      return 'all'; // Use 'all' for now, can be extended when Thai language filter is added
    case 'en':
      return 'en';
    case 'es':
      return 'es';
    case 'pt':
      return 'pt';
    case 'ja':
      return 'ja';
    case 'fr':
      return 'fr';
    default:
      return 'all';
  }
};

/**
 * Format location display name with flag
 */
export const formatLocationName = (location: LocationFilter): string => {
  const config = getLocationConfig(location);
  return `${config.flag} ${config.name}`;
};

/**
 * Check if location is enabled
 */
export const isLocationEnabled = (location: LocationFilter): boolean => {
  const config = getLocationConfig(location);
  return config.enabled;
};
