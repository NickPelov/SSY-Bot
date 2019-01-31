const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const { getCommandFromMessage } = require('./utils/MessageHelpers');
const { getLatestNews } = require('./modules/News');

const client = new Discord.Client();

const handleMessage = async (msg) => {
  const { content, channel } = msg;

  if (!msg.guild) return;

  if (!content.startsWith(prefix)) return; // Not a message for our BOT, ignore it

  if (channel.name !== 'webhooks-test') return; // Only looks at messages inside webhooks-test channel

  const command = getCommandFromMessage(msg);

  if (command === 'latest-news') {
    const link = await getLatestNews();
    msg.channel.send(link);
  }
};

const handleReady = () => {
  console.log(`Logged in as ${client.user.tag}!`);
  // Set the client user's presence
  client.user.setPresence({ game: { name: `${prefix}help` }, status: 'idle' }).catch(console.error);
};

client.on('ready', handleReady);
client.on('message', handleMessage);

client.login(token);

process.on('SIGINT', () => {
  console.log('Logging out...');
  client.destroy(); // Logout when the process is stopped
});
