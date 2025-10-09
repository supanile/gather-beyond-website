export interface UserMission {
  id: number;
  mission_id: number;
  mission_name: string;
  user_id: string;
  status: "accepted" | "submitted" | "completed" | "rejected";
  platform?: string;
  accepted_at: number;
  submitted_at: number | null;
  completed_at: number | null;
  submission_link: string;
  notes: string;
}

export interface DailySubmissionData {
  date: string;
  dateLabel: string;
  totalSubmissions: number;
  acceptedMissions: number;
  submittedMissions: number;
  completedMissions: number;
  rejectedMissions: number;
  uniqueUsers: number;
  userDetails: {
    user_id: string;
    submissions: number;
    missions: Array<{
      mission_id: number;
      mission_name: string;
      status: string;
      platform?: string;
      submission_link: string;
    }>;
  }[];
}

export interface MissionPerformance {
  mission_id: number;
  mission_name: string;
  totalSubmissions: number;
  completedSubmissions: number;
  completionRate: number;
  uniqueUsers: number;
}

export interface StatusConfig {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  label: string;
}
