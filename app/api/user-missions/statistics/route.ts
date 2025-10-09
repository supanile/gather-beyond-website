import { NextResponse } from 'next/server';
import { grist } from '@/lib/grist';

interface UserMission {
  id?: number;
  id2?: number;
  accepted_at?: string | number;
  status?: 'accepted' | 'submitted' | 'completed' | 'rejected';
}

interface StatisticsData {
  date: string;
  dateLabel: string;
  totalSubmissions: number;
  acceptedMissions: number;
  submittedMissions: number;
  completedMissions: number;
  rejectedMissions: number;
}

export async function GET() {
  try {
    const userMissions = await grist.fetchTable("User_missions") as UserMission[];
    
    if (userMissions.length > 0) {
      console.log('Sample mission:', {
        accepted_at: userMissions[0].accepted_at,
        status: userMissions[0].status,
      });
    }

    const dateGroups = new Map<string, UserMission[]>();

    userMissions.forEach((mission: UserMission) => {
      if (!mission.accepted_at) return;
      
      let date: Date | null = null;
      
      if (typeof mission.accepted_at === 'string') {
        date = new Date(mission.accepted_at);
      } else if (typeof mission.accepted_at === 'number') {
        const timestamp = mission.accepted_at < 10000000000 ? mission.accepted_at * 1000 : mission.accepted_at;
        date = new Date(timestamp);
      }
      
      if (!date || isNaN(date.getTime())) return;
      
      const dateKey = date.toLocaleDateString('en-CA');

      if (!dateGroups.has(dateKey)) {
        dateGroups.set(dateKey, []);
      }

      const dayMissions = dateGroups.get(dateKey);
      if (dayMissions) {
        dayMissions.push(mission);
      }
    });

    const statisticsData: StatisticsData[] = [];

    const sortedDates = Array.from(dateGroups.keys()).sort();

    sortedDates.forEach(dateKey => {
      const dayMissions = dateGroups.get(dateKey);
      if (!dayMissions) return;
      
      const date = new Date(dateKey);

      let acceptedMissions = 0;
      let submittedMissions = 0;
      let completedMissions = 0;
      let rejectedMissions = 0;

      const uniqueMissions = new Map<number, UserMission>();

      dayMissions.forEach((mission: UserMission) => {
        const missionId = mission.id2 || mission.id;
        if (missionId && !uniqueMissions.has(missionId)) {
          uniqueMissions.set(missionId, mission);
        }
      });

      uniqueMissions.forEach((mission: UserMission) => {
        const status = mission.status;
        switch (status) {
          case 'accepted':
            acceptedMissions++;
            break;
          case 'submitted':
            submittedMissions++;
            break;
          case 'completed':
            completedMissions++;
            break;
          case 'rejected':
            rejectedMissions++;
            break;
        }
      });

      const totalSubmissions = uniqueMissions.size;

      statisticsData.push({
        date: dateKey,
        dateLabel: date.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
        }),
        totalSubmissions,
        acceptedMissions,
        submittedMissions,
        completedMissions,
        rejectedMissions
      });
    });

    return NextResponse.json({
      success: true,
      data: statisticsData
    });

  } catch (error) {
    console.error('Error fetching user missions statistics:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
