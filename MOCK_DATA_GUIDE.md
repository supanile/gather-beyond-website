# Mock Data Setup Guide 🧪

## การใช้งาน Mock Data สำหรับ ActiveUsersCard

### Quick Start

1. **เปิดใช้งาน Mock Data** (เปิดอยู่แล้ว):
   ```typescript
   // config/mockConfig.ts
   export const config = {
     useMockData: true, // ✅ เปิดใช้งาน mock data
   };
   ```

2. **ดูผลลัพธ์**: เปิด dashboard แล้วดู ActiveUsersCard
   - จะแสดงข้อมูลจำลอง 150 users
   - มี activity pattern ที่สมจริง
   - แสดง growth percentage ได้

### ข้อมูล Mock ที่สร้างไว้

#### Default Pattern (ใกล้เคียงกับ app จริง)
```
📊 Activity Distribution:
- 7 days:  22 users (15%)
- 14 days: 37 users (25%)  
- 30 days: 49 users (33%)
- 60 days: 59 users (40%)
- Inactive: 91 users (60%)
```

#### ผลลัพธ์ที่คาดหวัง
- **7d**: ~22 users
- **14d**: ~37 users  
- **30d**: ~49 users
- **60d**: ~59 users

### การเปลี่ยน Scenario

แก้ไขไฟล์ `config/mockConfig.ts`:

```typescript
export const config = {
  mockScenario: 'growing', // เปลี่ยนตรงนี้
};

// Options:
// 'default'   - ข้อมูลปกติ
// 'growing'   - user base กำลังเติบโต  
// 'declining' - user base กำลังลดลง
// 'newApp'    - app ใหม่ (user ส่วนใหญ่ active)
```

### การ Debug

#### เปิด Debug Mode
```typescript
export const config = {
  showDataInfo: true,        // แสดงข้อมูลใน console
  showExpectedResults: true, // แสดงผลลัพธ์ที่คาดหวัง
};
```

#### ดูข้อมูลใน Console
เปิด Developer Tools (F12) → Console Tab:
```
🔧 Active Users Data
  Total users: 150
  Sample user: {discord_id: "user_0", username: "ActiveUser1", ...}
  Users with agent data: 60
  Users with last_active: 60
```

### การสลับไปใช้ Backend จริง

เมื่อ backend พร้อมแล้ว:

```typescript
// config/mockConfig.ts
export const config = {
  useMockData: false, // ❌ ปิด mock data
};
```

### การสร้าง Mock Data แบบกำหนดเอง

```typescript
// สร้างข้อมูลเฉพาะ
import { generateMockUsers } from "@/data/admin/mockActiveUsers";

const customUsers = generateMockUsers(100); // 100 users
// หรือ
const customPattern = Array.from({ length: 50 }, (_, i) => ({
  discord_id: `custom_${i}`,
  username: `User${i}`,
  email: `user${i}@test.com`,
  agent: {
    last_active: Date.now() - (i * 86400000), // แต่ละคนห่างกัน 1 วัน
    level: i + 1
  }
}));
```

### Test Scenarios

#### 1. Growing App (เติบโต)
```typescript
// ใช้ testScenarios.growingUsers
// ผลลัพธ์: growth percentage เป็นบวก (สีเขียว)
```

#### 2. Declining App (ลดลง) 
```typescript
// ใช้ testScenarios.decliningUsers  
// ผลลัพธ์: growth percentage เป็นลบ (สีแดง)
```

#### 3. New App (app ใหม่)
```typescript
// ใช้ testScenarios.newAppUsers
// ผลลัพธ์: user ส่วนใหญ่ active ใน 14 วันแรก
```

### Expected Results จาก Mock Data

เมื่อใช้ default mock data จะได้:

| Time Range | Count | Growth vs Next |
|------------|-------|----------------|
| 7d         | ~22   | -40% vs 14d    |
| 14d        | ~37   | -24% vs 30d    |
| 30d        | ~49   | -17% vs 60d    |
| 60d        | ~59   | -            |

### Troubleshooting

#### ปัญหา: ไม่เห็นข้อมูล
- ✅ ตรวจสอบ `config.useMockData = true`
- ✅ ตรวจสอบ import path ถูกต้อง
- ✅ ดู console errors

#### ปัญหา: Growth percentage ไม่แสดง
- ✅ ตรวจสอบว่า mock data มี `last_active` 
- ✅ ลอง scenario อื่น

#### ปัญหา: ข้อมูลไม่สมจริง
- ✅ ปรับ activity pattern ใน `generateMockUsers()`
- ✅ สร้าง custom scenario

### การใช้ในการพัฒนา

1. **Development**: ใช้ mock data เพื่อความรวดเร็ว
2. **Testing**: ทดสอบ edge cases ด้วย test scenarios  
3. **Demo**: ใช้ mock data เพื่อ demo ให้ลูกค้า
4. **Production**: สลับไปใช้ backend จริง

---

💡 **Tips**: 
- Mock data จะ regenerate ทุกครั้งที่ refresh page
- ใช้ `console.log(expectedActiveUsers)` เพื่อดูผลลัพธ์ที่คาดหวัง
- สร้าง scenario ใหม่ใน `testScenarios` ได้ตามต้องการ
