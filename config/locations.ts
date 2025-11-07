import { LocationFilter } from '@/types/trends';

export interface LocationConfig {
  code: LocationFilter;
  name: string;
  flag: string;
  timezone: string;
  language: string;
  enabled: boolean;
}

// Configuration for different locations/countries
export const LOCATION_CONFIGS: Record<LocationFilter, LocationConfig> = {
  thailand: {
    code: 'thailand',
    name: 'Thailand',
    flag: '🇹🇭',
    timezone: 'Asia/Bangkok',
    language: 'th',
    enabled: true,
  },
  worldwide: {
    code: 'worldwide',
    name: 'Worldwide',
    flag: '🌍',
    timezone: 'UTC',
    language: 'en',
    enabled: false, // Disabled for now
  },
  us: {
    code: 'us',
    name: 'United States',
    flag: '🇺🇸',
    timezone: 'America/New_York',
    language: 'en',
    enabled: false, // Disabled for now
  },
  uk: {
    code: 'uk',
    name: 'United Kingdom',
    flag: '🇬🇧',
    timezone: 'Europe/London',
    language: 'en',
    enabled: false, // Disabled for now
  },
  brazil: {
    code: 'brazil',
    name: 'Brazil',
    flag: '🇧🇷',
    timezone: 'America/Sao_Paulo',
    language: 'pt',
    enabled: false, // Disabled for now
  },
  japan: {
    code: 'japan',
    name: 'Japan',
    flag: '🇯🇵',
    timezone: 'Asia/Tokyo',
    language: 'ja',
    enabled: false, // Disabled for now
  },
};

// Get all enabled locations
export const getEnabledLocations = (): LocationConfig[] => {
  return Object.values(LOCATION_CONFIGS).filter(location => location.enabled);
};

// Get location config by code
export const getLocationConfig = (code: LocationFilter): LocationConfig => {
  return LOCATION_CONFIGS[code];
};

// Default location
export const DEFAULT_LOCATION: LocationFilter = 'thailand';
