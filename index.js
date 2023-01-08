const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token, ownerId } = require('./config.json');
const { ownerUsername, ownerTag, ownerAvatar } = require('./owner-details.json');
const { writeFile, readFile } = require('fs');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
console.log("HANDLER USING PATH: " + commandsPath);
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

	//get owner info to use in other cmds
	var tempAvatar; var tempUsername; var tempTag; var changed = false;
	client.users.fetch(ownerId).then(ownerData => {
		console.log("fetching owner info...\n");
		tempAvatar = ownerData.displayAvatarURL();
		tempUsername = ownerData.username;
		tempTag = ownerData.tag;
		console.log(tempAvatar + '\n' + tempUsername + '\n' + tempTag +'\n')
		console.log("comparing owner info...\n");
		readFile('./owner-details.json', (error, data) => {
			if (error) {
				console.log("read error" + error);
				return;
			}
			const parsedData = JSON.parse(data);

		// if (!tempAvatar.equals(ownerAvatar)) {
			if (!(tempAvatar===ownerAvatar)) {
				console.log("ownerAvatar different:\nold: " + ownerAvatar + "\nnew: " + tempAvatar)
				parsedData.ownerAvatar = tempAvatar;
				changed = true;
				console.log("changed to" + parsedData.ownerAvatar + "\n")
			}
			// if (!tempAvatar.equals(ownerAvatar)) {
			if (!(tempUsername===ownerUsername)) {
				console.log("ownerUN different:\nold: " + ownerUsername + "\nnew: " + tempUsername)
				parsedData.ownerUsername = tempUsername;
				changed = true;
				console.log("changed to" + parsedData.ownerUsername + "\n")
			}
		// if (!tempAvatar.equals(ownerAvatar)) {
			if (!(tempTag===ownerTag)) {
				console.log("ownerTag different:\nold: " + ownerTag + "\nnew: " + tempTag)
				parsedData.ownerTag = tempTag;
				changed = true;
				console.log("changed to" + parsedData.ownerTag + "\n")
			}
			console.log("data compared!")

			if(changed){
				writeFile('./owner-details.json', JSON.stringify(parsedData, null, 2), (err) => {
					if (err) {
						console.log('Failed to write updated data to file');
						return;
					}
					console.log('Updated file successfully');
				});
			} else {
				console.log("no changes to owner data.")
			}
		});
	});
});

// Login to Discord with your client's token
client.login(token);