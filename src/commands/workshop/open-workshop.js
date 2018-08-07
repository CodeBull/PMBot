import { Command } from 'discord.js-commando';
import { Workshop } from '../../models';
import config from '../../config';

export default class WorkshopOpenCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'open-workshop',
      group: 'workshop',
      memberName: 'open-workshop',
      aliases: ['open', 'openw'],
      description: 'Opens the workshop.',
      examples: ['open-workshop 1111'],
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
      const channel = message.client.channels.find('id', workshop.channelId);

      // Openning channel for the workshop role
      channel.overwritePermissions(role, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: true,
        ATTACH_FILES: true,
        READ_MESSAGE_HISTORY: true,
        ADD_REACTIONS: true,
      })
        .then(() => {
          message.channel.send(`${role} **${workshop.name}** is now open on ${channel}.`);
        })
        .catch(e => console.log(e));
    } else {
      message.reply('I was not able to find the Workshop you are looking for. Please ensure that you have entered the correct ID.');
    }
  }
}
