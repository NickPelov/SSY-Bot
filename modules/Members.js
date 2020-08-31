const admin = require('firebase-admin');

const checkJoinedDate = (msg) => {
  let joinedAt = msg.member.joinedTimestamp;

  const userId = msg.member.id;

  const db = admin.firestore();

  db.collection('users')
    .doc(userId)
    .get()
    .then((userDoc) => {
      if (userDoc.exists) {
        const fbJoined = userDoc.data().joinedAtTimestamp;

        if (fbJoined < joinedAt) {
          joinedAt = fbJoined;
        }
      }

      const today = Date.now();

      const todayString = new Date(joinedAt).toUTCString();

      const numberOfDays = Math.round((today - joinedAt) / (1000 * 60 * 60 * 24));

      msg.reply(`you have been a member of this server since: ${todayString}. Which is ${numberOfDays} days!`);
    });
};

module.exports = {
  checkJoinedDate,
};
