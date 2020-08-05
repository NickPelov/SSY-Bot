// Implement /help functionality
const { MessageEmbed } = require('discord.js');
const { prefix } = require('../config.json');

function getHelpEmbed(avatar) {
  const embed = new MessageEmbed({
    title: '```Information```',
    description: 'Help information for the Stop Silencing Yourself Bot\n\n',
    color: 10534650,
    type: 'rich',
    fields: [
      {
        name: `\` ${prefix}awesome\``,
        value: 'Only for awesome people!',
      },
      {
        name: `\` ${prefix}lame\``,
        value: 'Only for lame people!',
      },
      {
        name: `\` ${prefix}start-vote "Your question goes here" option1 option2 etc.\``,
        value:
          'Starts a 1 min vote for the question you specify with the options you specify. Pay attention that the question must be warpped in "" ',
      },
      {
        name: `\` ${prefix}help\``,
        value: 'Sends this message',
      },
      {
        name: `\` ${prefix}balance\``,
        value: 'Checks how much Good boy points you have',
      },
      {
        name: `\` ${prefix}joined\``,
        value: 'Shows when you joined the server',
      },
      {
        name: `\` ${prefix}purge <X>\``,
        value: '(**Officer Only**) Deletes the last X messages from the channel you send it to.',
      },
    ],
  }).setThumbnail(avatar);
  return embed;
}

module.exports = {
  getHelpEmbed,
};
