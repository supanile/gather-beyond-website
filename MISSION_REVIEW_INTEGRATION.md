# Mission Review System Integration Guide

## Overview
ระบบนี้แปลง Discord bot functions เดิมที่ใช้ SQLite เป็น Grist API สำหรับจัดการ mission reviews, rewards, และ user progression

## ไฟล์ที่สร้างใหม่

### 1. `/lib/missions/missionUtils.ts`
- **หน้าที่**: Utility functions สำหรับจัดการ missions, user agents, และ rewards
- **ฟังก์ชันหลัก**:
  - `getMissionById()` - ดึงข้อมูล mission
  - `getUserMission()` - ดึงข้อมูล user mission
  - `completeMission()` - เมื่อ approve mission จะให้ rewards
  - `addXPToUser()` - เพิ่ม XP และคำนวณ level up
  - `updateAgentHealth()` - อัปเดต health และ mood
  - `updateUserStats()` - อัปเดต missions completed และ credits

### 2. `/app/api/missions/review/route.ts`
- **หน้าที่**: API endpoint สำหรับ approve/reject missions
- **วิธีใช้**:
```typescript
POST /api/missions/review
{
  "action": "approve" | "reject",
  "userId": "discord-user-id",
  "missionId": 123,
  "approvedBy": "admin-discord-id"
}
```

### 3. `/lib/discord/missionReviewHandlers.ts`
- **หน้าที่**: Functions สำหรับสร้าง Discord embeds และจัดการ bot interactions
- **ฟังก์ชันหลัก**:
  - `handleMissionReviewAction()` - เรียก API approve/reject
  - `createApprovedMissionEmbed()` - สร้าง embed สำหรับ approved mission
  - `createRejectedMissionEmbed()` - สร้าง embed สำหรับ rejected mission
  - `createRewardNotificationEmbed()` - สร้าง embed แจ้ง rewards
  - `createMissionReviewButtons()` - สร้าง approve/reject buttons

### 4. `/lib/discord/exampleBotIntegration.ts`
- **หน้าที่**: ตัวอย่างการใช้งานกับ Discord.js bot
- **วิธีใช้**: แสดงวิธีการ integrate กับ Discord bot จริง

## การใช้งานใน Discord Bot

### 1. การติดตั้ง
```bash
npm install discord.js
```

### 2. การ Setup Environment Variables
```env
DISCORD_BOT_TOKEN=your-bot-token
NEXT_PUBLIC_BASE_URL=http://localhost:3000
GRIST_DOC_URL=your-grist-doc-url
```

### 3. การใช้งานในโค้ด Discord Bot

#### เมื่อมี mission submission:
```typescript
import { 
  createMissionReviewEmbed, 
  createMissionReviewButtons 
} from './lib/discord/missionReviewHandlers';

// สร้าง embed และ buttons สำหรับ review
const embedData = createMissionReviewEmbed(userId, mission, submissionData);
const buttonsData = createMissionReviewButtons(userId, missionId);

// แปลงเป็น Discord.js objects และส่งข้อความ
const embed = new EmbedBuilder()...
const buttons = buttonsData.map(...)...
```

#### เมื่อ admin กดปุ่ม approve/reject:
```typescript
// ใน interaction handler
if (interaction.customId.startsWith('approve_mission_') || 
    interaction.customId.startsWith('reject_mission_')) {
  
  const [action, , userId, missionId] = interaction.customId.split('_');
  
  // เรียก API
  const result = await handleMissionReviewAction(
    action === 'approve' ? 'approve' : 'reject',
    userId,
    parseInt(missionId),
    interaction.user.id
  );
  
  // อัปเดตข้อความและส่ง notification
  // ... (ดูใน exampleBotIntegration.ts)
}
```

## Grist Database Structure

### Tables ที่ต้องมี:
1. **Users**: `discord_id`, `missions_completed`, `total_points`, `credits`
2. **Missions**: `title`, `description`, `reward` (JSON)
3. **User_missions**: `user_id`, `mission_id`, `status`, `completed_at`
4. **User_agents**: `user_id`, `xp`, `level`, `health`, `mood`, `total_xp`, etc.

## การทำงานของระบบ

### เมื่อ Approve Mission:
1. เรียก API `/api/missions/review` ด้วย action: "approve"
2. ตรวจสอบ mission status = "submitted"
3. อัปเดต status เป็น "completed"
4. คำนวณและให้ rewards:
   - XP (default 50 หรือตาม mission reward)
   - Health (+10)
   - Credits (เท่ากับ XP)
   - ตรวจสอบ level up
5. อัปเดต user stats
6. ส่ง notification กลับไปที่ Discord

### เมื่อ Reject Mission:
1. เรียก API `/api/missions/review` ด้วย action: "reject"
2. อัปเดต status เป็น "rejected"
3. ส่ง notification กลับไปที่ Discord

## การ Migrate จาก SQLite

### ความแตกต่างหลัก:
1. **Database calls**: เปลี่ยนจาก `db.prepare()` เป็น `grist.fetchTable()` และ `grist.updateRecords()`
2. **Type safety**: เพิ่ม type conversion functions (`ensureNumber`, `ensureString`)
3. **Async/await**: ทุกการเรียก database เป็น async
4. **Error handling**: ปรับปรุง error handling สำหรับ API calls

### ตัวอย่างการแปลง:
```typescript
// เดิม (SQLite)
const userMission = db.prepare('SELECT * FROM user_missions WHERE user_id = ? AND mission_id = ?').get(userId, missionId);

// ใหม่ (Grist)
const userMissions = await grist.fetchTable("User_missions");
const userMission = userMissions.find(um => 
  ensureString(um.user_id) === userId && ensureNumber(um.mission_id) === missionId
);
```

## การทดสอบ

### ทดสอบ API:
```bash
curl -X POST http://localhost:3000/api/missions/review \
  -H "Content-Type: application/json" \
  -d '{
    "action": "approve",
    "userId": "discord-user-id",
    "missionId": 1,
    "approvedBy": "admin-id"
  }'
```

### ทดสอบ Discord Integration:
1. สร้าง Discord bot
2. เพิ่ม event handlers ตาม exampleBotIntegration.ts
3. ทดสอบส่ง mission review message
4. ทดสอบกดปุ่ม approve/reject

## Next Steps

1. **Setup Discord Bot**: ใช้ exampleBotIntegration.ts เป็น template
2. **Configure Grist**: ตรวจสอบ database structure และ permissions
3. **Environment Setup**: ตั้งค่า environment variables
4. **Testing**: ทดสอบ API endpoints และ Discord integration
5. **Deploy**: Deploy Next.js app และ Discord bot

## Notes

- ระบบนี้รองรับ level progression แบบ 100 XP ต่อ level
- Health และ mood system ทำงานอัตโนมัติ
- รองรับ multiple level ups ในครั้งเดียว
- Error handling และ logging ครอบคลุม
- Type-safe กับ TypeScript
