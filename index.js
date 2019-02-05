const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const { getCommandFromMessage } = require('./modules/Utils');
const { getLatestNews } = require('./modules/News');
const { showGMMessage } = require('./modules/FunFunctions');
const {
  getTokenPrice, getPlayerInfo, getRealmStatus, getBnetAccessToken,
} = require('./modules/Bnet');
const { getHelpEmbed } = require('./modules/Help');

const client = new Discord.Client();

const handleMessage = async (msg) => {
  const { content, channel } = msg;

  if (!msg.guild) return;

  if (!content.startsWith(prefix)) return; // Not a message for our BOT, ignore it

  if (channel.name !== 'webhooks-test') return; // Only looks at messages inside webhooks-test channel

  const { command, args } = getCommandFromMessage(msg);

  if (command === 'latest-news') {
    const link = await getLatestNews();
    msg.channel.send(link);
  } else if (command === 'awesome' || command === 'lame') {
    showGMMessage(msg, command);
  } else if (command === 'lookup') {
    const info = await getPlayerInfo(args[0]);
    msg.channel.send(info);
  } else if (command === 'token') {
    const price = await getTokenPrice();
    msg.channel.send(price);
  } else if (command === 'realm') {
    if (args[0]) {
      const status = await getRealmStatus(args[0]);
      msg.channel.send(status);
    } else {
      msg.channel.send('Please provide a realm name: /realm Sylvanas');
    }
  } else if (command === 'help') {
    const help = getHelpEmbed(client.user.avatarURL);
    msg.author.send(help);
  } else if (command === 'bnet') {
    msg.channel.send('Thanks!');
  }
};

const handleReady = () => {
  console.log(`Logged in as ${client.user.tag}!`);
  // Set the client user's presence
  client.user.setPresence({ game: { name: `${prefix}help` }, status: 'idle' }).catch(console.error);
  getBnetAccessToken();
  console.log('Successfully connected to Battle.net API');
};

client.on('ready', handleReady);
client.on('message', handleMessage);

client.login(token);

process.on('SIGINT', () => {
  console.log('Logging out...');
  client.destroy(); // Logout when the process is stopped
});
