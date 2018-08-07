import { Command } from 'discord.js-commando';
import { Asset } from 'dsteem';
import { Mentor } from '../../models';

export default class TipCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'tip',
      group: 'workshop',
      memberName: 'tip',
      description: 'Generates tipping link to tip a mentor.',
      examples: ['tip MENTOR AMOUNT'],
      guildOnly: true,
      args: [
        {
          key: 'mentor',
          label: 'MENTOR',
          prompt: 'Please tag a mentor.',
          type: 'member',
        },
        {
          key: 'amount',
          label: 'AMOUNT',
          prompt: 'Please the tip amount.',
          type: 'string',
          validate: (price) => {
            const [amount, symbol] = price.split(' ');

            if (Number.isNaN(parseFloat(amount))) {
              return false;
            }
            if (symbol === undefined) {
              return false;
            }

            const currency = symbol.trim().toUpperCase();

            if (currency !== 'SBD') {
              return false;
            }
            return true;
          },
          parse: price => Asset.fromString(price.toUpperCase()),
        },
      ],
      argsPromptLimit: 0,
    });
  }

  async run(message, { mentor, amount }) {
    const receiver = await Mentor.findOne({ discordId: mentor.user.id });

    if (receiver) {
      const link = `https://steemconnect.com/sign/transfer?to=${receiver.username}&amount=${encodeURIComponent(amount)}&memo=TIP!`;

      message.reply(`To tip the mentor please click this ${link} to complete the transaction via SteemConnect.`);
    } else {
      message.reply('I was not able to find the mentor.');
    }
  }
}
