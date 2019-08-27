function sendRaidStartMessage(msg, time = 15, additional) {
  const raidChannel = msg.guild.channels.find(channel => channel.name === 'raid-chat');
  const raiderRole = msg.guild.roles.find(role => role.name === 'Raider');
  const trialRole = msg.guild.roles.find(role => role.name === 'Trial');
  let message = `${raiderRole} ${trialRole} Raid will start in ${time} minutes. Get your flasks, potions, food, tokens.`;
  if (additional) message += additional;
  if (time < 16) message += ' Invites have started! Log your mains';
  if (time > 30) message = `${raiderRole} ${trialRole} Raid invites will start in ${time - 15} minutes.`;
  raidChannel.send(message);
}

module.exports = {
  sendRaidStartMessage,
};
