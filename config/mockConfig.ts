// Development configuration for mock data
// สลับระหว่าง mock data และ real data ได้ง่าย

export const isDevelopment = process.env.NODE_ENV === 'development';

export const config = {
  // Mock data settings
  useMockData: true, // เปลี่ยนเป็น false เมื่อต้องการใช้ข้อมูลจริง
  
  // Mock data scenarios
  mockScenario: 'default', // 'default', 'growing', 'declining', 'newApp'
  
  // Debug settings
  showDataInfo: isDevelopment, // แสดงข้อมูล debug ใน console
  showExpectedResults: isDevelopment, // แสดงผลลัพธ์ที่คาดหวัง
};

// Helper to get mock scenario
export const getMockScenario = () => {
  switch (config.mockScenario) {
    case 'growing':
      return 'growingUsers';
    case 'declining':
      return 'decliningUsers';
    case 'newApp':
      return 'newAppUsers';
    default:
      return 'defaultUsage';
  }
};

// Debug helper
export const logMockData = (data: { agent?: { last_active?: number } }[], label: string = 'Mock Data') => {
  if (config.showDataInfo) {
    console.group(`🔧 ${label}`);
    console.log('Total users:', data.length);
    console.log('Sample user:', data[0]);
    console.log('Users with agent data:', data.filter(u => u.agent).length);
    console.log('Users with last_active:', data.filter(u => u.agent?.last_active).length);
    console.groupEnd();
  }
};
