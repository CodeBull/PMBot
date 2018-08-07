import { Command } from 'discord.js-commando';
import { Client } from 'dsteem/lib';
import { Transaction } from '../../models';
import config from '../../config';

const dsteem = new Client('https://api.steemit.com');

export default class VerifyPaymentCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'verify-payment',
      group: 'workshop',
      memberName: 'verify-payment',
      aliases: ['vp'],
      description: 'Verifies payment for subscription.',
      examples: ['verify-payment 1111'],
      guildOnly: true,
      args: [
        {
          key: 'memo',
          label: 'MEMO',
          prompt: 'Please enter your transfer memo.',
          type: 'integer',
          parse: value => value.trim(),
        },
      ],
      argsPromptLimit: 0,
    });
  }

  async run(message, { memo }) {
    const transaction = await Transaction.findOne({ memo, discordId: message.author.id }).populate('workshop');

    if (transaction) {
      const history = await dsteem.database.call('get_account_history', [config.STEEM_ACCOUNT, -1, 100]);

      if (
        history.some(res => (
          res[1].op[0] === 'transfer'
          && res[1].op[1].to === config.STEEM_ACCOUNT
          && res[1].op[1].amount === transaction.amount
          && res[1].op[1].memo.trim() === transaction.memo))
      ) {
        // Giving workshop role
        const subscriberRole = message.guild.roles.find('name', `Workshop-${transaction.workshop.workshopId}`);
        if (subscriberRole) {
          message.member.addRole(subscriberRole);
        }

        // Updating transaction in the database
        transaction.verified = true;
        await transaction.save();

        message.reply(`Congratulations! Your subscription has been verified. Now, you'll have access to <#${transaction.workshop.channelId}> when the workshop starts.`);
      } else {
        message.reply('I was not able to verify the payment with that memo at this moment. If you think there is an error, please contact us.');
      }
    } else {
      message.reply('I was not able to find the transaction with that memo for you.');
    }
  }
}
