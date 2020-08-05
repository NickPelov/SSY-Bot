const admin = require('firebase-admin');
const { getEmoji } = require('./Utils');

const addPoints = (msg, args) => {
  const db = admin.firestore();

  const user = msg.mentions.users.first(1)[0];
  const points = args[0];
  const parsedPoints = parseInt(points, 10);

  if (!user) {
    msg.reply('you dumb ass. You have to tag a person...');
    return;
  }
  if (isNaN(parsedPoints)) {
    msg.reply('you need to ping the person and mention the points straight after');
    return;
  }

  const userId = user.id;

  db.collection('users')
    .doc(userId)
    .set(
      {
        username: user.username,
        discriminator: user.discriminator,
        avatar: user.avatar,
        bot: user.bot,
        points: admin.firestore.FieldValue.increment(parsedPoints),
      },
      { merge: true }
    );
};

const checkBalance = (msg) => {
  const db = admin.firestore();
  const twainEmoji = getEmoji('twain');
  const whambulanceEmoji = getEmoji('whambulance');

  const userId = msg.member.id;

  db.collection('users')
    .doc(userId)
    .get()
    .then((userDoc) => {
      if (userDoc.exists) {
        const { points } = userDoc.data();

        switch (true) {
          case points > 100:
            msg.reply(`is a Trusted member. You have ${points} points ${twainEmoji}`);
            break;
          case points > 75:
            msg.reply(`You have ${points} points. Magnu very happy ${twainEmoji}`);
            break;
          case points > 50:
            msg.reply(`You have ${points} points. Very nice :) ${twainEmoji}`);
            break;
          case points > 25:
            msg.reply(`/pat good boy. You have ${points} points ${twainEmoji}`);
            break;
          case points > 0:
            msg.reply(`you are trying to be a good boy. You have ${points} points ${twainEmoji}`);
            break;
          case points === 0:
            msg.reply(`Get some points. You have ${points} points ${twainEmoji}`);
            break;
          case points < -100:
            msg.reply(`has been a little bitch and probably pissed off Markus. You have ${points} points ${whambulanceEmoji}`);
            break;
          case points < -75:
            msg.reply(`You have ${points} points. Magnus very mad at u ${whambulanceEmoji}`);
            break;
          case points < -50:
            msg.reply(`You have ${points} points. Very Bad boy :( ${whambulanceEmoji}`);
            break;
          case points < -25:
            msg.reply(`is a Bad boy get gud. You have ${points} points ${whambulanceEmoji}`);
            break;
          case points < 0:
            msg.reply(`you are trying to be a bad boy. You have ${points} points ${whambulanceEmoji}`);
            break;
          default:
            msg.reply('Get some points');
            break;
        }
      } else {
        msg.reply('you have 0 points.Get some points.');
      }
    });
};

module.exports = {
  addPoints,
  checkBalance,
};
