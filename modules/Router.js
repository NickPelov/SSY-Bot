const { prefix } = require('../config.json');
const { showGMMessage } = require('./FunFunctions');
const { getHelpEmbed } = require('./Help');
const { sendRaidStartMessage } = require('./Raid');
const { startModel, castVote } = require('./Voting');
const { getCommandFromMessage } = require('./Utils');
const { addPoints, checkBalance } = require('./GoodBoyPoints');
const { checkJoinedDate } = require('./Members');

async function Router(client, msg) {
  const { channel, content } = msg;

  if (!msg.guild) return;

  if (msg.member.user.bot) return;

  if (msg.channel.id === '738158351833366620' && !content.startsWith(prefix)) {
    const { args } = getCommandFromMessage(msg);

    // 561319019651661836  738158351833366620
    addPoints(msg, args);
  }

  if (!content.startsWith(prefix)) return; // Not a message for our BOT, ignore it

  // if (channel.name !== 'webhooks-test') return;
  const isOfficer =
    msg.member.roles.highest.name === 'Admin' || msg.member.roles.highest.name === 'Officer' || msg.member.roles.highest.name === 'The One True GM';

  const { command, args } = getCommandFromMessage(msg);

  switch (command) {
    case 'awesome':
    case 'lame':
      showGMMessage(msg, command);
      break;
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
    case 'vote':
      if (!args[0]) return;
      castVote(msg, args[0]);
      break;
    case 'balance':
      checkBalance(msg);
      break;
    case 'joined':
      checkJoinedDate(msg);
      break;
    default:
      channel.send(`${command} not found.`);
      break;
  }
}

module.exports = Router;
