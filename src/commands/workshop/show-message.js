import { Command } from 'discord.js-commando';
import { stripIndents } from 'common-tags';
import { Mentor } from '../../models';
import config from '../../config';

export default class ShowMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'show-message',
      group: 'workshop',
      memberName: 'show-message',
      aliases: ['show'],
      description: 'Sends a predefined message.',
      examples: ['show-message closing'],
      guildOnly: true,
      args: [
        {
          key: 'type',
          label: 'TYPE',
          prompt: 'Please specify a type.',
          type: 'string',
        },
      ],
      argsPromptLimit: 0,
    });
  }

  hasPermission(message) {
    if (!message.member.roles.some(role => config.MENTOR_ROLE.includes(role.name))) {
      return 'you do not have required permission to use this command!';
    }
    return true;
  }

  async run(message, { type }) {
    const mentor = await Mentor.findOne({ discordId: message.author.id });

    switch (type) {
      case 'closing':
        message.delete();
        message.channel.send(stripIndents`
          *This workshop will be closed in a few minutes.*

          **Support this mentor by sending a tip!** All of the mentors work in their own time to spread their knowledge and are not paid by anyone directly.

          You can quickly send a tip to this mentor by using one the Steem Connect links below and fill in the password of your Steem account.
          0.1 SBD: https://steemconnect.com/sign/transfer?to=${mentor.username}&amount=${encodeURIComponent('0.10 SBD')}&memo=TIP!
          0.5 SBD: https://steemconnect.com/sign/transfer?to=${mentor.username}&amount=${encodeURIComponent('0.50 SBD')}&memo=TIP!
          1 SBD: https://steemconnect.com/sign/transfer?to=${mentor.username}&amount=${encodeURIComponent('1.00 SBD')}&memo=TIP!
          5 SBD: https://steemconnect.com/sign/transfer?to=${mentor.username}&amount=${encodeURIComponent('5.00 SBD')}&memo=TIP!

          *If you wish to send a different amount or use your Steemit account, you can send the tip to @${mentor.username}.*
        `);
        break;

      default:

        break;
    }
  }
}
