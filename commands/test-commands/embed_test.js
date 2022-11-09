const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const exampleEmbed = new EmbedBuilder()
	.setColor(0xFF8000)
	.setTitle('Character Name')
	.setURL('https://discord.js.org/')
	.setAuthor({ name: 'Rekindled Embers Wiki', url: 'https://rekindled-embers.fandom.com' })
	.setDescription('Some description here')
	.setThumbnail('https://static.wikia.nocookie.net/ucp-internal-test-starter-commons/images/b/bc/Wiki.png/revision/latest?cb=20220106192145')
	.addFields(
		{ name: 'Portrayed by', value: 'API_Value' },
	)
	.setImage('https://i.imgur.com/AfFp7pu.png')
	.setFooter({ text: 'Bot by deltaflare#6222', iconURL: global.ownerAvatar});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('embed-test')
		.setDescription('cool required description'),
	execute(interaction) {
		console.log(global.ownerAvatar);
		interaction.reply({embeds: [exampleEmbed]});
	},
};