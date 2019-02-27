const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const { getCommandFromMessage } = require('./modules/Utils');
const { getLatestNews } = require('./modules/News');
const { showGMMessage } = require('./modules/FunFunctions');
const {
  getTokenPrice, getPlayerInfo, getRealmStatus, getBnetAccessToken,
} = require('./modules/Bnet');
const { getHelpEmbed } = require('./modules/Help');
const {
  getStatsPerPlayer,
  getFightFromURL,
  checkRaiderExistsInGuild,
  sendAdviceToPlayers,
  associateCharacterWithMember,
} = require('./modules/Wipefest');

const client = new Discord.Client();

const handleMessage = async (msg) => {
  const { content, channel } = msg;

  if (!msg.guild) return;

  if (!content.startsWith(prefix)) return; // Not a message for our BOT, ignore it

  // if (channel.name !== 'webhooks-test') return;
  const isOfficer = msg.member.roles.find(role => role.name === 'Admin') || msg.member.roles.find(role => role.name === 'Officer');

  const { command, args } = getCommandFromMessage(msg);

  if (command === 'latest-news') {
    const link = await getLatestNews();
    channel.send(link);
  } else if (command === 'awesome' || command === 'lame') {
    showGMMessage(msg, command);
  } else if (command === 'lookup') {
    if (args[0]) {
      const info = await getPlayerInfo(args[0]);
      channel.send(info);
    } else {
      channel.send('Please supply a character and/or realm!');
    }
  } else if (command === 'token') {
    const price = await getTokenPrice();
    channel.send(price);
  } else if (command === 'realm') {
    if (args[0]) {
      const status = await getRealmStatus(args[0]);
      channel.send(status);
    } else {
      channel.send('Please provide a realm name: /realm Sylvanas');
    }
  } else if (command === 'help') {
    const help = getHelpEmbed(client.user.avatarURL);
    msg.author.send(help);
  } else if (command === 'advice' && isOfficer) {
    const advice = getStatsPerPlayer();
    const raiders = checkRaiderExistsInGuild(msg, advice);
    sendAdviceToPlayers(msg, advice, raiders, client.user.avatar);
  } else if (command === 'load-logs' && isOfficer) {
    if (args[0] && args[0].indexOf('https://www.warcraftlogs.com/reports/') > -1) {
      await getFightFromURL(args[0]);
      channel.send('Log loaded!');
    } else {
      channel.send('Please provide a warcraft logs URL');
    }
    channel.send('Thanks!' && isOfficer);
  } else if (command === 'bnet') {
    channel.send('Thanks!');
  } else if (command === 'purge' && isOfficer) {
    if (args[0]) {
      channel.bulkDelete(args[0]);
    }
  } else if (command === 'link' && isOfficer) {
    if (args[0] && args[1]) {
      associateCharacterWithMember(msg, args[0], args[1]);
    } else if (args[0]) {
      associateCharacterWithMember(msg, args[0]);
    } else {
      msg.send('Please specify a character to link to yourself');
    }
  }
};

//
const handleReady = () => {
  console.log(`Logged in as ${client.user.tag}!`);
  // Set the client user's presence
  client.user.setPresence({ game: { name: `${prefix}help` }, status: 'idle' }).catch(console.error);
  getBnetAccessToken();
  console.log('Successfully connected!');
};

client.on('ready', handleReady);
client.on('message', handleMessage);

client.login(token);

process.on('SIGINT', () => {
  console.log('Logging out...');
  client.destroy(); // Logout when the process is stopped
});
