// Implement /help functionality
const { MessageEmbed } = require('discord.js');
const { prefix } = require('../config.json');

function getHelpEmbed(avatar) {
  const embed = new MessageEmbed({
    title: 'Help information about the Not Great Not Terrible BOT',
    description: 'List of commands usable with the NGNT discord bot',
    url: 'https://raider.io/guilds/eu/sylvanas/Not%20Great%20Not%20Terrible',
    color: 5537495,
    timestamp: Date.now(),
    footer: {
      text: 'NGNT',
    },
    thumbnail: {
      url:
        'https://firebasestorage.googleapis.com/v0/b/notgreatnotterrible-a72cd.appspot.com/o/images%2FWoW_icon.png?alt=media&token=5f266307-baca-4b45-a835-a1e8b3871390',
    },
    image: {
      url:
        'https://firebasestorage.googleapis.com/v0/b/notgreatnotterrible-a72cd.appspot.com/o/images%2F1581682443651.jpg?alt=media&token=cb13b0b2-c7d7-48c0-b928-70c9308a9d2a',
    },
    author: {
      name: 'Not Great Not Terrible',
      url: 'https://raider.io/guilds/eu/sylvanas/Not%20Great%20Not%20Terrible',
      icon_url:
        'https://firebasestorage.googleapis.com/v0/b/notgreatnotterrible-a72cd.appspot.com/o/images%2F20200107_165913.png?alt=media&token=36273d41-ac34-4754-8b0d-18af16100c9f',
    },
    fields: [
      {
        name: '/awesome',
        value: 'Only for awesome people!',
      },
      {
        name: '/lame',
        value: 'Only for lame people!',
      },
      {
        name: '/start-vote "Your question goes here" option1 option2 etc.',
        value: 'Starts a 1 min vote for the question you specify with the options you specify. Pay attention that the question must be warpped in ""',
      },
      {
        name: '/help',
        value: 'Sends this message',
      },
      {
        name: '/balance',
        value: 'Checks how much Good boy points you have',
      },
      {
        name: '/joined',
        value: 'Shows when you joined the server',
      },
      {
        name: '/purge <X>',
        value: '**(Officer Only)** Deletes the last X messages from the channel you send it to.',
      },
    ],
  });

  return embed;
}

module.exports = {
  getHelpEmbed,
};
