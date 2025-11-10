# Trend Details Dialog Separation

## Overview
แยก `TrendDetailsDialog` ออกเป็น Dialog เฉพาะสำหรับแต่ละ Social Media Platform เพื่อให้แสดงข้อมูลที่เหมาะสมกับลักษณะของแต่ละแพลตฟอร์ม

## Changes Made

### 1. Created Platform-Specific Dialog Components

#### **TikTokDetailsDialog.tsx**
- **Icon**: Hash (#) - สำหรับ hashtag
- **Header Style**: Gradient from pink to cyan (TikTok brand colors)
- **Main Metric**: "Video Views" แทน "Search Volume"
- **Chart Title**: "Video Views Over Time"
- **Gradient Color**: Pink (#EC4899) to Cyan (#06B6D4)
- **Metric Labels**:
  - Views counter with TikTok-style formatting
  - "Going Viral" status for uptrend
  - "Total hashtag views" description
- **CTA Button**: "Explore on TikTok" with gradient pink-to-cyan background

#### **XDetailsDialog.tsx** (Twitter/X)
- **Icon**: Twitter bird icon
- **Header Style**: Gray/Slate (X brand colors)
- **Main Metric**: "Tweet Volume" แทน "Search Volume"
- **Chart Title**: "Tweet Activity Over Time"
- **Gradient Color**: X Blue (#1DA1F2)
- **Metric Labels**:
  - Tweet counter
  - "Trending Up/Down" status
  - "Total tweets" description
- **CTA Button**: "Explore on X" with dark background

#### **RedditDetailsDialog.tsx**
- **Icon**: Flame (🔥) - representing "hot" posts
- **Header Style**: Gradient from orange to red (Reddit brand colors)
- **Main Metric**: "Upvotes" แทน "Search Volume"
- **Chart Title**: "Upvote Activity Over Time"
- **Gradient Color**: Reddit Orange (#FF4500)
- **Metric Labels**:
  - Upvotes counter
  - Comments counter as third metric
  - Subreddit information
  - "Rising/Declining" status
- **Additional Info**: Shows subreddit name (r/...)
- **CTA Button**: "View on Reddit" with orange background

### 2. Updated Treemap Components

#### **TikTokTreemap.tsx**
```tsx
import TikTokDetailsDialog from './TikTokDetailsDialog';
// ...
<TikTokDetailsDialog trend={selectedTrend} isOpen={isDialogOpen} onClose={...} />
```

#### **XTreemap.tsx**
```tsx
import XDetailsDialog from './XDetailsDialog';
// ...
<XDetailsDialog trend={selectedTrend} isOpen={isDialogOpen} onClose={...} />
```

#### **RedditTreemap.tsx**
```tsx
import RedditDetailsDialog from './RedditDetailsDialog';
// ...
<RedditDetailsDialog trend={selectedTrend} isOpen={isDialogOpen} onClose={...} />
```

## Key Differences by Platform

| Feature | Google Trends | TikTok | X (Twitter) | Reddit |
|---------|--------------|--------|-------------|---------|
| **Main Icon** | Search (🔍) | Hash (#) | Twitter (🐦) | Flame (🔥) |
| **Primary Metric** | Search Volume | Video Views | Tweet Volume | Upvotes |
| **Chart Label** | Search Interest | View Interest | Tweet Activity | Upvote Interest |
| **Tooltip Unit** | searches | views | tweets | upvotes |
| **Status Labels** | Rising/Declining | Going Viral/Declining | Trending Up/Down | Rising/Declining |
| **Color Scheme** | Blue | Pink-Cyan Gradient | Gray/Blue | Orange-Red |
| **Third Metric** | Global Interest | Global Reach | Global Reach | Comments |
| **Additional Info** | - | - | - | Subreddit (r/...) |

## Technical Details

### Data Structure Compatibility
All dialogs use the same `TrendWithStats` interface but interpret fields differently:
- `tweet_volume` → represents views (TikTok), tweets (X), or upvotes (Reddit)
- Platform-specific fields are accessed via type assertions when needed
- Chart data generation adjusted for each platform's behavior patterns

### Chart Behavior Patterns
Each platform has unique trending patterns:
- **TikTok**: Higher activity on weekends, stronger viral spikes
- **X/Twitter**: Slightly lower on weekends, moderate spikes
- **Reddit**: Higher on weekends, community-driven patterns

### Color Schemes
- **Google**: Blue (#3B82F6)
- **TikTok**: Pink-Cyan gradient (#EC4899 → #06B6D4)
- **X**: Twitter Blue (#1DA1F2) or Dark Gray
- **Reddit**: Orange (#FF4500)

## Benefits

1. **Platform-Accurate Metrics**: แต่ละ platform แสดงข้อมูลที่สอดคล้องกับลักษณะการใช้งานจริง
2. **Better UX**: ผู้ใช้เห็นข้อมูลที่ถูกต้องและเข้าใจง่าย
3. **Brand Consistency**: สีและ icon สอดคล้องกับแบรนด์ของแต่ละ platform
4. **Maintainability**: แยก component ชัดเจน ง่ายต่อการ maintain และ customize

## Original vs New

### Before (All platforms used TrendDetailsDialog)
- ทุก platform แสดง "Search Volume"
- ใช้สี blue เหมือนกันหมด
- ไม่มีข้อมูลเฉพาะ platform (เช่น subreddit, comments)

### After (Platform-specific dialogs)
- ✅ TikTok: "Video Views" 
- ✅ X: "Tweet Volume"
- ✅ Reddit: "Upvotes" + "Comments" + "Subreddit"
- ✅ สีที่เหมาะสมกับแต่ละ platform
- ✅ Icon ที่สื่อความหมายถูกต้อง

## Files Created/Modified

### New Files
- `components/LandingDashboard/trends/TikTokDetailsDialog.tsx`
- `components/LandingDashboard/trends/XDetailsDialog.tsx`
- `components/LandingDashboard/trends/RedditDetailsDialog.tsx`

### Modified Files
- `components/LandingDashboard/trends/TikTokTreemap.tsx`
- `components/LandingDashboard/trends/XTreemap.tsx`
- `components/LandingDashboard/trends/RedditTreemap.tsx`

### Unchanged (Still used for Google Trends)
- `components/LandingDashboard/trends/TrendDetailsDialog.tsx`
