# Google Trends Mock Data Integration

ระบบใหม่สำหรับจำลองข้อมูล Google Trends พร้อมระบบสลับระหว่าง Twitter Trends และ Google Trends

## ไฟล์ที่เกี่ยวข้อง

### 1. Types
- `types/googleTrends.ts` - Type definitions สำหรับ Google Trends
- `types/trends.ts` - Type definitions สำหรับ Twitter Trends (เดิม)

### 2. Mock Data
- `lib/utils/googleTrendsMockData.ts` - Mock data functions สำหรับ Google Trends
- `lib/utils/twitterMockData.ts` - Mock data functions สำหรับ Twitter Trends (เปลี่ยนชื่อจากเดิม)
- `lib/utils/mockData.ts` - Entry point สำหรับเลือกใช้ data source

### 3. Hooks
- `hooks/useGoogleTrends.ts` - Hook สำหรับจัดการ Google Trends data
- `hooks/useTrends.ts` - Hook สำหรับจัดการ Twitter Trends data (เดิม)

### 4. Components
- `components/GoogleTrendsTable.tsx` - Component สำหรับแสดง Google Trends
- `app/google-trends-demo/page.tsx` - หน้าตัวอย่างการใช้งาน

## การใช้งาน

### แบบ Google Trends (ใหม่)

```tsx
import { useGoogleTrends } from '@/hooks/useGoogleTrends';
import GoogleTrendsTable from '@/components/GoogleTrendsTable';

function MyComponent() {
  const { data, metrics, insights, loading, timeframe, setTimeframe } = useGoogleTrends({
    timeframe: '24H',
    autoRefresh: true,
    refreshInterval: 300000 // 5 minutes
  });

  return (
    <div>
      <GoogleTrendsTable limit={20} showMetrics={true} />
    </div>
  );
}
```

### แบบ Twitter Trends (เดิม)

```tsx
import { generateMockTrendsData, processTrendsData } from '@/lib/utils/twitterMockData';

function MyComponent() {
  const data = generateMockTrendsData();
  const metrics = processTrendsData(data);
  
  // ใช้งานเหมือนเดิม
}
```

### แบบสลับ Data Source

```tsx
import { getMockTrendsData, DATA_SOURCES } from '@/lib/utils/mockData';

function MyComponent() {
  // ใช้ Google Trends
  const googleTrends = getMockTrendsData({
    dataSource: DATA_SOURCES.GOOGLE_TRENDS,
    timeframe: '24H'
  });

  // ใช้ Twitter Trends
  const twitterTrends = getMockTrendsData({
    dataSource: DATA_SOURCES.TWITTER
  });

  if (googleTrends.type === 'google_trends') {
    // จัดการ Google Trends data
  } else if (twitterTrends.type === 'twitter') {
    // จัดการ Twitter Trends data
  }
}
```

## ข้อมูล Mock ที่มี

### Google Trends Timeframes:
- **4H**: เทรนด์ล่าสุด 4 ชั่วโมง (6 items)
- **24H**: เทรนด์ในวันนี้ (10 items)
- **48H**: เทรนด์ 2 วันที่ผ่านมา (5 items)  
- **7D**: เทรนด์สัปดาห์นี้ (7 items)

### ข้อมูลจาก CSV ที่รวมไว้:
- คายา พบ บีจีพียู (20K+)
- เช็คสิทธิ์คนละครึ่ง (1M+)
- เจ้าคุณพี่กับอีนางคําดวง ep 15 (20K+)
- chaos zero nightmare (20K+)
- และอื่นๆ อีกมากมาย

## Features

### Google Trends
- ✅ Multiple timeframes (4H, 24H, 48H, 7D)
- ✅ Real-time data simulation
- ✅ Volume categorization (Viral, High, Medium, Low)
- ✅ Momentum tracking (Rising, Stable, Declining)
- ✅ Related terms analysis
- ✅ Geographic insights
- ✅ Auto-refresh capability
- ✅ Search velocity calculation

### Twitter Trends (เดิม)
- ✅ Tweet volume tracking
- ✅ Historical data simulation
- ✅ Percentage changes
- ✅ Top gainers/losers
- ✅ Momentum scoring

## Testing

เข้าไปดูหน้า demo ได้ที่:
```
/google-trends-demo
```

## Configuration

```tsx
// Default configuration
export const DEFAULT_TRENDS_CONFIG: TrendsConfig = {
  dataSource: DATA_SOURCES.GOOGLE_TRENDS,
  timeframe: "24H",
  location: "Thailand",
  refreshInterval: 300000, // 5 minutes
};
```

## Migration Guide

หากต้องการย้ายจาก Twitter Trends ไป Google Trends:

1. เปลี่ยน import:
```tsx
// เดิม
import { generateMockTrendsData } from '@/lib/utils/mockData';

// ใหม่
import { generateGoogleTrendsData } from '@/lib/utils/googleTrendsMockData';
// หรือ
import { useGoogleTrends } from '@/hooks/useGoogleTrends';
```

2. เปลี่ยน component:
```tsx
// เดิม
<TwitterTrendsTable />

// ใหม่
<GoogleTrendsTable />
```

3. อัปเดต data structure ตาม types ใหม่ใน `types/googleTrends.ts`
