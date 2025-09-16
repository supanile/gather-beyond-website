// Example Discord Bot Integration
// This is an example of how to integrate the mission review system with a Discord bot
// You'll need to install discord.js and set up a proper Discord bot

import { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import {
  handleMissionReviewAction,
  createApprovedMissionEmbed,
  createRejectedMissionEmbed,
  createRewardNotificationEmbed,
  createRejectionNotificationEmbed,
  createMissionReviewButtons,
  createMissionReviewEmbed
} from '../discord/missionReviewHandlers';

// Example usage in Discord bot
export class MissionReviewBot {
  private client: Client;

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
      ]
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.client.on('ready', () => {
      console.log(`Logged in as ${this.client.user?.tag}!`);
    });

    this.client.on('interactionCreate', async (interaction) => {
      if (!interaction.isButton()) return;

      const customId = interaction.customId;
      
      // Handle approve/reject mission buttons
      if (customId.startsWith('approve_mission_') || customId.startsWith('reject_mission_')) {
        await this.handleMissionReviewInteraction(interaction);
      }
    });
  }

  private async handleMissionReviewInteraction(interaction: any) {
    const customId = interaction.customId;
    const [action, , userId, missionId] = customId.split('_');
    
    await interaction.deferReply({ ephemeral: true });

    try {
      const result = await handleMissionReviewAction(
        action === 'approve' ? 'approve' : 'reject',
        userId,
        parseInt(missionId),
        interaction.user.id
      );

      if (!result.success) {
        await interaction.editReply({
          content: `❌ Unable to ${action}: ${result.error}`,
        });
        return;
      }

      // Update original message
      let updatedEmbed;
      if (action === 'approve') {
        updatedEmbed = createApprovedMissionEmbed(result.data, interaction.user.id);
        
        // Send reward notification to user
        try {
          const user = await this.client.users.fetch(userId);
          if (user && result.data.rewards) {
            const rewardEmbedData = createRewardNotificationEmbed(result.data);
            const rewardEmbed = new EmbedBuilder()
              .setColor(rewardEmbedData.color)
              .setTitle(rewardEmbedData.title)
              .setDescription(rewardEmbedData.description)
              .addFields(rewardEmbedData.fields)
              .setTimestamp();
            
            await user.send({ embeds: [rewardEmbed] });
          }
        } catch (error) {
          console.error('Error sending reward notification:', error);
        }
      } else {
        updatedEmbed = createRejectedMissionEmbed(result.data, interaction.user.id);
        
        // Send rejection notification to user
        try {
          const user = await this.client.users.fetch(userId);
          if (user) {
            const rejectionEmbedData = createRejectionNotificationEmbed(result.data.mission.title);
            const rejectionEmbed = new EmbedBuilder()
              .setColor(rejectionEmbedData.color)
              .setTitle(rejectionEmbedData.title)
              .setDescription(rejectionEmbedData.description)
              .addFields(rejectionEmbedData.fields)
              .setTimestamp();
            
            await user.send({ embeds: [rejectionEmbed] });
          }
        } catch (error) {
          console.error('Error sending rejection notification:', error);
        }
      }

      // Convert our embed data to Discord.js EmbedBuilder
      const discordEmbed = new EmbedBuilder()
        .setColor(updatedEmbed.color)
        .setTitle(updatedEmbed.title)
        .setDescription(updatedEmbed.description)
        .addFields(updatedEmbed.fields)
        .setTimestamp();

      await interaction.message.edit({
        embeds: [discordEmbed],
        components: [] // Remove buttons
      });

      await interaction.editReply({
        content: action === 'approve' 
          ? `✅ Mission approved successfully! <@${userId}> has received ${result.data.mission.reward.amount} ${result.data.mission.reward.token}`
          : `❌ Mission rejected. <@${userId}> has been notified.`
      });

    } catch (error) {
      console.error(`Error in handleMissionReview${action === 'approve' ? 'Accept' : 'Reject'}:`, error);
      await interaction.editReply({
        content: `❌ An error occurred while ${action}ing the mission`
      });
    }
  }

  // Method to send mission review message
  public async sendMissionReview(
    channelId: string, 
    userId: string, 
    mission: { title: string; reward: { amount: number; token: string } },
    submissionData?: { description?: string; attachments?: string[] }
  ) {
    try {
      const channel = await this.client.channels.fetch(channelId);
      if (!channel || !channel.isTextBased()) return;

      const embedData = createMissionReviewEmbed(userId, mission, submissionData);
      const buttonsData = createMissionReviewButtons(userId, 1); // Replace with actual mission ID

      const embed = new EmbedBuilder()
        .setColor(embedData.color)
        .setTitle(embedData.title)
        .setDescription(embedData.description)
        .addFields(embedData.fields)
        .setTimestamp();

      const buttons = buttonsData.map(button => 
        new ButtonBuilder()
          .setCustomId(button.customId)
          .setLabel(button.label)
          .setStyle(button.style === 'SUCCESS' ? ButtonStyle.Success : ButtonStyle.Danger)
      );

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);

      await channel.send({
        embeds: [embed],
        components: [row]
      });

    } catch (error) {
      console.error('Error sending mission review:', error);
    }
  }

  public async start(token: string) {
    await this.client.login(token);
  }
}

// Example usage
/*
const bot = new MissionReviewBot();

// Start the bot
bot.start(process.env.DISCORD_BOT_TOKEN!);

// Send a mission review
bot.sendMissionReview(
  'channel-id-here',
  'user-discord-id',
  {
    title: 'Complete Daily Quest',
    reward: { amount: 100, token: 'XP' }
  },
  {
    description: 'I completed the daily quest as shown in the screenshot',
    attachments: ['https://example.com/screenshot.png']
  }
);
*/
