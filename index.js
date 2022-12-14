// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token, ownerId } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands/test-commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);
    console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered ${interaction.commandName} interaction.`);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		// console.log("is interaction deferred? " + interaction.deferred);
		if(interaction.deferred){
			await interaction.followUp({content: `<@${ownerId}> There was an error while executing this command!\n` + error});
		}
		await interaction.reply({ content: `<@${ownerId}> There was an error while executing this command!\n` + error});
	}
});

// When the client is ready, run this code (only once)
client.once('ready', c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Login to Discord with your client's token
client.login(token);

//get owner info to use in other cmds
client.users.fetch(ownerId).then(ownerData => {
	console.log("fetching owner info...");
	global.ownerAvatar = ownerData.displayAvatarURL();
	// console.log(ownerData.displayAvatarURL());
	console.log("owner avatar url found")
});