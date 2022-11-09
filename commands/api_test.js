const axios = require('axios');
const wait = require('node:timers/promises').setTimeout;
const { SlashCommandBuilder } = require('discord.js');

//     /*
//         get_info.js

//         MediaWiki API Demos
//         Demo of `Info` module: Send a GET request to display information about a page.

//         MIT License
//     */

module.exports = {
	data: new SlashCommandBuilder()
		.setName('api-test')
		.setDescription('Search for a character on the wiki')
        .addStringOption(option => 
            option.setName('character')
                .setDescription('Name of character, with spaces')
                .setRequired(true)
        ),
	async execute(interaction) {
        await interaction.deferReply();
		await wait(2000);
        console.log("submitted: " + interaction.options.getString('character'))
        var resulturl = await getCharacterPage(interaction.options.getString('character'))
        console.log("result: " + resulturl)
	    await interaction.editReply(resulturl);
	},
};

function getCharacterPage(userString) {
    return new Promise((resolve, reject) => {
        var returnStr = "";
        var url = "https://rekindled-embers.fandom.com/api.php";
        var params = {
            action: "query",
            format: "json",
            formatversion: "2",
            titles: userString,
            prop: "info",
            inprop: "url"
        };

        url = url + "?origin=*";
        Object.keys(params).forEach(function (key) { url += "&" + key + "=" + params[key]; });
        
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
                        returnStr = pages[p].canonicalurl;
                    }
                    console.log("assigned: " + returnStr);
                    resolve(returnStr)
                }
            })
            .catch(function (error) {
                console.log(error);
                reject(returnStr)
            })

    })
}