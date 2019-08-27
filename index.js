const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const { getCommandFromMessage } = require('./modules/Utils');
const { getLatestNews } = require('./modules/News');
const { showGMMessage, castVoteForDad, getRandomRaider } = require('./modules/FunFunctions');
const {
  startBet, registerForBet, roll, reportHistory,
} = require('./modules/Betting');
const {
  getTokenPrice, getPlayerInfo, getRealmStatus, getBnetAccessToken,
} = require('./modules/Bnet');
const { getHelpEmbed } = require('./modules/Help');
const { sendRaidStartMessage } = require('./modules/Raid');
const {
  getStatsPerPlayer,
  getFightFromURL,
  checkRaiderExistsInGuild,
  sendAdviceToPlayers,
  associateCharacterWithMember,
} = require('./modules/Wipefest');
const { startModel, castVote } = require('./modules/Voting');

const client = new Discord.Client();

const handleMessage = async (msg) => {
  const { content, channel } = msg;

  if (!msg.guild) return;

  if (!content.startsWith(prefix)) return; // Not a message for our BOT, ignore it

  // if (channel.name !== 'webhooks-test') return;
  const isOfficer = msg.member.roles.find(role => role.name === 'Admin') || msg.member.roles.find(role => role.name === 'Officer');
  const isGM = msg.member.roles.find(role => role.name === 'Games Crusher');
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
  } else if (command === 'purge' && isOfficer) {
    if (args[0]) {
      channel.bulkDelete(parseInt(args[0], 10) + 1);
    }
  } else if (command === 'link' && isOfficer) {
    if (args[0] && args[1]) {
      associateCharacterWithMember(msg, args[0], args[1]);
    } else if (args[0]) {
      associateCharacterWithMember(msg, args[0]);
    } else {
      msg.send('Please specify a character to link to yourself');
    }
  } else if (command === 'raid-start' && isOfficer) {
    sendRaidStartMessage(msg, args[0], args[1] || undefined);
    channel.send('Raid start warning sent!');
  } else if (command === 'dad') {
    const votes = castVoteForDad(msg);
    if (!votes) return;
    channel.send(`Your request has been submitted. ${votes} more ${votes === 1 ? 'vote' : 'votes'} required!`);
  } else if (command === 'give-meth-to-addicts' && (isOfficer || isGM)) {
    startBet(msg, args[0]);
  } else if (command === 'roll') {
    roll(msg);
  } else if (command === 'join') {
    registerForBet(msg);
  } else if (command === 'leave') {
    registerForBet(msg, true);
  } else if (command === 'bet-history') {
    reportHistory(msg);
  } else if (command === 'whostolemybike') {
    const raider = getRandomRaider(msg);
    channel.send(`It was that nugget ${raider}`);
  } else if (command === 'start-vote') {
    startModel(msg, args);
  } else if (command === 'vote') {
    if (!args[0]) return;
    castVote(msg, args[0]);
  }
};

//
const handleReady = () => {
  console.log(`Logged in as ${client.user.tag}!`);
  // Set the client user's presence
  client.user.setPresence({ game: { name: `${prefix}help` }, status: 'online' }).catch(console.error);
  getBnetAccessToken();
  console.log('Successfully connected!');
};

const handleError = (e) => {
  // may need further handling
  console.log(e);
};

client.on('ready', handleReady);
client.on('message', handleMessage);
client.on('error', handleError);
client.login(token);

process.on('SIGINT', () => {
  console.log('Logging out...');
  client.destroy(); // Logout when the process is stopped
});
