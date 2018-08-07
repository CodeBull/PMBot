import { Command } from 'discord.js-commando';
import { Workshop } from '../../models';
import config from '../../config';

export default class WorkshopCloseCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'close-workshop',
      group: 'workshop',
      memberName: 'close-workshop',
      aliases: ['close', 'closew'],
      description: 'Closes the workshop.',
      examples: ['close-workshop 1111'],
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

  hasPermission(message) {
    if (!message.member.roles.some(role => config.MENTOR_ROLE.includes(role.name))) {
      return 'you do not have required permission to use this command!';
    }
    return true;
  }

  async run(message, { id }) {
    const workshop = await Workshop.findOne({ workshopId: id }).populate('mentor');

    if (workshop) {
      const role = message.guild.roles.find('name', `Workshop-${workshop.workshopId}`);

      // Removing workshop role from the subscribers
      role.members.array().forEach((member) => {
        member.removeRole(role);
      });

      const channel = message.client.channels.find('id', workshop.channelId);

      // Locking channel for the workshop role
      channel.overwritePermissions(role, {
        VIEW_CHANNEL: false,
        SEND_MESSAGES: false,
        ATTACH_FILES: false,
        READ_MESSAGE_HISTORY: false,
        ADD_REACTIONS: false,
      })
        .then(() => {
          message.channel.send(`${role} **${workshop.name}** is now closed.`);
        })
        .catch(e => console.log(e));
    } else {
      message.reply('I was not able to find the Workshop you are looking for. Please ensure that you have entered the correct ID.');
    }
  }
}
