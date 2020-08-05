const Discord = require('discord.js');
const admin = require('firebase-admin');
const serviceAccount = require('./.serviceAccounts/production.json');
const { token } = require('./config.json');
const Router = require('./modules/Router');
const { initUtilGlobals } = require('./modules/Utils');

const client = new Discord.Client();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const handleMessage = async (msg) => {
  Router(client, msg);
};

//
const handleReady = () => {
  console.log(`Logged in as ${client.user.tag}!`);
  // Set the client user's presence
  client.user.setPresence({ activity: { name: '/help' }, status: 'idle' }).catch(console.error);
  initUtilGlobals(client);
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
