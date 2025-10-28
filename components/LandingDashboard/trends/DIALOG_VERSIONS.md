# Trend Details Dialog Components

ในโฟลเดอร์นี้มี Trend Details Dialog หลายเวอร์ชันให้เลือกใช้:

## ไฟล์หลัก
- **`TrendDetailsDialog.tsx`** - เวอร์ชันปัจจุบันที่ใช้ในแอป (Google Trends Style)

## ไฟล์เพิ่มเติม
- **`TrendDetailsDialogGoogle.tsx`** - Google Trends Style UI (สีขาว/เทา, Area Chart, รูปแบบ Google)
- **`TrendDetailsDialogTwitter.tsx`** - Twitter/X Style UI (สีเข้ม, Bar Chart, รูปแบบ Twitter)

## วิธีเปลี่ยนระหว่างเวอร์ชัน

### เปลี่ยนเป็น Twitter Style:
```bash
# Backup current version
cp components/LandingDashboard/trends/TrendDetailsDialog.tsx components/LandingDashboard/trends/TrendDetailsDialog.backup.tsx

# Use Twitter version
cp components/LandingDashboard/trends/TrendDetailsDialogTwitter.tsx components/LandingDashboard/trends/TrendDetailsDialog.tsx
```

### เปลี่ยนเป็น Google Style:
```bash
# Backup current version
cp components/LandingDashboard/trends/TrendDetailsDialog.tsx components/LandingDashboard/trends/TrendDetailsDialog.backup.tsx

# Use Google version
cp components/LandingDashboard/trends/TrendDetailsDialogGoogle.tsx components/LandingDashboard/trends/TrendDetailsDialog.tsx
```

## ความแตกต่างระหว่างเวอร์ชัน

### Google Trends Style
- ใช้สีขาว/เทา เหมาะกับ light theme
- Area Chart แบบ Google Trends
- Layout แบบ clean และ minimal
- เน้นการแสดงข้อมูล Search Interest
- ใช้ gradient สี blue

### Twitter Style  
- ใช้สีเข้ม เหมาะกับ dark theme
- Bar Chart แบบ Twitter Analytics
- Layout แบบ card-based
- เน้นการแสดงข้อมูล Tweet Volume
- ใช้สีตามทิศทางของเทรนด์ (เขียว/แดง)

## หมายเหตุ
- ทั้งสองเวอร์ชันใช้ interface และ props เดียวกัน
- สามารถเปลี่ยนได้โดยไม่ต้องแก้ไขไฟล์อื่น
- ข้อมูลและ functionality เหมือนกัน เพียงแต่รูปแบบการแสดงผลต่างกัน
