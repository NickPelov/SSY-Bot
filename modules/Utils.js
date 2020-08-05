let client;

const initUtilGlobals = (clnt) => {
  client = clnt;
};

function getCommandFromMessage(msg) {
  const { content } = msg;
  let endOfCommand = content.indexOf(' ') + 1;
  if (endOfCommand < 1) endOfCommand = content.length;
  const args = msg.content.trim().split(/ +/g);
  const command = args.shift().toLowerCase().slice(1);
  return { command, args };
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

function millisToMinutesAndSeconds(millis) {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function debounce(func, wait, immediate) {
  let timeout;
  return () => {
    const context = this;
    const args = arguments;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

const getEmoji = (name) => {
  if (!client) return undefined;

  const emoji = client.emojis.cache.find((e) => e.name === name);
  return emoji;
};

module.exports = {
  getCommandFromMessage,
  getGuildMemberFromUser,
  kickUserFromGuild,
  debounce,
  millisToMinutesAndSeconds,
  getEmoji,
  initUtilGlobals,
};
