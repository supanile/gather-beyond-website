# TrendCard Components

This directory contains different versions of the TrendCard component for different data sources:

## Files:

### TrendCard.tsx (Current - Google Trends)
- **Purpose**: Main TrendCard component optimized for Google Trends data
- **Features**: 
  - Displays search volume instead of tweet volume
  - Shows "searches" instead of "tweets" as the unit
  - Optimized for Google Trends terminology
  - Compatible with GoogleTrendWithStats type

### TrendCard.twitter.tsx (Backup - Twitter Trends)
- **Purpose**: Original TrendCard component for Twitter/X trends data
- **Features**:
  - Displays tweet volume
  - Shows "tweets" as the unit
  - Optimized for Twitter terminology
  - Compatible with TrendWithStats type from Twitter data

## Usage:

### To use Google Trends version (current):
```tsx
import TrendCard from "./TrendCard";
```

### To switch back to Twitter version:
1. Rename current `TrendCard.tsx` to `TrendCard.google.tsx`
2. Rename `TrendCard.twitter.tsx` to `TrendCard.tsx`
3. Update imports in parent components if needed

## Data Compatibility:

- Both components use the same `TrendWithStats` interface
- The main difference is in terminology and formatting functions used
- Google Trends version uses `formatTweetVolume` (which now handles Google Trends data)
- Twitter version uses the original `formatTweetVolume` function

## Migration Notes:

When switching between versions, make sure to:
1. Update data source in `mockData.ts` if needed
2. Verify that parent components are using the correct data format
3. Check that formatting functions are compatible with the selected data source
