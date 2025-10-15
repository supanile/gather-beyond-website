// // Bot Helper Functions for Discord Bot Integration
// // Export functions that Discord bot needs

// export {
//   getLeaderboard,
//   updateLeaderboardMessage,
//   triggerLeaderboardUpdate,
//   sendMissionApprovalDM,
//   sendMissionRejectionDM,
//   createRewardNotificationEmbed,
//   createRejectionNotificationEmbed,
//   createMissionReviewButtons,
//   createApprovedMissionEmbed,
//   createRejectedMissionEmbed,
//   handleMissionReviewAction
// } from './missionReviewHandlers';

// import { sendMissionApprovalDM } from './missionReviewHandlers';

// // Additional helper function for Discord bot
// export async function notifyMissionApproval(
//   userId: string,
//   missionData: {
//     id: number;
//     title: string;
//     reward: { amount: number; token: string };
//   },
//   rewards: {
//     xp: number;
//     health: number;
//     credits: number;
//     levelUp: boolean;
//     newLevel: number | null;
//   },
//   client?: {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     channels: { cache: { get: (id: string) => any } };
//     user: { displayAvatarURL: () => string };
//   }
// ) {
//   const notificationData = {
//     userId,
//     missionId: missionData.id,
//     mission: {
//       title: missionData.title,
//       reward: missionData.reward
//     },
//     rewards
//   };

//   try {
//     const result = await sendMissionApprovalDM(notificationData, client);
//     return result;
//   } catch (error) {
//     console.error('Error in notifyMissionApproval:', error);
//     return { success: false, error: 'Failed to send notification' };
//   }
// }
