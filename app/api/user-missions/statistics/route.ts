import { NextResponse } from 'next/server';
import { grist } from '@/lib/grist';

export async function GET() {
  try {
    const userMissions = await grist.fetchTable("User_missions") as any[];

    const dateGroups = new Map();

    userMissions.forEach((mission: any) => {
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

      dateGroups.get(dateKey).push(mission);
    });

    const statisticsData: any[] = [];

    const sortedDates = Array.from(dateGroups.keys()).sort();

    sortedDates.forEach(dateKey => {
      const dayMissions = dateGroups.get(dateKey);
      const date = new Date(dateKey);

      let acceptedMissions = 0;
      let submittedMissions = 0;
      let completedMissions = 0;
      let rejectedMissions = 0;

      const uniqueMissions = new Map();

      dayMissions.forEach((mission: any) => {
        const missionId = mission.id2 || mission.id;
        if (!uniqueMissions.has(missionId)) {
          uniqueMissions.set(missionId, mission);
        }
      });

      uniqueMissions.forEach((mission: any) => {
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
          month: 'short'
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
