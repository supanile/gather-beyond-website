// Timezone utility functions for mission date/time handling

export interface TimezoneOption {
  value: string;
  label: string;
  country: string;
  flag: string; // Unicode flag emoji
}

export const TIMEZONE_OPTIONS: TimezoneOption[] = [
  {
    value: 'Asia/Bangkok',
    label: 'Thailand (GMT+7)',
    country: 'TH',
    flag: '🇹🇭'
  },
  {
    value: 'Asia/Singapore',
    label: 'Singapore (GMT+8)',
    country: 'SG',
    flag: '🇸🇬'
  },
  {
    value: 'Asia/Jakarta',
    label: 'Indonesia (GMT+7)',
    country: 'ID',
    flag: '🇮🇩'
  },
  {
    value: 'Asia/Kuala_Lumpur',
    label: 'Malaysia (GMT+8)',
    country: 'MY',
    flag: '🇲🇾'
  },
  {
    value: 'Asia/Manila',
    label: 'Philippines (GMT+8)',
    country: 'PH',
    flag: '🇵🇭'
  },
  {
    value: 'Asia/Ho_Chi_Minh',
    label: 'Vietnam (GMT+7)',
    country: 'VN',
    flag: '🇻🇳'
  }
];

// Default timezone (can be changed based on user preference)
export const DEFAULT_TIMEZONE = 'Asia/Singapore';

// Get timezone from localStorage or use default
export const getUserTimezone = (): string => {
  if (typeof window === 'undefined') return DEFAULT_TIMEZONE;
  
  const savedTimezone = localStorage.getItem('userTimezone');
  return savedTimezone || DEFAULT_TIMEZONE;
};

// Save timezone to localStorage
export const setUserTimezone = (timezone: string): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('userTimezone', timezone);
};

// Convert date to datetime-local format using specified timezone
export const convertToDatetimeLocal = (
  dateValue: string | number | null | undefined,
  timezone?: string
): string | undefined => {
  if (!dateValue) return undefined;

  try {
    let date: Date;

    if (typeof dateValue === "number") {
      // Unix timestamp
      date = new Date(dateValue * 1000);
    } else if (typeof dateValue === "string") {
      date = new Date(dateValue);
    } else {
      return undefined;
    }

    if (isNaN(date.getTime())) return undefined;

    const userTimezone = timezone || getUserTimezone();

    // แปลงเป็น format YYYY-MM-DDTHH:mm สำหรับ datetime-local input
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // ใช้ toLocaleTimeString สำหรับเวลา โดยระบุ timezone ที่ user เลือก
    const timeString = date.toLocaleTimeString('en-US', { 
      hour12: false, 
      timeZone: userTimezone 
    });
    
    console.log("🔄 Converting date to time string:", { date, timeString, timezone: userTimezone });
    const [hours, minutes] = timeString.split(':');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch {
    return undefined;
  }
};

// Format date with time for display using specified timezone
export const formatDateWithTime = (
  dateValue: string | number | null | undefined,
  timezone?: string
): string => {
  if (!dateValue) return "N/A";

  try {
    let date: Date;

    if (typeof dateValue === "number") {
      date = new Date(dateValue * 1000);
    } else if (typeof dateValue === "string") {
      date = new Date(dateValue);
    } else {
      return "N/A";
    }

    if (isNaN(date.getTime())) return "N/A";

    const userTimezone = timezone || getUserTimezone();

    const options: Intl.DateTimeFormatOptions = {
      timeZone: userTimezone,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    const formatter = new Intl.DateTimeFormat("en-GB", options);
    return formatter.format(date);
  } catch (error) {
    console.error("Error formatting date with time:", error);
    return "N/A";
  }
};

// Convert timestamp to Date object
export const timestampToDate = (
  dateValue: string | number | null | undefined
): Date | null => {
  if (!dateValue) return null;

  try {
    let date: Date;

    if (typeof dateValue === "number") {
      date = new Date(dateValue * 1000);
    } else if (typeof dateValue === "string") {
      date = new Date(dateValue);
    } else {
      return null;
    }

    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    console.error("Error converting timestamp to date:", error);
    return null;
  }
};

// Check if date matches filter criteria
export const matchesDateFilter = (
  dateValue: string | number | null | undefined,
  filter: { type: 'all' | 'date'; date?: string }
): boolean => {
  if (filter.type === 'all') return true;

  const date = timestampToDate(dateValue);
  if (!date) return false;

  const userTimezone = getUserTimezone();

  if (filter.type === 'date' && filter.date) {
    const targetDate = new Date(filter.date);
    const dateInTimezoneStr = date.toLocaleDateString("en-CA", { timeZone: userTimezone }); // YYYY-MM-DD format
    const targetDateStr = targetDate.toLocaleDateString("en-CA");
    return dateInTimezoneStr === targetDateStr;
  }

  return true;
};
