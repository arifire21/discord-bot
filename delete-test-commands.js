const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');

const rest = new REST({ version: '10' }).setToken(token);

//for use when dev commands need to be cleared, removes confusion
(async () => {
	try {
		rest.put(Routes.applicationCommands(clientId, guildId), { body: [] })
		.then(() => console.log('[HAVEN] Successfully deleted all application commands.'))
		.catch(console.error);
	} catch (error) {
		console.error(error);
	}
})();
