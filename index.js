const Discord = require('discord.js');
const { token } = require('./config.json');
const Router = require('./modules/Router');

const client = new Discord.Client();

const handleMessage = async (msg) => {
  Router(client, msg);
};

//
const handleReady = () => {
  console.log(`Logged in as ${client.user.tag}!`);
  // Set the client user's presence
  client.user.setPresence({ activity: { name: '/help' }, status: 'idle' }).catch(console.error);
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
