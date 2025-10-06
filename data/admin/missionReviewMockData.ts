import { UserMission, MissionReviewStats } from "@/types/admin/missionReview";

export const mockUserMissions: UserMission[] = [
  {
    _id: 1,
    mission_id: 10,
    mission_name: "Follow BTC Rush on X",
    user_id: "745520965794005046",
    status: "completed",
    accepted_at: 1751869410,
    submitted_at: 1755038105,
    completed_at: 1755038151,
    submission_link: "https://x.com/BxXAngelXxB",
    notes: ""
  },
  {
    _id: 2,
    mission_id: 9,
    mission_name: "Join Staika Discord",
    user_id: "745520965794005046",
    status: "submitted",
    accepted_at: 1751869511,
    submitted_at: null,
    completed_at: null,
    submission_link: "",
    notes: ""
  },
  {
    _id: 3,
    mission_id: 8,
    mission_name: "Follow Staika on X",
    user_id: "745520965794005046",
    status: "completed",
    accepted_at: 1751869530,
    submitted_at: 1755038078,
    completed_at: 1755038145,
    submission_link: "https://x.com/BxXAngelXxB",
    notes: ""
  },
  {
    _id: 4,
    mission_id: 5,
    mission_name: "Signal Boost: Why You're Hyped",
    user_id: "745520965794005046",
    status: "submitted",
    accepted_at: 1751925204,
    submitted_at: 1755038000,
    completed_at: null,
    submission_link: "https://example.com/submission",
    notes: "User submitted their response"
  },
  {
    _id: 5,
    mission_id: 7,
    mission_name: "Create Bread account",
    user_id: "745520965794005046",
    status: "completed",
    accepted_at: 1751925235,
    submitted_at: 1751927043,
    completed_at: 1751943008,
    submission_link: "maangelikabarreto99@gmail.com",
    notes: ""
  },
  {
    _id: 6,
    mission_id: 6,
    mission_name: "Follow Bread.gg on X",
    user_id: "745520965794005046",
    status: "completed",
    accepted_at: 1751925251,
    submitted_at: 1755038092,
    completed_at: 1755038148,
    submission_link: "https://x.com/BxXAngelXxB",
    notes: ""
  },
  {
    _id: 7,
    mission_id: 11,
    mission_name: "Join Community Forum",
    user_id: "123456789012345678",
    status: "submitted",
    accepted_at: 1751925300,
    submitted_at: 1755038200,
    completed_at: null,
    submission_link: "https://forum.example.com/user/newuser",
    notes: "Waiting for verification"
  },
  {
    _id: 8,
    mission_id: 12,
    mission_name: "Share Project Tweet",
    user_id: "987654321098765432",
    status: "submitted",
    accepted_at: null,
    submitted_at: null,
    completed_at: null,
    submission_link: "",
    notes: ""
  }
];

export const mockMissionReviewStats: MissionReviewStats = {
  total: 8,
  accepted: 2,
  submitted: 1,
  completed: 5,
  rejected: 0
};
