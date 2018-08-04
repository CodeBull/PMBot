import path from 'path';
import Commando from 'discord.js-commando';
import mongoose from 'mongoose';
import MongoDBProvider from 'commando-provider-mongo';
import config from './config';

// MongoDB connection
mongoose.connect(process.env.MONGODB, { useNewUrlParser: true });

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

// Initializing Discord Commando client
const client = new Commando.Client({
  owners: config.OWNER_ID,
  commandPrefix: config.COMMAND_PREFIX,
  disableEveryone: true,
  unknownCommandResponse: false,
  commandEditableDuration: 0,
  nonCommandEditable: false,
});
// Setting bot's settings provider to MongoDB
client.setProvider((mongoose.connection)
  .then(db => new MongoDBProvider(db)))
  .catch(console.error);

// Registering all commands
client.registry
  .registerGroups([
    ['admin', 'Administrative commands'],
    ['workshop', 'Workshop related commands'],
  ])
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', () => {
  console.log(`${new Date()}: ${client.user.username} bot is ready.`);
});

client.login(process.env.BOT_TOKEN);
