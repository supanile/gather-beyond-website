## การย้าย Live Dashboard Controls ไปยัง TrendTreemap

### สิ่งที่เปลี่ยนแปลง:

#### 1. **TrendTreemap.tsx**
- เพิ่ม Live Dashboard controls ไว้ด้านบนของ Range Navigation Buttons
- เพิ่ม props สำหรับ Live Dashboard:
  - `timeRange`, `location`, `lastUpdated`, `totalTrends`, `totalVolume`
  - `onRefetch`, `TimeRangeSelector`, `LocationFilter`, `formatVolume`
  - `onTimeRangeChange`, `onLocationChange` สำหรับ callback functions
- Live Dashboard controls จะแสดงเฉพาะเมื่อมี props ที่เกี่ยวข้องส่งมา

#### 2. **TwitterTrendsArena.tsx**
- ลบ Controls Card ออก
- ส่ง props ทั้งหมดที่จำเป็นไปยัง TrendTreemap component
- รักษา state management ไว้ที่ TwitterTrendsArena level

### ผลลัพธ์:
- Live Dashboard controls และ Range Navigation Buttons อยู่ใน container เดียวกันใน TrendTreemap
- การทำงานของ controls ยังคงเหมือนเดิม
- Code ดูเป็นระเบียบและจัดการได้ง่ายกว่า

### การใช้งาน:
TrendTreemap จะแสดง Live Dashboard controls เมื่อได้รับ props ที่เกี่ยวข้อง:

```tsx
<TrendTreemap
  trends={trends}
  loading={loading}
  error={error}
  // Live Dashboard props
  timeRange={timeRange}
  location={location}
  lastUpdated={lastUpdated}
  totalTrends={totalTrends}
  totalVolume={totalVolume}
  onRefetch={refetch}
  TimeRangeSelector={TimeRangeSelector}
  LocationFilter={LocationFilter}
  formatVolume={formatVolume}
  onTimeRangeChange={setTimeRange}
  onLocationChange={setLocation}
/>
```

หากไม่ส่ง props เหล่านี้ TrendTreemap จะแสดงเฉพาะ Range Navigation Buttons เท่านั้น
