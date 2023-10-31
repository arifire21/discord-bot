const { SlashCommandBuilder, EmbedBuilder, inlineCode } = require('discord.js');
const { ownerUsername, ownerTag, ownerAvatar } = require('../../owner-details.json');

const footer = inlineCode(`Orientation blurb by Celestilune. PM with questions!`)

const embed = new EmbedBuilder()
	.setColor(0xFF8000)
	.setFooter({ text: 'Bot by '+ownerTag, iconURL: ownerAvatar})
	.setDescription(`Here's a tour of the important places!`)
	.addFields(
		{ name: 'Got questions?', value: 'Ask in <#879932496488316949>!' },
		{ name: 'Got spoilery questions and discussion?', value: 'View <#886470193042300938> with the Inquisitor role from <#880923604601143316>!'},
		{ name: 'Wanna see art?', value: 'Check the pins in <#879933744792883250>!'},
		{ name: 'Wanna read about some of the characters that have gotten mentioned?', value: '<#925470003006951434>, <#931176889236725770>, <#927213397899087872>, and <#925597931485143050> are home to the prequel roleplay, currently active but on its way to winding down in prep for 2.0, coming soon.' },
		{ name: 'Wanna chat?', value: '<#925597687926128680> is where we tend to blather if not <#878123375342522373>.'}
	)
	;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tour')
		.setDescription('test')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('Who are we welcoming?')
                .setRequired(true)
        ),

    async execute(interaction) {
		const target = interaction.options.getUser('target')

		if(target.id == '823666872943378504'){
			await interaction.reply(`I don't need to be welcomed!`)
		} else {
            await interaction.reply({embeds: [embed], content: `Welcome to Angel’s Rest, ${target}!\n${footer}`})
		}
	},
};

//\n\nHere’s your quick rundown of the important places:
//\n\nGot burning questions?<#879932496488316949>
//\n\nGot spoiler reactions and questions? #spoiler-discussion  with that Inquisitor Role from bot-business
//\n\nWanna see art? Check the pins in art \n\n
//Wanna read about some of the characters that have gotten mentioned?\n\nangels-rest\nsweethaven\noutpost-192 are home to our prequel roleplay, currently active but on its way to winding down in prep for 2.0, coming soon. Lot of great stories tho!
//\nAnd ⁠rp-general-ooc is where we tend to blather if not here.\n\n${footer}`)
