const { prefix } = require('../config.json');
const { getLatestNews } = require('./News');
const { showGMMessage } = require('./FunFunctions');
const { getTokenPrice } = require('./Bnet');
const { getHelpEmbed } = require('./Help');
const { sendRaidStartMessage } = require('./Raid');
const { startModel, castVote } = require('./Voting');
const { getCommandFromMessage } = require('./Utils');

async function Router(client, msg) {
  const { channel, content } = msg;

  if (!msg.guild) return;

  if (!content.startsWith(prefix)) return; // Not a message for our BOT, ignore it

  // if (channel.name !== 'webhooks-test') return;
  const isOfficer =
    msg.member.roles.highest.name === 'Admin' || msg.member.roles.highest.name === 'Officer' || msg.member.roles.highest.name === 'The One True GM';

  const { command, args } = getCommandFromMessage(msg);

  switch (command) {
    case 'latest-news': {
      const link = await getLatestNews();
      channel.send(link);
      break;
    }
    case 'awesome':
    case 'lame':
      showGMMessage(msg, command);
      break;
    case 'token': {
      const price = await getTokenPrice();
      channel.send(price);
      break;
    }
    case 'help': {
      const help = getHelpEmbed(client.user.avatarURL);
      msg.author.send(help);
      break;
    }
    case 'purge':
      if (isOfficer) {
        if (args[0]) {
          channel.bulkDelete(parseInt(args[0], 10) + 1);
        }
      }
      break;
    case 'raid-start':
      if (isOfficer) {
        sendRaidStartMessage(msg, args[0], args[1] || undefined);
        channel.send('Raid start warning sent!');
      }
      break;
    case 'start-vote':
      startModel(msg, args);
      break;
    case 'start-vote':
      startModel(msg, args);
      break;
    case 'balance':
      startModel(msg, args);
      break;
    case 'vote':
      if (!args[0]) return;
      castVote(msg, args[0]);
      break;
    default:
      channel.send(`${command} not found.`);
      break;
  }
}

module.exports = Router;
