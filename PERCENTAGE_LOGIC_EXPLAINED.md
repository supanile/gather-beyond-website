# ActiveUsersCard - Percentage Calculation Logic 📊

## การคำนวณ Percentage

### สำหรับ 7d, 14d, 30d (Growth Percentage)

**วัดจาก:** การเปรียบเทียบกับช่วงเวลาที่ยาวกว่า

```typescript
// ตัวอย่าง: 7d vs 14d
current = 7d users    // เช่น 25 users
previous = 14d users  // เช่น 40 users

growthPercentage = ((25 - 40) / 40) * 100 = -37.5%
// แสดงเป็น: 🔻 38% (สีแดง)
```

**การแปลความหมาย:**
- **บวก (เขียว)**: Active users ใน 7d มากกว่า active users ใน 14d = แนวโน้มดี
- **ลบ (แดง)**: Active users ใน 7d น้อยกว่า active users ใน 14d = แนวโน้มลดลง

### สำหรับ 60d (Activity Rate)

**วัดจาก:** สัดส่วนของ active users ต่อ total users

```typescript
totalUsers = 150        // จำนวน users ทั้งหมด
activeUsers60d = 75     // users ที่ active ใน 60 วัน

activityRate = (75 / 150) * 100 = 50%
// แสดงเป็น: 🎯 50% active (สีน้ำเงิน)
```

**การแปลความหมาย:**
- **50%**: ครึ่งหนึ่งของ users ทั้งหมดยัง active ใน 60 วันที่ผ่านมา
- **สูง (70%+)**: app มี engagement ดี
- **ต่ำ (30%-)**: app อาจมีปัญหา retention

## ตัวอย่างการทำงาน

### Scenario 1: App ที่กำลังเติบโต 📈

```
Total Users: 200
- 7d:  45 users  
- 14d: 65 users
- 30d: 85 users  
- 60d: 105 users

Percentages:
- 7d:  ((45-65)/65)*100 = -31% 🔻 (แปลว่า recent activity ลดลง)
- 14d: ((65-85)/85)*100 = -24% 🔻  
- 30d: ((85-105)/105)*100 = -19% 🔻
- 60d: (105/200)*100 = 53% 🎯 active rate
```

### Scenario 2: App ที่มี engagement ดี 🎯

```
Total Users: 100
- 7d:  35 users
- 14d: 45 users  
- 30d: 55 users
- 60d: 65 users

Percentages:
- 7d:  ((35-45)/45)*100 = -22% 🔻
- 14d: ((45-55)/55)*100 = -18% 🔻  
- 30d: ((55-65)/65)*100 = -15% 🔻
- 60d: (65/100)*100 = 65% 🎯 active rate
```

### Scenario 3: App ที่มีปัญหา 📉

```
Total Users: 500
- 7d:  15 users
- 14d: 25 users
- 30d: 40 users  
- 60d: 60 users

Percentages:
- 7d:  ((15-25)/25)*100 = -40% 🔻 (แนวโน้มแย่)
- 14d: ((25-40)/40)*100 = -38% 🔻
- 30d: ((40-60)/60)*100 = -33% 🔻  
- 60d: (60/500)*100 = 12% 🎯 active rate (ต่ำมาก)
```

## สี Indicators

### Growth Percentage (7d, 14d, 30d)
- **🟢 เขียว**: เปอร์เซ็นต์บวก (แนวโน้มดี)
- **🔴 แดง**: เปอร์เซ็นต์ลบ (แนวโน้มไม่ดี)

### Activity Rate (60d)  
- **🔵 น้ำเงิน**: อัตราการ active (neutral indicator)

## เหตุผลของการออกแบบ

### ทำไม 60d ไม่มี Growth Percentage?
1. **ไม่มีข้อมูลเปรียบเทียบ**: 60d เป็นช่วงยาวสุด ไม่มี 90d หรือ 120d ให้เปรียบเทียบ
2. **Activity Rate มีความหมายมากกว่า**: ดูสัดส่วน active users ต่อ total users
3. **Avoid Misleading**: การเปรียบเทียบกับ 30d จะทำให้เข้าใจผิด

### ทำไมใช้ "vs ช่วงยาวกว่า" แทน "vs ช่วงสั้นกว่า"?
1. **แนวโน้มที่ชัดเจน**: 7d น้อยกว่า 14d = recent activity ลดลง
2. **สมจริง**: คนที่ active ใน 7d จะ active ใน 14d ด้วย (subset)
3. **ป้องกัน False Positive**: ถ้าเปรียบเทียบแบบตรงกันข้าม อาจได้ผลบวกเสมอ

## การปรับแต่ง

### เพิ่มช่วงเวลาใหม่ (เช่น 90d)
```typescript
const timeRanges = [
  { label: "7 days", days: 7, shortLabel: "7d" },
  { label: "14 days", days: 14, shortLabel: "14d" },
  { label: "30 days", days: 30, shortLabel: "30d" },
  { label: "60 days", days: 60, shortLabel: "60d" },
  { label: "90 days", days: 90, shortLabel: "90d" }, // ใหม่
];

// ตอนนี้ 60d จะมี growth percentage vs 90d
// และ 90d จะแสดง activity rate แทน
```

### เปลี่ยน Logic การเปรียบเทียบ
```typescript
// แทนที่จะเปรียบเทียบกับช่วงยาวกว่า
// เปรียบเทียบกับข้อมูลเดือนที่แล้ว (จำเป็นต้องมี historical data)
const lastMonth7d = getActiveUsersInDaysFromDate(7, lastMonthDate);
const thisMonth7d = getActiveUsersInDays(7);
const monthOverMonthGrowth = ((thisMonth7d - lastMonth7d) / lastMonth7d) * 100;
```
