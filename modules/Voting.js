const { MessageEmbed } = require('discord.js');

const votes = [];
let inProgress = false;

function parseData(args) {
  const result = {};
  const content = args.join(' ');
  console.log(args);
  const startData = content.indexOf('"') + 1;
  const endData = content.indexOf('"', startData);

  if (startData < 1 || endData < 2) {
    result.body = `Incorrect format.${startData}${endData}`;
    result.error = true;
  } else {
    result.body = content.slice(startData, endData);
    result.options = content
      .slice(endData + 1, content.length)
      .trim()
      .split(' ');
  }

  return result;
}

function countVotes(options) {
  const results = {};
  const embed = new MessageEmbed();
  options.forEach((option, index) => {
    if (!results[option]) results[option] = 0;
    votes.forEach((vote) => {
      if (index + 1 == vote) {
        results[option] += 1;
      }
    });
    embed.addField(option, results[option]);
  });
  return embed;
}

function startModel(msg, args) {
  const { author, channel } = msg;

  if (!inProgress) {
    const result = parseData(args);
    if (!result.error) {
      const embed = new MessageEmbed();
      result.options.forEach((option, index) => embed.addField(`${index + 1}. ${option}`, `Vote with /vote ${index + 1}`)); // or /vote ${option}
      embed.setDescription('====================================');
      embed.setTitle(`Vote started: ${result.body}`);
      embed.setColor(10534650);
      embed.setAuthor(author.username, author.avatarURL);
      channel.send(embed);
      inProgress = true;
      setTimeout(() => {
        channel.send('Vote has ended!');
        inProgress = false;
        channel.send(countVotes(result.options));
      }, 60000);
    } else {
      channel.send(result.body);
    }
  } else {
    channel.send('Another vote is already in progress.');
  }
}

function castVote(msg, vote) {
  if (!inProgress) {
    msg.reply('A vote is not currently in progress.');
  } else {
    votes.push(vote);
    msg.reply(`Registered vote for option: ${vote}`);
  }
}

module.exports = {
  startModel,
  castVote,
};
