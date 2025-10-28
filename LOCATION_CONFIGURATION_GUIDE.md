# Location Configuration Guide

This guide explains how the location system works and how to add new countries/locations to the Google Trends dashboard.

## Current Setup

Currently, the system is configured to show only **Thailand** data, as requested. All mock data represents Google Trends for Thailand.

## Architecture

### 1. Location Configuration (`/config/locations.ts`)

The system uses a centralized configuration approach:

```typescript
export interface LocationConfig {
  code: LocationFilter;      // Unique identifier
  name: string;             // Display name
  flag: string;             // Flag emoji
  timezone: string;         // Timezone for the location
  language: string;         // Primary language code
  enabled: boolean;         // Whether location is available
}
```

### 2. Current Configuration

```typescript
export const LOCATION_CONFIGS: Record<LocationFilter, LocationConfig> = {
  thailand: {
    code: 'thailand',
    name: 'Thailand',
    flag: '🇹🇭',
    timezone: 'Asia/Bangkok',
    language: 'th',
    enabled: true,  // Only Thailand is enabled
  },
  // Other locations are defined but disabled
  worldwide: { /* ... */ enabled: false },
  us: { /* ... */ enabled: false },
  // ... etc
};
```

### 3. Data Structure

Mock data is organized by location in `/lib/utils/googleTrendsMockData.ts`:

```typescript
const LOCATION_MOCK_DATA: LocationMockData = {
  thailand: [], // All current mock data
  // Future locations can be added here
};
```

## How to Add a New Country

### Step 1: Enable the Location

In `/config/locations.ts`, set `enabled: true` for the desired country:

```typescript
us: {
  code: 'us',
  name: 'United States',
  flag: '🇺🇸',
  timezone: 'America/New_York',
  language: 'en',
  enabled: true,  // ← Enable this
},
```

### Step 2: Add Mock Data

In `/lib/utils/googleTrendsMockData.ts`, add country-specific trending data:

1. Create a new array of `GoogleTrendItem[]` for each timeframe (4H, 24H, 48H, 7D)
2. Update the `generateGoogleTrendsData` function to handle the new location
3. Ensure URLs in `exploreLink` use the correct geo parameter (e.g., `&geo=US`)

### Step 3: Update Language Mapping (Optional)

In `/lib/utils/locationUtils.ts`, update `getDefaultLanguageForLocation` if needed:

```typescript
case 'en':
  return 'en';  // For English-speaking countries
```

### Step 4: Test

The system will automatically:
- Show the new location in the dropdown filter
- Display the location name with flag emoji
- Use the appropriate mock data when selected

## Benefits of This Architecture

1. **Centralized Configuration**: All location settings in one place
2. **Easy Expansion**: Add new countries by just enabling them and adding data
3. **Type Safety**: TypeScript ensures all locations are properly configured
4. **Consistent UI**: Automatic flag display and proper naming
5. **Future-Ready**: Structure supports real API integration

## File Structure

```
/config/
  locations.ts              # Location configurations
/lib/utils/
  googleTrendsMockData.ts   # Mock data by location
  locationUtils.ts          # Helper functions
  mockData.ts              # Data adaptation layer
/components/LandingDashboard/trends/
  LocationFilter.tsx        # Location selector component
```

## Current Data Source

All mock data is currently Thailand-specific, sourced from Google Trends for Thailand (`geo=TH&hl=th`). The data includes:

- Thai language keywords (เช็คสิทธิ์โครงการคนละครึ่งพลัส, ดูบาสสด, etc.)
- International terms popular in Thailand (warriors vs nuggets, classroom, etc.)
- Local terms and trending topics

When adding new countries, ensure the data is relevant and localized for that specific region.
