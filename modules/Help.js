// Implement /help functionality
const { RichEmbed } = require('discord.js');
const { prefix } = require('../config.json');

function getHelpEmbed(avatar) {
  const embed = new RichEmbed({
    title: '```Information```',
    description: 'Help information for the Stop Silencing Yourself Bot\n\n',
    color: 10534650,
    fields: [
      {
        name: `\` ${prefix}latest-news \``,
        value: 'Returns the latest post from MMO-Champion',
      },
      {
        name: `\` ${prefix}token\``,
        value: 'Outputs the current price of a wow token.',
      },
      {
        name: `\` ${prefix}realm <Realm Name> \``,
        value: 'Information about the current status of the selected realm. (/realm Sylvanas)',
      },
      {
        name: `\` ${prefix}lookup <Character Name-Realm Name>\``,
        value: 'Information about a given character. (/lookup Howtoheal-Sylvanas)',
      },
      {
        name: `\` ${prefix}awesome\``,
        value: 'Only for awesome people!',
      },
      {
        name: `\` ${prefix}lame\``,
        value: 'Only for lame people!',
      },
      {
        name: `\` ${prefix}help\``,
        value: 'Sends this message',
      },
      {
        name: `\` ${prefix}purge <X>\``,
        value: '(**Officer Only**) Deletes the last X messages from the channel you send it to.',
      },
      {
        name: `\` ${prefix}load-logs <warcraft logs link>\``,
        value: '(**Officer Only**) Load a url as the current log you want to get advice on.',
      },
      {
        name: `\` ${prefix}advice\``,
        value: '(**Officer Only**) Send personalized advice to each member of the raid.',
      },
    ],
  }).setThumbnail(avatar);
  return embed;
}

module.exports = {
  getHelpEmbed,
};
