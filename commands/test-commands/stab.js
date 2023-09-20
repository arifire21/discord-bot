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
		if(interaction.option.getUser('target').id = '823666872943378504'){
			await interaction.reply(`Ow! Please don't stab me!`)
		} else {
			await interaction.reply(`${interaction.user.username} stabbed ${interaction.options.getUser('target')}`);
		}
	},
};
