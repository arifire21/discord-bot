const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');

const commands = [];
//REMEMBER TO CHANGE THE HANDLER PATH IN INDEX
const commandsPath = path.join(__dirname, 'commands/test-commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

console.log("File path: " + commandsPath);
console.log("Finding files...");
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if(command.data.name === null || command.data.name === undefined) { // true
		console.log('Null or undefined value!');
	} else {
		console.log(command.data.name);
		commands.push(command.data.toJSON());
	}
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(`\nSuccessfully reloaded ${data.length} TEST commands.\nCHANGE THE COMMAND PATH IN THE INDEX FILE\n`);
	} catch (error) {
		console.error(error);
	}
})();
