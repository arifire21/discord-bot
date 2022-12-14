const axios = require('axios');
const wait = require('node:timers/promises').setTimeout;
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const baseEmbed = new EmbedBuilder()
	.setColor(0xFF8000)
	// .setTitle('Character Name')
	// .setURL('https://discord.js.org/')
	.setAuthor({ name: 'Rekindled Embers Wiki', url: 'https://rekindled-embers.fandom.com' })
	// .setDescription('Some description here')
	.setThumbnail('https://static.wikia.nocookie.net/ucp-internal-test-starter-commons/images/b/bc/Wiki.png/revision/latest?cb=20220106192145')
	// .addFields(
	// 	{ name: 'Portrayed by', value: 'API_Value' },
	// )
	// .setImage('https://i.imgur.com/AfFp7pu.png')
	.setFooter({ text: 'Bot by deltaflare#6222', iconURL: global.ownerAvatar});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wiki')
        .setDescription('Get info from the Rekindled Embers Wiki!')
        .addSubcommand(subcommand =>
            subcommand
			.setName('character')
			.setDescription('Info about a character')
			.addStringOption(option => option.setName('character_name').setDescription('Name of character, with spaces').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
			.setName('option2')
			.setDescription('THIS DOES NOT WORK')
			.addStringOption(option => option.setName('char_name').setDescription('Name of character, with spaces'))
        ),

    async execute(interaction) {
        await interaction.deferReply();
        await wait(2000);
        if (interaction.options.getSubcommand() === 'character') {
            console.log("char page called")
            const charName = interaction.options.getString('character_name');
            var resultStr = await getCharacterPage(charName);

            if(resultStr == "" || resultStr.includes("Character")){
                await interaction.editReply(resultStr);
            } else {
                await interaction.editReply({embeds: [baseEmbed]});
            }
        }

        //     if (user) {
        //         await interaction.reply(`Username: ${user.username}\nID: ${user.id}`);
        //     } else {
        //         await interaction.reply(`Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`);
        //     }
        // } else if (interaction.options.getSubcommand() === 'server') {
        //     await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
        // }
    }
}

function getCharacterPage(userString) {
    return new Promise((resolve, reject) => {
        var returnStr = "";
        var url = "https://rekindled-embers.fandom.com/api.php";
        var params = {
            action: "query",
            format: "json",
            formatversion: "2",
            titles: userString,
            prop: "images|description|info",
            inprop: "url"
            // list: "embeddedin"
        };

        url = url + "?origin=*";
        Object.keys(params).forEach(function (key) { url += "&" + key + "=" + params[key]; });
        console.log("QUERY STRING USED: " + url)
        
        axios.get(url)
            .then(function (response) {
                var pages = response.data.query.pages;
                for (var p in pages) {
                    console.log("Page " + p + " response:");
                    console.log(pages[p]);
                    if(pages[p].missing === true){
                        console.log("char page is missing");
                        returnStr = "Character not found! (page \"" + userString +"\" does not exist)";
                    } else {
                        baseEmbed.setTitle(userString);
                        baseEmbed.setURL(pages[p].canonicalurl);
                        // baseEmbed.setDescription(pages[p].description);
                        var filepath = pages[p].images[0].title;
                        filepath = filepath.replace("File:", "")
                        baseEmbed.setImage("https://rekindled-embers.fandom.com/wiki/Rekindled_Embers_Wiki?file=" + filepath);
                    }
                    console.log("returnstr before resolve: " + returnStr);
                    resolve(returnStr)
                }
            })
            .catch(function (error) {
                console.log(error);
                reject(returnStr)
            })

    })
}

//https://rekindled-embers.fandom.com/wiki/Rekindled_Embers_Wiki?file=Smoky_Flare.png