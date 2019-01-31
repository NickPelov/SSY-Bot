const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();

// function getMember(name, msg) {
//   const guildMember = msg.guild.members.filter(
//     m => m.user.username.toLowerCase() === name.toLowerCase(),
//   );
//   const member = guildMember.values().next().value;
//   return member;
// }

const handleMessage = (msg) => {
  const { author, content, channel } = msg;

  if (!msg.guild) return;

  if (!content.startsWith(prefix)) return; // Not a message for our BOT, ignore it

  console.log(msg);
  console.log(author);
  console.log(channel);
};

const handleReady = () => {
  console.log(`Logged in as ${client.user.tag}!`);
  // Set the client user's presence
  client.user
    .setPresence({ game: { name: `${prefix}help` }, status: 'idle' })
    .then(console.log)
    .catch(console.error);
};

client.on('ready', handleReady);
client.on('message', handleMessage);

client.login(token);
