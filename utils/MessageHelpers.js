function getCommandFromMessage(msg) {
  const { content } = msg;
  let endOfCommand = content.indexOf(' ') + 1;
  if (endOfCommand < 1) endOfCommand = content.length;
  const command = content.slice(1, endOfCommand);
  return command;
}

function getGuildMemberFromUser(user) {
  const guildMemeber = user.lastMessage.member;
  return guildMemeber;
}

module.exports = {
  getCommandFromMessage,
  getGuildMemberFromUser,
};
