const fetch = require('node-fetch');
const { RichEmbed } = require('discord.js');

const logoMMO = 'https://static.mmo-champion.com/images/tranquilizing/logo.png';

function getLatestNews() {
  const url = 'https://www.mmo-champion.com/external.php?do=rss&type=newcontent&sectionid=1&days=120&count=1';
  // const url = 'https://www.reddit.com/r/wow';
  return fetch(url)
    .then(response => response.text())
    .then((content) => {
      const json = parser.toJson(content);
      const result = JSON.parse(json);
      const { link, title, description } = result.rss.channel.item;
      const headline = description.slice(description.indexOf('<br />') + 6, description.indexOf('<br />', description.indexOf('<br />') + 1));
      return new RichEmbed({
        title,
        url: link,
        color: 0x6c963e,
        fields: [{ name: 'Read More:', value: link }],
        description: headline,
      }).setThumbnail(logoMMO);
    });
}

module.exports = {
  getLatestNews,
};
