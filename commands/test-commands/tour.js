const { SlashCommandBuilder, inlineCode } = require('discord.js');

const footer = inlineCode(`Orientation blurb by Celestilune`)

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
            await interaction.reply(`Welcome to Angel’s Rest, ${target}!\n\nHere’s your quick rundown of the important places:\n\nGot burning questions?<#879932496488316949>\n\nGot spoiler reactions and questions? #spoiler-discussion  with that Inquisitor Role from bot-business\n\nWanna see art? Check the pins in art \n\nWanna read about some of the characters that have gotten mentioned?\n\nangels-rest\nsweethaven\noutpost-192 are home to our prequel roleplay, currently active but on its way to winding down in prep for 2.0, coming soon. Lot of great stories tho!\nAnd ⁠rp-general-ooc is where we tend to blather if not here.\n\n${footer}`)
		}
	},
};
