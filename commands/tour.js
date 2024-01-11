const { SlashCommandBuilder, EmbedBuilder, quote } = require('discord.js');
const { ownerUsername, ownerTag, ownerAvatar } = require('../owner-details.json');

//called that bc it get appended instead
const header = 'Orientation blurb by Celestilune!\n' + quote(`Let me know if there's anything I can guide you to or have ideas you’d like to bounce off of someone! Or just want to blather and chat about RE. Cause I'm always down for that.`)

const embed = new EmbedBuilder()
	.setColor(0xFF8000)
	.setFooter({ text: 'Bot by '+ownerTag, iconURL: ownerAvatar})
	.setDescription(`Here's a tour of the important places!`)
	.addFields(
		{ name: 'Got questions?', value: 'Ask in <#879932496488316949>!' },
		{ name: 'Got spoiler reactions and questions?', value: 'View <#886470193042300938> with the Inquisitor role from <#880923604601143316>!'},
		{ name: 'Wanna see art?', value: 'Check the pins in <#879933744792883250>!'},
		{ name: 'Wanna read about some of the characters that have gotten mentioned?', value: '<#1186739790117359699> is home to the archived prequel roleplay. The real cool stuff can be found in the 2.0 sequel roleplay in <#1128691283393777785>, <#1186881216557883504>, and <#961091459682033674>. Lot of great stories to be found in those threads, including what was happening with some of the characters in <#1051940347942547457>! If you want to make a character, feel free to check in with <@718862095797452880>, <@172450794166157312>, or <@738608958973149226>, and we can help you get on the right track!' },
		{ name: 'Wanna chat?', value: '<#925597687926128680> is where we tend to blather if not <#878123375342522373>.'}
	)
	;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tour')
		.setDescription('Welcome to the server!')
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
            await interaction.reply({embeds: [embed], content: `Welcome to Angel’s Rest, ${target}!\n${header}`})
		}
	},
};

//\n\nHere’s your quick rundown of the important places:
//\n\nGot burning questions?<#879932496488316949>
//\n\nGot spoiler reactions and questions? #spoiler-discussion  with that Inquisitor Role from bot-business
//\n\nWanna see art? Check the pins in art \n\n
//Wanna read about some of the characters that have gotten mentioned?\n\nangels-rest\nsweethaven\noutpost-192 are home to our prequel roleplay, currently active but on its way to winding down in prep for 2.0, coming soon. Lot of great stories tho!
//\nAnd ⁠rp-general-ooc is where we tend to blather if not here.\n\n${footer}`)
