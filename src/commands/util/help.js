import { Command } from 'discord.js-commando';
import { stripIndents, oneLine } from 'common-tags';
import config from '../../config';

export default class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      group: 'util',
      memberName: 'help',
      description: 'Displays a list of available commands, or detailed information for a specified command.',
      examples: ['help'],
      guildOnly: true,
    });
  }

  async run(msg) {
    const messages = [];
    try {
      messages.push(await msg.direct(stripIndents`
        ${oneLine`
          You can run the following commands in ${msg.guild ? msg.guild.name : 'any server'}.
        `}

        ${stripIndents`
          ${(msg.member.roles.some(role => config.MANAGER_ROLE.includes(role.name))) ? stripIndents`
            **__For Managers__**

            **${config.COMMAND_PREFIX}add-mentor** *adds a mentor*
            Format: \`${config.COMMAND_PREFIX}add-mentor [@DISCORD NAME] [STEEM USERNAME]\`
            Example: \`${config.COMMAND_PREFIX}add-mentor @futurethinker futurethinker\`

          ` : ''}

          ${(msg.member.roles.some(role => config.MENTOR_ROLE.includes(role.name))) ? stripIndents`
            **__For Mentors__**

            **${config.COMMAND_PREFIX}add-workshop** *adds a new workshop*
            Format: \`${config.COMMAND_PREFIX}add-workshop ['TITTLE'] [#CHANNEL] [@MENTOR] [WEEKDAY] [TIME] [PRICE]\`
            Example: \`${config.COMMAND_PREFIX}add-workshop 'Feedback workshop' #general-feedback-session @futurethinker Saturday 09:00-11:00 0.001 SBD\`

            **${config.COMMAND_PREFIX}open-workshop** *opens a workshop*
            Format: \`${config.COMMAND_PREFIX}open-workshop [WORKSHOP ID]\`
            Example: \`${config.COMMAND_PREFIX}open-workshop 4325\`

            **${config.COMMAND_PREFIX}close-workshop** *closes a workshop*
            Format: \`${config.COMMAND_PREFIX}close-workshop [WORKSHOP ID]\`
            Example: \`${config.COMMAND_PREFIX}close-workshop 4325\`

            **${config.COMMAND_PREFIX}show-message** *shows a predefined message*
            Format: \`${config.COMMAND_PREFIX}show-message [TYPE]\`
            Example: \`${config.COMMAND_PREFIX}show-message closing\`

            Before you close a workshop generate a closing message by typing:
            \`${config.COMMAND_PREFIX}show-message closing\`

          ` : ''}

          **__For Users__**

          **${config.COMMAND_PREFIX}schedule** *shows the list of workshops*
          Format: \`${config.COMMAND_PREFIX}schedule\`
          Example: \`${config.COMMAND_PREFIX}schedule\`

          **${config.COMMAND_PREFIX}join-workshop** *subscribes to a workshop*
          Format: \`${config.COMMAND_PREFIX}join-workshop [WORKSHOP ID]\`
          Example: \`${config.COMMAND_PREFIX}join-workshop 4325\`

          **${config.COMMAND_PREFIX}tip** *generates a link to tip a mentor*
          Format: \`${config.COMMAND_PREFIX}tip [MENTOR] [AMOUNT]\`
          Example: \`${config.COMMAND_PREFIX}tip @futurethinker 1 SBD\`
        `}

      `, { split: true }));
      if (msg.channel.type !== 'dm') messages.push(await msg.reply('Sent you a DM with information.'));
    } catch (err) {
      messages.push(await msg.reply('Unable to send you the help DM. You probably have DMs disabled.'));
    }

    return messages;
  }
}
