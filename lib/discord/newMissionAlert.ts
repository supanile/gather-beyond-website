/**
 * Formats the mission's end date as a Discord timestamp string.
 * @param duration - JSON string containing mission duration with start/end dates (e.g., '{"start":"2024-06-01T00:00:00Z","end":"2024-06-30T23:59:59Z"}').
 * @returns Formatted Discord timestamp string (e.g., <t:1234567890:R>) or 'No deadline' if duration is invalid or missing.
 */
function getDiscordTimestamp(duration?: string): string {
    if (!duration) return 'No deadline';
    
    try {
        const durationObj = JSON.parse(duration);
        if (!durationObj.end) return 'No deadline';
        
        const endDate = new Date(durationObj.end);
        const endTimestamp = Math.floor(endDate.getTime() / 1000);
        
        return `<t:${endTimestamp}:R>`;
    } catch {
        return 'No deadline';
    }
}

/**
 *
 * @param missionData
 */
export async function sendPublishedMissionAlert(missionData: {
    title: string;
    description: string;
    type: string;
    platform: string;
    reward?: string | { amount: number; token: string };
    partner?: string | number;
    level_required?: number;
    duration?: string;
    format?: string;
    action_request?: string;
    id2?: number;
}): Promise<void> {
    try {
        const PUBLISHED_MISSION_CHANNEL_ID = '1432926699313434634';
        const MISSIONS_ALERT_IMAGE_URL = 'https://i.ibb.co/kghVrjvc/super-connector.png';
        
        const timeRemaining = getDiscordTimestamp(missionData.duration);
        
        let rewardText = 'N/A';
        if (typeof missionData.reward === 'string') {
            try {
                const rewardObj = JSON.parse(missionData.reward);
                rewardText = `${rewardObj.amount} ${rewardObj.token}`;
            } catch {
                rewardText = missionData.reward;
            }
        } else if (missionData.reward) {
            rewardText = `${missionData.reward.amount} ${missionData.reward.token}`;
        }
        
        const missionTitle = `🎯 ${missionData.title}`;
        
        const levelAndTime = `⭐ Level ${missionData.level_required || 1} | ⏰ Ends in ${timeRemaining}`;
        
        let fullDescription = `${missionTitle}\n${levelAndTime}\n\n${missionData.description}`;
        
        fullDescription += `\n\n💰 Reward: ${rewardText}`;
        
        const response = await fetch(`https://discord.com/api/v10/channels/${PUBLISHED_MISSION_CHANNEL_ID}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                embeds: [{
                    title: "🚨 New Mission Published!",
                    description: fullDescription,
                    image: {
                        url: MISSIONS_ALERT_IMAGE_URL,
                    },
                    color: 0x5865F2,
                    timestamp: new Date().toISOString(),
                }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to send published mission alert:', response.status, errorText);
        } else {
            console.log('✅ Published mission alert sent successfully to channel:', PUBLISHED_MISSION_CHANNEL_ID);
        }
    } catch (error) {
        console.error('Error sending published mission alert:', error);
    }
}