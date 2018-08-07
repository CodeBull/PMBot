import { Command } from 'discord.js-commando';
import { RichEmbed } from 'discord.js';
import { Workshop } from '../../models';

export default class ScheduleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'schedule',
      group: 'workshop',
      memberName: 'schedule',
      aliases: ['workshops'],
      description: 'List all the active workshops.',
      examples: ['schedule'],
      guildOnly: true,
    });
  }

  async run(message) {
    const workshops = await Workshop.find({}).sort({ day: 1 });

    const richEmbed = new RichEmbed({
      title: 'Workshops',
    })
      .setColor('#EC7357');

    workshops.forEach((w) => {
      richEmbed.addField(`${w.name} (ID: ${w.workshopId})`, `<#${w.channelId}>`, true);
      richEmbed.addBlankField(true);
      richEmbed.addField('Time', `${w.day} ${w.time}`, true);
    });

    message.channel.send(richEmbed);
  }
}
