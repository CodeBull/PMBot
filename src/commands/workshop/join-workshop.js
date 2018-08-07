import { Command } from 'discord.js-commando';
import { Workshop, Transaction } from '../../models';
import config from '../../config';

export default class JoinWorkshopCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'join-workshop',
      group: 'workshop',
      memberName: 'join-workshop',
      aliases: ['join'],
      description: 'Generates payment link for subscribing to a workshop.',
      examples: ['join-workshop 1111'],
      guildOnly: true,
      args: [
        {
          key: 'id',
          label: 'WORKSHOP ID',
          prompt: 'Please enter the ID of the workshop.',
          type: 'integer',
          parse: value => value.trim(),
        },
      ],
      argsPromptLimit: 0,
    });
  }

  async run(message, { id }) {
    const workshop = await Workshop.findOne({ workshopId: id });

    if (workshop) {
      const memo = `${workshop.workshopId}-${Math.round((new Date()).getTime() / 1000)}`;
      const link = `https://steemconnect.com/sign/transfer?to=${config.STEEM_ACCOUNT}&amount=${encodeURIComponent(workshop.price)}&memo=${memo}`;

      await Transaction.create({
        discordId: message.author.id,
        workshop,
        amount: workshop.price,
        memo,
      })
        .then(() => {
          message.reply(`To subscribe to next session of **${workshop.name}**, please pay ${workshop.price} by clicking ${link} via SteemConnect or transfer to \`${config.STEEM_ACCOUNT}\` with \`${memo}\` as memo from your steem account.\n\nTo check if your registration has been verified type \`${config.COMMAND_PREFIX}vp ${memo}\`.`);
        })
        .catch(e => console.log(e));
    } else {
      message.reply('I was not able to find the Workshop you are looking for. Please ensure that you have entered the correct ID.');
    }
  }
}
