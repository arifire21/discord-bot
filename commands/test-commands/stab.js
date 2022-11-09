const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stab')
		.setDescription('for legal reasons this is a joke (basic cmd)')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('User to stab')
                .setRequired(true)
        ),
	async execute(interaction) {
		await interaction.reply(`${interaction.user.username} stabbed ${interaction.options.getUser('target')}`);
	},
};
