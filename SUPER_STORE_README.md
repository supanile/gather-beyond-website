# Super Store Data Feature

## Overview
Super Store Data เป็นฟีเจอร์สำหรับแสดงข้อมูล Leaderboard, การใช้จ่าย Credits และรายชื่อผู้ชนะการแข่งขันใน Gather Beyond

## Features

### 1. Claimers Leaderboard
- แสดงรายชื่อ claimers จัดอันดับตาม rank, level, total XP และ join date
- แสดงข้อมูล: username, email, level, total XP, mood, status, join date
- รองรับการ filter และ sort แบบต่างๆ
- Pagination และ search functionality

### 2. Credits Spent by Tier
- แสดงข้อมูลการใช้จ่าย credits ของ users แยกตาม tier
- แสดงข้อมูล: total credits spent, tier level, purchases count, average purchase amount
- จัดอันดับตาม tier (Bronze, Silver, Gold, Platinum, Diamond)
- แสดง badge และ icon สำหรับแต่ละ tier

### 3. Competition Winners
- แสดงรายชื่อผู้ชนะการแข่งขันต่างๆ
- แสดงข้อมูล: competition name, prize title, prize value, XP earned, date won
- แยกประเภทการแข่งขัน: Weekly, Monthly, Seasonal, Special
- แสดงจำนวนผู้เข้าร่วมและอันดับที่ได้

## File Structure

```
/types/admin/superStoreTypes.ts          # TypeScript interfaces
/data/admin/superStoreMockData.ts        # Mock data for development
/hooks/useSuperStoreData.ts              # Custom hooks for data fetching
/components/admin/super-store/           # UI Components
  ├── SuperStoreOverview.tsx             # Main container component
  ├── LeaderboardTable.tsx               # Claimers leaderboard table
  ├── CreditSpendingTable.tsx            # Credits spending table
  └── WinnersTable.tsx                   # Winners table
/lib/admin/super-store/superStoreApi.ts  # API utilities (for future backend)
```

## Components

### SuperStoreOverview
หน้าหลักที่แสดง stats cards และ tabs สำหรับแต่ละส่วน

### LeaderboardTable
- แสดงตาราง claimers พร้อม ranking system
- รองรับการ sort ตาม rank, level, XP, join date
- แสดง mood badges และ status indicators
- Responsive design สำหรับ mobile และ desktop

### CreditSpendingTable
- แสดงข้อมูลการใช้จ่าย credits ตาม tier
- แสดง tier badges พร้อม icons
- แสดงสถิติการซื้อและค่าเฉลี่ย
- รองรับการ sort ตามเกณฑ์ต่างๆ

### WinnersTable
- แสดงรายการผู้ชนะการแข่งขัน
- แสดงรายละเอียดรางวัลและการแข่งขัน
- จัดกลุ่มตามประเภทการแข่งขัน
- แสดง badge ที่ได้รับ

## Custom Hooks

### useSuperStoreData()
- Fetch ข้อมูลทั้งหมดจาก mock data
- จัดการ loading states และ error handling
- รองรับ refetch functionality

### useLeaderboard(filters)
- Fetch และ filter ข้อมูล claimers
- รองรับการ sort และ filter แบบต่างๆ
- Return filtered claimers และ total count

### useCreditSpending(filters)
- Fetch และ filter ข้อมูลการใช้จ่าย credits
- รองรับการ filter ตาม tier และ date range
- Return filtered spending data

### useWinners(filters)
- Fetch และ filter ข้อมูลผู้ชนะ
- รองรับการ filter ตาม competition type และ date range
- Return filtered winners data

## Mock Data Structure

### Claimer
```typescript
{
  _id: string
  discord_id: string
  username: string
  email: string
  join_date: string
  level: number
  total_xp: number
  mood: "excited" | "happy" | "neutral" | "focused" | "determined" | "stressed"
  rank: number
  avatar_url?: string
  status: "active" | "inactive" | "banned"
}
```

### CreditSpending
```typescript
{
  user_id: string
  username: string
  email: string
  total_credits_spent: number
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond"
  tier_level: number
  last_purchase_date: string
  purchases_count: number
  avg_purchase_amount: number
}
```

### Winner
```typescript
{
  _id: string
  user_id: string
  username: string
  email: string
  competition_name: string
  competition_type: "weekly" | "monthly" | "seasonal" | "special"
  prize_title: string
  prize_value: number
  prize_description: string
  won_date: string
  xp_earned: number
  badge_earned?: string
  rank_achieved: number
  total_participants: number
}
```

## API Integration (Future)

ไฟล์ `superStoreApi.ts` เตรียมไว้สำหรับการเชื่อมต่อกับ backend ในอนาคต:

- `fetchSuperStoreData()` - ดึงข้อมูลทั้งหมด
- `fetchLeaderboard(filters)` - ดึงข้อมูล leaderboard พร้อม filters
- `fetchCreditSpending(filters)` - ดึงข้อมูลการใช้จ่าย credits
- `fetchWinners(filters)` - ดึงข้อมูลผู้ชนะ
- `updateClaimerStatus()` - อัปเดตสถานะ claimer
- `exportDataToCsv()` - Export ข้อมูลเป็น CSV

## Styling & Design

- ใช้ theme เดียวกันกับระบบที่มีอยู่
- รองรับ dark/light mode
- Responsive design สำหรับทุกหน้าจอ
- ใช้ shadcn/ui components
- Animation และ transition effects
- Badge system สำหรับแสดงสถานะและ tier

## Usage

เพิ่ม tab ใหม่ใน admin dashboard:

```tsx
import SuperStoreOverview from "@/components/admin/super-store/SuperStoreOverview";

// ใน TabsList
<TabsTrigger value="super-store">
  <Zap className="h-5 w-5" />
  <span>Super Store Data</span>
</TabsTrigger>

// ใน TabsContent
<TabsContent value="super-store">
  <SuperStoreOverview />
</TabsContent>
```

## Future Enhancements

1. **Real-time Updates**: เชื่อมต่อกับ WebSocket สำหรับ real-time data
2. **Advanced Filtering**: เพิ่ม filter options มากขึ้น
3. **Data Export**: Export ข้อมูลเป็น Excel/PDF
4. **Charts & Analytics**: เพิ่ม charts สำหรับวิเคราะห์ข้อมูล
5. **Notification System**: แจ้งเตือนเมื่อมีผู้ชนะใหม่
6. **User Profile Integration**: เชื่อมโยงกับโปรไฟล์ผู้ใช้
7. **Reward Management**: จัดการรางวัลและการแข่งขัน

## Performance Considerations

- ใช้ pagination สำหรับข้อมูลจำนวนมาก
- Implement virtual scrolling สำหรับ list ที่ยาว
- Cache data ด้วย React Query หรือ SWR
- Optimize images และ avatars
- Debounce search input
- Lazy loading สำหรับ components
