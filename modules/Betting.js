const numeral = require('numeral');
const { RichEmbed } = require('discord.js');
const fs = require('fs');

let isStarted = false;
let canRegister = false;
const bets = [];
let registered = [];
let maxRoll;
let timeout;

function updateBettingHistory(winnerBet, loserBet) {
  // const currentData = fs.readFileSync('currentFight.json', 'utf-8');
  const json = fs.readFileSync('bettingHistory.json', 'utf-8');
  const data = JSON.parse(json);
  const winnerIndex = data.findIndex(player => player.name === winnerBet.participant);
  const loserIndex = data.findIndex(player => player.name === loserBet.participant);
  if (winnerIndex > -1) {
    data[winnerIndex].amount += winnerBet.amount - loserBet.amount;
  } else {
    data.push({ name: winnerBet.participant, amount: winnerBet.amount - loserBet.amount });
  }
  if (loserIndex > -1) {
    data[loserIndex].amount += loserBet.amount - winnerBet.amount;
  } else {
    data.push({ name: loserBet.participant, amount: loserBet.amount - winnerBet.amount });
  }

  data.sort((a, b) => {
    if (a.amount > b.amount) {
      return -1;
    }
    if (a.amount < b.amount) {
      return 1;
    }
    return 0;
  });

  const newData = JSON.stringify(data);
  fs.writeFileSync('bettingHistory.json', newData, 'utf-8');
}

function isValidRoll(msg) {
  if (registered.findIndex(participant => participant === msg.author.username) === -1) return false;
  if (bets.findIndex(bet => bet.author === msg.author.username) > -1) return false;
  return true;
}

function checkAllRolls(msg) {
  if (registered.length !== bets.length) return;
  const winnerBet = bets.reduce((accumulator, currentValue) => (currentValue.amount > accumulator.amount || 0 ? currentValue : accumulator));
  const loserBet = bets.reduce((accumulator, currentValue) => (currentValue.amount < accumulator.amount || 0 ? currentValue : accumulator));
  msg.channel.send('========================');
  const difference = numeral(winnerBet.amount - loserBet.amount).format('0,0');
  msg.channel.send(`${loserBet.participant} owes ${winnerBet.participant} ${difference} gold in game!`);
  updateBettingHistory(winnerBet, loserBet);
  isStarted = false;
}

function startBet(msg, amount) {
  if (!amount) {
    msg.channel.send('Please specify and amount.');
    return;
  }
  maxRoll = amount;
  const formatedAmount = numeral(amount).format('0,0');

  if (!isStarted) {
    isStarted = true;
    canRegister = true;
    msg.channel.send(
      `Welcome to Gambling Addicts Pitfall: User's Roll - ${formatedAmount} - Type /join to Join (/leave to withdraw). ***You have 10 sec to enter!***`,
    );
    const embed = new RichEmbed().setTitle('**Roll now! (/roll)**').setColor(0x00ff00);

    timeout = setTimeout(() => {
      if (registered.length < 2) {
        msg.channel.send('Not enough people registered. Canceling event!');
        canRegister = false;
        isStarted = false;
      } else {
        msg.channel.send(embed);
        canRegister = false;
        msg.channel.send('========================');
      }
    }, 10000);
  } else {
    msg.channel.send('A roll is already in progress! Type /join to enter.');
  }
}

function registerForBet(msg, optout) {
  const participant = msg.author.username;
  if (!isStarted || !canRegister) return;
  if (optout) {
    registered = registered.filter(user => participant !== user);
  } else {
    if (registered.includes(participant)) return;
    registered.push(participant);
    clearTimeout(timeout);
    const embed = new RichEmbed().setTitle('**Roll now! (/roll)**').setColor(0x00ff00);
    timeout = setTimeout(() => {
      if (registered.length < 1) {
        msg.channel.send('Not enough people registered. Canceling event!');
        canRegister = false;
        isStarted = false;
      } else {
        msg.channel.send(embed);
        canRegister = false;
        msg.channel.send('========================');
      }
    }, 10000);
  }
}

function roll(msg) {
  if (!isStarted) return;
  if (!isValidRoll(msg)) return;
  const bet = {
    participant: msg.author.username,
    amount: Math.floor(Math.random() * Math.floor(maxRoll)),
  };
  bets.push(bet);
  msg.reply(`Rolled ${bet.amount}`);
  msg.delete();
  checkAllRolls(msg);
}

function reportHistory(msg) {
  const json = fs.readFileSync('bettingHistory.json', 'utf-8');
  const data = JSON.parse(json);
  let message = 'List of players: \n';
  data.forEach((player) => {
    const formatedAmount = numeral(player.amount).format('0,0');
    if (player.amount > 0) {
      message += `${player.name} is ${formatedAmount} gold ahead! \n`;
    }
    if (player.amount < 0) {
      message += `${player.name} has lost ${formatedAmount} gold! \n`;
    }
    if (player.amount === 0) {
      message += `${player.name} has lost ${formatedAmount} gold. How?!? \n`;
    }
  });
  msg.channel.send(message);
}
module.exports = {
  startBet,
  registerForBet,
  roll,
  reportHistory,
  updateBettingHistory,
};
