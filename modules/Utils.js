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

function kickUserFromGuild(msg, user, reason) {
  if (user) {
    // Now we get the member from the user
    const member = getGuildMemberFromUser(user);
    // If the member is in the guild
    if (member) {
      member
        .kick(reason)
        .then(() => {
          // We let the message author know we were able to kick the person
          msg.reply(`Successfully kicked ${user.tag}`);
        })
        .catch((err) => {
          // This is generally due to the bot not being able to kick the member,
          // either due to missing permissions or role hierarchy
          msg.reply('I was unable to kick the member');
          console.error(err);
        });
    } else {
      // The mentioned user isn't in this guild
      msg.reply("That user isn't in this guild!");
    }
  }
}
module.exports = {
  getCommandFromMessage,
  getGuildMemberFromUser,
  kickUserFromGuild,
};
