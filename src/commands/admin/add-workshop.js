import { Command } from 'discord.js-commando';
import { Asset } from 'dsteem';
import { Mentor, Workshop } from '../../models';
import config from '../../config';

export default class AddWorkshopCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'add-workshop',
      group: 'admin',
      memberName: 'add-workshop',
      aliases: ['addw'],
      description: 'Adds a new workshop.',
      examples: ['add-workshop NAME #channel @mentor DAY TIME PRICE'],
      guildOnly: true,
      args: [
        {
          key: 'name',
          label: 'NAME',
          prompt: 'Please enter a readable name of the workshop.',
          type: 'string',
          parse: value => value.trim(),
        },
        {
          key: 'channel',
          label: 'CHANNEL NAME',
          prompt: 'Please tag a Discord channel where the workshop will take place.',
          type: 'channel',
        },
        {
          key: 'mentor',
          label: 'MENTOR NAME',
          prompt: 'Please tag a mentor who will run this workshop.',
          type: 'member',
        },
        {
          key: 'day',
          label: 'DAY',
          prompt: 'Please enter a day.',
          type: 'string',
          parse: value => value.trim(),
        },
        {
          key: 'time',
          label: 'TIME',
          prompt: 'Please enter the workshop time.',
          type: 'string',
          parse: value => value.trim(),
        },
        {
          key: 'price',
          label: 'PRICE',
          prompt: 'Please enter registration price.',
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

  hasPermission(message) {
    if (!message.member.roles.some(role => config.MENTOR_ROLE.includes(role.name))) {
      return 'you do not have required permission to use this command!';
    }
    return true;
  }

  async run(message, {
    name, channel, mentor, day, time, price,
  }) {
    const workshopId = parseInt((Math.random() * (9999 - 1000)) + 1000, 10);
    const user = await Mentor.findOne({ discordId: mentor.user.id });

    await Workshop.create({
      name,
      workshopId,
      mentor: user,
      channelId: channel.id,
      price,
      day,
      time,
    })
      .then(async (workshop) => {
        user.workshops.push(workshop);
        await user.save();

        message.channel.send(`Workshop: ${name} (ID#: ${workshopId}) has been added. It will be mentored by ${mentor} in ${channel} on every ${day} from ${time} GMT.`);

        message.guild.createRole({
          name: `Workshop-${workshopId}`,
          mentionable: true,
        })
          .catch(e => console.log(e));
      })
      .catch((e) => {
        console.log(e);

        message.channel.send('There was an error in adding workshop.');
      });
  }
}
