const checkJoinedDate = (msg) => {
  const { joinedTimestamp } = msg.member;

  const today = Date.now();

  const todayString = new Date(joinedTimestamp).toUTCString();

  const numberOfDays = Math.round((today - joinedTimestamp) / (1000 * 60 * 60 * 24));

  msg.reply(`you have been a member of this server since: ${todayString}. Which is ${numberOfDays} days!`);
};

module.exports = {
  checkJoinedDate,
};
