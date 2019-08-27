let voters = [];
let dad;
function showGMMessage(msg, command) {
  if (command === 'awesome') {
    msg.channel.send('#IStandWithMyBear');
  }
  if (command === 'lame') {
    msg.channel.send('#NotMyGM');
  }
}

function castVoteForDad(msg) {
  const required = 5;
  if (voters.includes(msg.author)) return required - voters.length;
  voters.push(msg.author);

  if (!dad) dad = msg.guild.members.find(item => item.user.username.indexOf('altyx') > -1);
  if (voters.length >= required) {
    msg.channel.send(`Thanks for being our dad ${dad}. From all of us ${voters[0]} ${voters[1]} ${voters[2]} ${voters[3]} ${voters[4]}`);
    voters = [];
  } else {
    return required - voters.length;
  }
}

function getRandomRaider(msg) {
  const raiders = msg.guild.roles.find(role => role.name === 'Raider').members;
  const keys = Array.from(raiders.keys());
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  const raider = raiders.get(randomKey);
  return raider;
}
module.exports = {
  showGMMessage,
  castVoteForDad,
  getRandomRaider,
};
