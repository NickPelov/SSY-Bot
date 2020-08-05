const fs = require('fs');
const fetch = require('node-fetch');
const { RichEmbed } = require('discord.js');
const { millisToMinutesAndSeconds } = require('../modules/Utils');

let currentReport = 'J4QP3caWjMw1dpVF';
let currentFight = 0;
let currentData = 'New File Contents';
let jsonData = require('../currentFight.json');

const difficulties = {
  3: 'NORMAL',
  4: 'HEROIC',
  5: 'MYTHIC',
};
const playersRecord = new Map();
function associateCharacterWithMember(msg, character, discordUser) {
  const user = discordUser || msg.author;

  const members = msg.guild.members.clone();
  const member = members.find((item) => item.user.username.indexOf(user.username) > -1);
  playersRecord.set(character, member);
  msg.reply(`${member} was associated with character: ${character}`);
}

function getResource(url, callback) {
  return fetch(url)
    .then((response) => {
      if (response.status !== 200) {
        console.error(`Wipefest:Looks like there was a problem. Status Code: ${response.status} & ${response.statusText}`);
        return undefined;
      }
      return response.json();
    })
    .then((data) => callback(data))
    .catch((err) => {
      console.error('Fetch Error :-S', err);
    });
}

function filterJSON() {
  currentData = fs.readFileSync('currentFight.json', 'utf-8');
  currentData = currentData.replace(/{(\[.+?\])|(?<={(\[.+?\]).*)}/g, '');

  fs.writeFileSync('currentFight.json', currentData, 'utf-8');
}

function getFight(fight) {
  return getResource(`https://api.wipefest.net/report/${currentReport}/fight/${fight}`, (result) => {
    if (result) {
      jsonData = result;
      fs.writeFileSync('currentFight.json', JSON.stringify(result, null, 4), (err) => {
        if (err) console.error(err);
      });
      filterJSON();
    }
  });
}

function getAbilityID(issue) {
  const { id, group } = issue;
  const { insightConfigs } = jsonData;
  const insightConfig = insightConfigs.find((item) => item.group === group && item.id === id);

  const { titleWhenNoEvents, tip } = insightConfig;
  const stringToParse = titleWhenNoEvents || tip;

  if (!stringToParse) return 42;
  const idStartIndex = stringToParse.indexOf('ability:') + 8;
  const idEndIndex = stringToParse.indexOf(':', idStartIndex);
  const abilityId = stringToParse.slice(idStartIndex, idEndIndex);

  return abilityId;
}

function getFightFromURL(url = 'https://www.warcraftlogs.com/reports/J4QP3caWjMw1dpVF#type=healing&fight=1') {
  // const url = 'https://www.warcraftlogs.com/reports/J4QP3caWjMw1dpVF#type=healing&fight=1';

  const startOfID = url.indexOf('reports/') + 8;
  const endOfID = url.indexOf('#');
  const startOfFight = url.indexOf('fight') + 6;
  const endOfFight = url.length;

  currentFight = url.slice(startOfFight, endOfFight);
  currentReport = url.slice(startOfID, endOfID);
  getFight(currentFight);
}

function wipeFestNext() {
  currentFight += 1;
  getFight(currentFight);
}

function getStatsPerPlayer() {
  const players = new Map();
  const { raid, insights, insightConfigs } = jsonData;
  raid.players.map((raider) => {
    const player = { name: raider.name };

    player.issues = [];
    insights.map((insight) => {
      if (insight.details && insight.interval.unit === 'EntireFight') {
        const playerIndexInInsight = insight.details.indexOf(raider.name);
        const endOfNote = insight.details.indexOf(',', playerIndexInInsight);
        if (playerIndexInInsight > -1 && insight.major) {
          const insightConfig = insightConfigs.find((item) => item.group === insight.group && item.id === insight.id);
          const note = insight.details.slice(playerIndexInInsight, endOfNote);
          player.issues.push({
            id: insight.id,
            group: insight.group,
            title: insightConfig.name,
            tip: insight.tip,
            details: note,
            major: insight.major,
          });
        }
      }
      return undefined;
    });
    players.set(raider.name, player);
    return player;
  });
  return players;
}

function checkRaiderExistsInGuild(msg, advice) {
  const members = msg.guild.members.clone();
  const raiders = new Map();
  advice.forEach((player, key) => {
    const { name } = player;
    raiders.set(
      key,
      members.find(
        (item) =>
          (item.nickname && item.nickname.toLowerCase().indexOf(name.toLowerCase()) > -1) ||
          item.user.username.toLowerCase().indexOf(name.toLowerCase()) > -1
      )
    );
  });
  raiders.forEach((raider, key) => {
    if (!raider) {
      raiders.set(key, playersRecord.get(key));
      console.log(key);
      console.log(playersRecord.get(key));
    }
  });
  raiders.forEach((raider, key) => {
    if (!raider) msg.channel.send(`${key} doesn't have a nickname setup on discord or it doesn't match his in game name!`);
  });
  return raiders;
}

function sendAdviceToPlayers(msg, advice, raiders) {
  raiders.forEach((raider, key) => {
    if (raider) {
      if (raider.user.username === 'MoRfeR') {
        // eslint-disable-next-line
        const { end_time, start_time, difficulty, name, kill } = jsonData.info;
        // eslint-disable-next-line
        const duration = millisToMinutesAndSeconds(end_time - start_time);
        const headline = `**${difficulties[difficulty]} ${name.toUpperCase()} ${kill ? 'KILL' : 'WIPE'} | ${duration}**`;
        const { issues } = advice.get(key);

        if (issues[0]) {
          const embed = new RichEmbed()
            .setColor(0xff0000)
            .setTitle(':robot: I checked your last logs!')
            .setDescription('Here is what you should improve for the next pull:');
          issues.forEach((issue) => {
            const { title, details } = issue;
            embed.addField(`\`\`\`${title}:\`\`\``, `Number of hits: ${details} :x:\n http://wowhead.com/spell=${getAbilityID(issues[0])}`);
          });

          raider.user.send(headline, embed);
        } else {
          const embed = new RichEmbed()
            .setColor(0x00ff00)
            .setTitle('Great Job!')
            .setDescription("I scanned the logs and it seems like you didn't make any major mistakes! Keep it UP");

          raider.user.send(headline, embed);
        }
      }
    }
  });
  msg.channel.send('Advice sent!Could not send advice to people listed above please set their nicknames and try again.');
}

module.exports = {
  getFight,
  getFightFromURL,
  wipeFestNext,
  getStatsPerPlayer,
  checkRaiderExistsInGuild,
  sendAdviceToPlayers,
  associateCharacterWithMember,
};
