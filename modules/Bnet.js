const fetch = require('node-fetch');
const { RichEmbed } = require('discord.js');
const { bnetSecret, bnetClientID } = require('../config.json');
const { classes } = require('../assets/classes.json');
const { races } = require('../assets/races.json');

// Set the configuration settings
const credentials = {
  client: {
    id: bnetClientID,
    secret: bnetSecret,
  },
  auth: {
    tokenHost: 'https://eu.battle.net/',
  },
};

// Initialize the OAuth2 Library
const oauth2 = require('simple-oauth2').create(credentials);

let accessToken;

async function getBnetAccessToken() {
  try {
    const result = await oauth2.clientCredentials.getToken({});
    accessToken = oauth2.accessToken.create(result);
  } catch (error) {
    console.error('Access Token error', error.message);
  }
}

/*
    Used to create the URLs for you. Simply pass in the end point you want to GET.
    Examples:
        /data/wow/token/index
        /data/wow/region/{regionId}
        /data/wow/power-type/{powerTypeId}
        /data/wow/mythic-keystone/index
*/
function constructURL(endPoint, parameters) {
  return `https://eu.api.blizzard.com${endPoint}${parameters || '?'}namespace=dynamic-eu&locale=en_GB&access_token=${accessToken.token.access_token}`;
}

/*
  Checks if the current token is expired. If the token has expired it refreshes the token.
  Call this at the start of every function here. To guarantee you never try to use an old token.
*/
async function checkTokenStatus() {
  if (accessToken.expired()) {
    try {
      accessToken = await accessToken.refresh();
    } catch (error) {
      console.error('Error refreshing access token: ', error.message);
    }
  }
}

function getResource(url, parameters, callback) {
  return fetch(constructURL(url, parameters))
    .then((response) => {
      if (response.status !== 200) {
        console.error(`Bnet:Looks like there was a problem. Status Code: ${response.status} & ${response.statusText}`);
        return response.status;
      }
      return response.json();
    })
    .then(data => callback(data))
    .catch((err) => {
      console.error('Fetch Error :-S', err);
    });
}

function parseCharacter(player) {
  let realm;
  let character;
  if (player.indexOf('-') < 0) {
    realm = 'Sylvanas';
    character = player.substring(0, player.length);
  } else {
    realm = player.indexOf('-') < 0 ? 'Sylvanas' : player.substring(player.indexOf('-') + 1);
    character = player.substring(0, player.indexOf('-'));
  }
  return { realm, character };
}

function getTokenPrice() {
  checkTokenStatus();
  return getResource('/data/wow/token/index', (data) => {
    let { price } = data;
    price = price
      .toString()
      .slice(0, -4)
      .replace(/\d{3}(?=(\d{3}))/g, '$&,');
    return `The price of a token on EU servers is: ***${price}*** gold`;
  });
}

function getPlayerProgress(player) {
  const { realm, character } = parseCharacter(player);
  const relevantRaids = []; // Requires 0 or 2 entries, anything else will throw an error
  return getResource(`/wow/character/${realm}/${character}`, '?fields=progression&', (data) => {
    if (data === 404) {
      return 'Could not find character.';
    }

    const { progression } = data;
    const { raids } = progression;
    const result = [];
    if (relevantRaids[0]) {
      relevantRaids.forEach((relevant) => {
        result.push(raids.find(raid => raid.name === relevant));
      });
    } else {
      result.push(raids[raids.length - 1]);
      result.push(raids[raids.length - 2]);
    }
    return result;
  });
}

function getPlayerInfo(player) {
  const { realm, character } = parseCharacter(player);
  return getResource(`/wow/character/${realm}/${character}`, '?fields=items&', async (data) => {
    if (data === 404) {
      return 'Could not find character.';
    }

    const {
      name, race, gender, level, thumbnail, items,
    } = data;
    const image = `http://render-eu.worldofwarcraft.com/character/${thumbnail}`;

    const charRace = races.find(r => r.id === race);

    const charClass = classes.find(c => c.id === data.class);
    const progression = await getPlayerProgress(player);
    return new RichEmbed({
      title: `***${name}-${data.realm}***`,
      description: `${level} ${gender === 0 ? 'Male' : 'Female'} ${charRace.name} ${charClass.name}`,
      color: parseInt(charClass.color, 16),
      fields: [
        {
          name: 'Equipped ilvl:',
          value: items.averageItemLevelEquipped,
        },
        {
          name: 'Top gear ilvl:',
          value: items.averageItemLevel,
        },
        {
          name: `Progress in ${progression[0].name}`,
          value: `Mythic: ${progression[0].bosses.filter(boss => boss.mythicKills !== 0).length}/${progression[0].bosses.length}\nHeroic: ${
            progression[0].bosses.filter(boss => boss.heroicKills !== 0).length
          }/${progression[0].bosses.length} `,
        },
        {
          name: `Progress in ${progression[1].name}`,
          value: `Mythic: ${progression[1].bosses.filter(boss => boss.mythicKills !== 0).length}/${progression[1].bosses.length}\nHeroic: ${
            progression[1].bosses.filter(boss => boss.heroicKills !== 0).length
          }/${progression[1].bosses.length} `,
        },
        {
          name: 'Raider.IO',
          value: `https://raider.io/characters/eu/${realm}/${character} `,
        },
        {
          name: 'Warcraft Logs:',
          value: `https://www.warcraftlogs.com/character/eu/${realm}/${character} `,
        },
        {
          name: 'Armory',
          value: `https://www.worldofwarcraft.com/en-gb/character/${realm}/${character} `,
        },
      ],
    }).setThumbnail(image);
  });
}

function getRealmStatus(realm) {
  return getResource('/wow/realm/status', (data) => {
    const result = data.realms.find(r => r.name.toLowerCase() === realm.toLowerCase());
    let status;
    let color;
    if (result.status) {
      status = 'online';
      color = 0x1b9601;
    } else {
      status = 'offline';
      color = 0xff0000;
    }
    return new RichEmbed()
      .setColor(color)
      .setTitle(`Realm Status - ${result.name}`)
      .addField('STATUS: ', status)
      .addField('POPULATION: ', result.population)
      .addField('QUEUE:', result.queue ? 'Has a queue' : 'No queue');
  });
}

module.exports = {
  getTokenPrice,
  getBnetAccessToken,
  getPlayerInfo,
  getRealmStatus,
};
