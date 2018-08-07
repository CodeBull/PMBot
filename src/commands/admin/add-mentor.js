import { Command } from 'discord.js-commando';
import { Client } from 'dsteem';
import { Mentor } from '../../models';
import config from '../../config';

const steem = new Client('https://api.steemit.com');

export default class AddMentorCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'add-mentor',
      group: 'admin',
      memberName: 'add-mentor',
      aliases: ['addm'],
      description: 'Adds a new mentor.',
      examples: ['add-mentor @mentor steem_username'],
      guildOnly: true,
      args: [
        {
          key: 'mentor',
          label: 'MENTOR',
          prompt: 'Please tag a mentor.',
          type: 'member',
        },
        {
          key: 'username',
          label: 'STEEM USERNAME',
          prompt: 'Please enter mentor\'s steem username.',
          type: 'string',
          validate: async (name) => {
            const [account] = await steem.database.getAccounts([name]);

            if (!account) {
              return 'Please enter a valid steem username.';
            }

            return true;
          },
          parse: name => name.trim(),
        },
      ],
      argsPromptLimit: 0,
    });
  }

  hasPermission(message) {
    if (!message.member.roles.some(role => config.MANAGER_ROLE.includes(role.name))) {
      return 'you do not have required permission to use this command!';
    }
    return true;
  }

  async run(message, { mentor, username }) {
    const user = await Mentor.findOne({ discordId: mentor.user.id });

    if (!user) {
      await Mentor.create({
        username,
        discordId: mentor.user.id,
      })
        .then(() => {
          // Giving mentor role
          const mentorRole = message.guild.roles.find('name', config.MENTOR_ROLE);
          if (mentorRole) {
            mentor.addRole(mentorRole);
          }

          message.channel.send(`Congratulations! <@${mentor.user.id}> has been added as mentor.`);
        })
        .catch((e) => {
          console.log(e);
          message.channel.send('There was a problem in adding mentor.');
        });
    } else {
      message.channel.send(`User <@${mentor.user.id}> is already a mentor.`);
    }
  }
}
