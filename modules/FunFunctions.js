function showGMMessage(msg, command) {
  if (command === 'awesome') {
    msg.channel.send('#IStandWithMyBear');
  }
  if (command === 'lame') {
    msg.channel.send('#NotMyGM');
  }
}

module.exports = {
  showGMMessage,
};
