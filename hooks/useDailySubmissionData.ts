import { useState, useEffect } from "react";
import { UserMission, DailySubmissionData, MissionPerformance } from "@/types/admin/user-missions";

export const useDailySubmissionData = (
  timeRange: string, 
  filterType: string,
  dateRangeMode: "relative" | "date" | "all" = "relative",
  customDateRange?: { from: Date | undefined; to: Date | undefined }
) => {
  const [userMissions, setUserMissions] = useState<UserMission[]>([]);
  const [statisticsData, setStatisticsData] = useState<DailySubmissionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch statistics data from the new endpoint
      const statisticsResponse = await fetch("/api/user-missions/statistics");
      if (!statisticsResponse.ok) {
        throw new Error("Failed to fetch statistics data");
      }
      const statisticsResult = await statisticsResponse.json();

      if (statisticsResult.success) {
        setStatisticsData(statisticsResult.data);
      } else {
        throw new Error(statisticsResult.error || "Failed to fetch statistics");
      }

      // Still fetch user missions for top missions calculation
      const userMissionsResponse = await fetch("/api/user-missions");
      if (!userMissionsResponse.ok) {
        throw new Error("Failed to fetch user missions");
      }
      const missions = await userMissionsResponse.json();

      setUserMissions(missions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange, filterType, dateRangeMode, customDateRange]);

  const processChartData = (): DailySubmissionData[] => {
    if (!statisticsData.length) return [];

    let startDate: Date;
    let endDate: Date;

    if (dateRangeMode === "all") {
      // Use all available data
      const dates = statisticsData.map(item => new Date(item.date));
      startDate = new Date(Math.min(...dates.map(d => d.getTime())));
      endDate = new Date(Math.max(...dates.map(d => d.getTime())));
    } else if (dateRangeMode === "date" && customDateRange?.from && customDateRange?.to) {
      // Use custom date range
      startDate = new Date(customDateRange.from);
      endDate = new Date(customDateRange.to);
      
      // ถ้าเลือกวันเดียวกัน ตั้งเวลาให้ครอบคลุมทั้งวัน
      if (startDate.getTime() === endDate.getTime()) {
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
      } else {
        // ถ้าเป็นช่วงวันที่ ตั้งเวลาให้ครอบคลุมทั้งวันทั้งสองวัน
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
      }
    } else if (dateRangeMode === "date" && customDateRange?.from) {
      // ถ้ามีแค่วันเริ่มต้น
      startDate = new Date(customDateRange.from);
      endDate = new Date(customDateRange.from);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // Use relative date range (default behavior)
      endDate = new Date();
      // ตั้งเวลาให้ครอบคลุมถึงสิ้นวันปัจจุบัน
      endDate.setHours(23, 59, 59, 999);
      
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);

      if (filterType === "days") {
        const days = parseInt(timeRange);
        startDate.setDate(startDate.getDate() - days + 1); // +1 เพื่อนับรวมวันปัจจุบัน
      } else if (filterType === "months") {
        const months = parseInt(timeRange);
        startDate.setMonth(startDate.getMonth() - months);
      }
    }

    // Filter statistics data based on the selected time range
    const filteredData = statisticsData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    });

    // Calculate unique users for each day
    const enrichedData = filteredData.map((item) => {
      const itemDate = new Date(item.date);
      const dayStart = new Date(itemDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(itemDate);
      dayEnd.setHours(23, 59, 59, 999);

      // Find all user missions for this specific day - including all statuses
      const dayMissions = userMissions.filter((mission) => {
        // Check for any mission activity on this day
        const checkDate = (timestamp: number | null) => {
          if (timestamp && timestamp > 0) {
            const date = new Date(timestamp * 1000);
            return date >= dayStart && date <= dayEnd;
          }
          return false;
        };

        return (
          checkDate(mission.accepted_at) ||
          checkDate(mission.submitted_at) ||
          checkDate(mission.completed_at)
        );
      });

      // Calculate unique users for this day
      const uniqueUsers = new Set(dayMissions.map((m) => m.user_id)).size;

      // Group missions by user for this day with detailed information
      const userSubmissions = dayMissions.reduce(
        (acc, mission) => {
          if (!acc[mission.user_id]) {
            acc[mission.user_id] = {
              user_id: mission.user_id,
              submissions: 0,
              missions: [],
            };
          }
          acc[mission.user_id].submissions += 1;
          acc[mission.user_id].missions.push({
            mission_id: mission.mission_id,
            mission_name: mission.mission_name,
            status: mission.status,
            platform: mission.platform,
            submission_link: mission.submission_link,
          });
          return acc;
        },
        {} as Record<
          string,
          {
            user_id: string;
            submissions: number;
            missions: Array<{
              mission_id: number;
              mission_name: string;
              status: string;
              platform?: string;
              submission_link: string;
            }>;
          }
        >
      );

      const userDetails = Object.values(userSubmissions).sort(
        (a, b) => b.submissions - a.submissions
      );

      return {
        ...item,
        uniqueUsers,
        userDetails,
      };
    });

    // Sort by date
    return enrichedData.sort((a, b) => a.date.localeCompare(b.date));
  };

  const processTopMissions = (): MissionPerformance[] => {
    if (!userMissions.length) return [];

    let startDate: Date;
    let endDate: Date;

    if (dateRangeMode === "all") {
      // Use all available data
      const submissionDates = userMissions
        .filter(m => m.submitted_at && m.submitted_at > 0)
        .map(m => new Date(m.submitted_at! * 1000));
      
      if (submissionDates.length === 0) return [];
      
      startDate = new Date(Math.min(...submissionDates.map(d => d.getTime())));
      endDate = new Date(Math.max(...submissionDates.map(d => d.getTime())));
    } else if (dateRangeMode === "date" && customDateRange?.from && customDateRange?.to) {
      // Use custom date range
      startDate = new Date(customDateRange.from);
      endDate = new Date(customDateRange.to);
      
      // ถ้าเลือกวันเดียวกัน ตั้งเวลาให้ครอบคลุมทั้งวัน
      if (startDate.getTime() === endDate.getTime()) {
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
      } else {
        // ถ้าเป็นช่วงวันที่ ตั้งเวลาให้ครอบคลุมทั้งวันทั้งสองวัน
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
      }
    } else if (dateRangeMode === "date" && customDateRange?.from) {
      // ถ้ามีแค่วันเริ่มต้น
      startDate = new Date(customDateRange.from);
      endDate = new Date(customDateRange.from);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // Use relative date range (default behavior)
      endDate = new Date();
      // ตั้งเวลาให้ครอบคลุมถึงสิ้นวันปัจจุบัน
      endDate.setHours(23, 59, 59, 999);
      
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);

      if (filterType === "days") {
        const days = parseInt(timeRange);
        startDate.setDate(startDate.getDate() - days + 1); // +1 เพื่อนับรวมวันปัจจุบัน
      } else if (filterType === "months") {
        const months = parseInt(timeRange);
        startDate.setMonth(startDate.getMonth() - months);
      }
    }

    // Filter missions based on time range
    const filteredMissions = userMissions.filter((mission) => {
      if (mission.submitted_at && mission.submitted_at > 0) {
        const submittedDate = new Date(mission.submitted_at * 1000);
        return submittedDate >= startDate && submittedDate <= endDate;
      }
      return false;
    });

    // Group by mission_id and calculate stats
    const missionStats: { [key: number]: MissionPerformance } = {};

    filteredMissions.forEach((mission) => {
      if (!missionStats[mission.mission_id]) {
        missionStats[mission.mission_id] = {
          mission_id: mission.mission_id,
          mission_name: mission.mission_name,
          totalSubmissions: 0,
          completedSubmissions: 0,
          completionRate: 0,
          uniqueUsers: 0,
        };
      }

      missionStats[mission.mission_id].totalSubmissions += 1;
      if (mission.status === "completed") {
        missionStats[mission.mission_id].completedSubmissions += 1;
      }
    });

    // Calculate unique users and completion rates
    Object.keys(missionStats).forEach((missionIdStr) => {
      const missionId = parseInt(missionIdStr);
      const uniqueUsers = new Set(
        filteredMissions
          .filter((m) => m.mission_id === missionId)
          .map((m) => m.user_id)
      ).size;

      missionStats[missionId].uniqueUsers = uniqueUsers;
      missionStats[missionId].completionRate =
        missionStats[missionId].totalSubmissions > 0
          ? Math.round(
              (missionStats[missionId].completedSubmissions /
                missionStats[missionId].totalSubmissions) *
                100
            )
          : 0;
    });

    // Sort by total submissions (descending)
    return Object.values(missionStats).sort(
      (a, b) => b.totalSubmissions - a.totalSubmissions
    );
  };

  return {
    userMissions,
    statisticsData,
    isLoading,
    error,
    chartData: processChartData(),
    topMissions: processTopMissions(),
    refetch: fetchData,
  };
};