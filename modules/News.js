const fetch = require('node-fetch');
const parser = require('xml2json');

function getLatestNews(msg) {
  const url =    'https://www.mmo-champion.com/external.php?do=rss&type=newcontent&sectionid=1&days=120&count=1';

  return fetch(url)
    .then(response => response.text())
    .then((content) => {
      const json = parser.toJson(content);
      const result = JSON.parse(json);
      return result.rss.channel.item.link;
    });
}

module.exports = {
  getLatestNews,
};
