const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ownerId } = require('../../config.json');
const index = require('../../index.js');
const client = index.Client;

const user = client.users.fetch(ownerId);
console.log(user.avatarURL);

const exampleEmbed = new EmbedBuilder()
	.setColor(0xFF8000)
	.setTitle('Character Name')
	.setURL('https://discord.js.org/')
	.setAuthor({ name: 'Rekindled Embers Wiki', url: 'https://rekindled-embers.fandom.com' })
	.setDescription('Some description here')
	.setThumbnail('https://rekindled-embers.fandom.com/wiki/Special:NewFiles?file=wiki.png')
	.addFields(
		{ name: 'Regular field title', value: 'Some value here' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
	)
	.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
	.setImage('https://i.imgur.com/AfFp7pu.png')
	.setFooter({ text: 'Bot by deltaflare#6222' , iconURL: user.avatarURL});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('embed-test'),
	execute(interaction) {
		interaction.reply({embeds: [exampleEmbed]});
	},
};