require('dotenv').config();
console.log(process.env.TOKEN);  // This should print the bot token to the console

const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

// Create a basic web server to prevent sleeping (useful for Replit, UptimeRobot, etc.)
const app = express();
app.get('/', (req, res) => {
  res.send('Bot is running...');
});
app.listen(3000, () => console.log('Web server is live!'));

// Create a new client instance with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences, // Enable presence tracking
  ],
});

// Define the user IDs to track
const trackedUserIds = ['856280684476629063', '637527706803896340', '451233781760917524']; 

// When bot is ready
client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Handle presence updates
client.on('presenceUpdate', (oldPresence, newPresence) => {
  if (!newPresence || !newPresence.user) return;

  const userId = newPresence.user.id;
  if (trackedUserIds.includes(userId)) {
    const status = newPresence.status || 'unknown';
    console.log(`${newPresence.user.tag} is now ${status}`);

    // Send update to a specific channel
    const channel = client.channels.cache.get('855621950347804672');
    if (channel) {
      channel.send(`${newPresence.user.tag} is now ${status}`);
    }
  }
});

// Error handling to prevent crashes
client.on('error', (error) => console.error('❌ Bot Error:', error));
client.on('warn', (warning) => console.warn('⚠️ Warning:', warning));
client.on('disconnect', () => console.log('🔄 Bot disconnected, attempting to reconnect...'));

// Log in using token
client.login(process.env.TOKEN).catch((err) => {
  console.error('❌ Failed to log in:', err);
});
