//KEEP THIS CMD AROUND TO TEST CLEANUP
const axios = require('axios');
const wait = require('node:timers/promises').setTimeout;
const { SlashCommandBuilder, EmbedBuilder, codeBlock } = require('discord.js');
const fs = require('node:fs');
const { ownerUsername, ownerTag, ownerAvatar } = require('../../owner-details.json');

const baseEmbed = new EmbedBuilder()
	.setColor(0xFF8000)
	.setAuthor({ name: 'Rekindled Embers Wiki', url: 'https://rekindled-embers.fandom.com' })
	.setThumbnail('https://static.wikia.nocookie.net/ucp-internal-test-starter-commons/images/b/bc/Wiki.png/revision/latest?cb=20220106192145')
	.setFooter({ text: 'Bot by '+ownerTag, iconURL: ownerAvatar});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wiki')
        .setDescription('Get info from the Rekindled Embers Wiki!')
        .addSubcommand(subcommand =>
            subcommand
			.setName('character')
			.setDescription('Search for info about a character')
			.addStringOption(option => option.setName('name').setDescription('Name of character, with spaces (case sensitive)').setRequired(true))
            .addBooleanOption(option => option.setName('private').setDescription('If true, embed will only be visible to you (default: false)'))
        )
        .addSubcommand(subcommand =>
            subcommand
			.setName('category')
			.setDescription('Search for a category on the wiki')
			.addStringOption(option => option.setName('page').setDescription('Title of category page, with spaces').setRequired(true))
            .addBooleanOption(option => option.setName('private').setDescription('If true, embed will only be visible to you (default: false)'))
        )
        .addSubcommand(subcommand =>
            subcommand
			.setName('other')
			.setDescription('Search for a RE Wiki page')
			.addStringOption(option => option.setName('page').setDescription('Title of page, with spaces (do not use for categories)').setRequired(true))
            .addBooleanOption(option => option.setName('private').setDescription('If true, embed will only be visible to you (default: false)'))
        ),

    async execute(interaction) {
        const privacy = interaction.options.getBoolean('private');

        if (interaction.options.getSubcommand() === 'character') {
            console.log("char page called")
            const charName = interaction.options.getString('name');
            var returnStr = await getCharacterPage(charName);

            //use conditional because command will resolve with missing page
            if(privacy){
                if(returnStr.includes("Character")){
                    await interaction.reply({content: returnStr, ephemeral: true});
                } else {
                    await interaction.reply({embeds: [baseEmbed], ephemeral: true});
                }
            } else {
                if(returnStr.includes("Character")){
                    await interaction.reply(returnStr);
                } else {
                    await interaction.reply({embeds: [baseEmbed]});
                }
            }
        }

        if (interaction.options.getSubcommand() === 'category') {
            console.log("category page called")
            const pageName = interaction.options.getString('page');
            var returnStr = await getCategoryPage(pageName);

            //use conditional because command will resolve with missing page
            if(privacy){
                if(returnStr.includes("Page")){
                    await interaction.reply({content: returnStr, ephemeral: true});
                } else {
                    await interaction.reply({embeds: [baseEmbed], ephemeral: true});
                }
            } else {
                if(returnStr.includes("Page")){
                    await interaction.reply(returnStr);
                } else {
                    await interaction.reply({embeds: [baseEmbed]});
                }
            }
        }

        if (interaction.options.getSubcommand() === 'other') {
            console.log("other page called")
            const pageName = interaction.options.getString('page');
            var returnStr = await getOtherPage(pageName);

            //use conditional because command will resolve with missing page
            if(privacy){
                if(returnStr.includes("Page")){
                    await interaction.reply({content: returnStr, ephemeral: true});
                } else {
                    await interaction.reply({embeds: [baseEmbed], ephemeral: true});
                }
            } else {
                if(returnStr.includes("Page")){
                    await interaction.reply(returnStr);
                } else {
                    await interaction.reply({embeds: [baseEmbed]});
                }
            }
        }
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
            prop: "images|description|info|categories",
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
                    console.log(`Page ${p} response:`);
                    console.log(pages[p]);
                    if(pages[p].missing){
                        console.log("char page is missing");
                        returnStr = `Character not found! (page \"${userString}\" does not exist)\n(The option is *case sensitive*)`;
                    } else {
                        baseEmbed.setTitle(userString);
                        baseEmbed.setURL(pages[p].canonicalurl);
                        // baseEmbed.setDescription(pages[p].description);
                        //get image
                        try {
                            var filepath = pages[p].images[0].title;
                            filepath = filepath.replace("File:", "");
                            filepath = filepath.replaceAll(" ", "_");
                            console.log(filepath); console.log("https://rekindled-embers.fandom.com/wiki/Special:FilePath/" + filepath)
                            baseEmbed.setImage("https://rekindled-embers.fandom.com/wiki/Special:FilePath/" + filepath);
                        } catch (error) {
                            console.log('char page has no image!\n' + error);
                            baseEmbed.setImage(null)    //to replace image from previous commands, if possible
                        }
                        //get cats
                        try {
                            let returnedCats = categoryListHelper(pages[p].categories)
                            baseEmbed.setFields({name: 'Categories', value: returnedCats})

                            if(returnedCats.includes('Roleplay Characters')){
                                baseEmbed.addFields({name: 'Portrayed By', value: 'TBD'})
                            //if cat is not RP and the embed still has it
                            } else if((!returnedCats.includes('Roleplay Characters')) && baseEmbed.fields[0].name === 'Portrayed By') {
                                baseEmbed.spliceFields(-1, 1)
                            }
                        } catch (error) {
                            console.log('char page has no categories!\n' + error);
                        }
                    }
                    resolve(returnStr)
                }
            })
            .catch(function (error) {
                reject(returnStr)
            })

    })
}

function getCategoryPage(userString) {
    return new Promise((resolve, reject) => {
        var returnStr = "";
        var url = "https://rekindled-embers.fandom.com/api.php";
        var params = {
            action: "query",
            format: "json",
            formatversion: "2",
            titles: `Category:${userString}`,
            prop: "description",
            inprop: "url"
            // list: "embeddedin"
        };

        url = url + "?origin=*";
        Object.keys(params).forEach(function (key) { url += "&" + key + "=" + params[key]; });
        console.log(`QUERY STRING USED: ${url}`)
        
        axios.get(url)
            .then(function (response) {
                var pages = response.data.query.pages;
                for (var p in pages) {
                    console.log(`Page ${p} response:`);
                    console.log(pages[p]);
                    if(pages[p].missing === true){
                        console.log("page is missing");
                        returnStr = `Page not found! (page \"${userString}\" does not exist)\n(The option is *case sensitive*)`;
                    } else {
                        baseEmbed.setTitle(userString);
                        baseEmbed.setURL(`https://rekindled-embers.fandom.com/wiki/Category:${userString.replace(' ','_')}`);
                        baseEmbed.setDescription(pages[p].description);
                    }
                    // console.log("returnstr before resolve: " + returnStr);
                    resolve(returnStr)
                }
            })
            .catch(function (error) {
                // console.log(error);
                reject(returnStr)
            })

    })
}

function getOtherPage(userString) {
    return new Promise((resolve, reject) => {
        var returnStr = "";
        var url = "https://rekindled-embers.fandom.com/api.php";
        var params = {
            action: "query",
            format: "json",
            formatversion: "2",
            titles: userString,
            prop: "description|info",
            inprop: "url"
            // list: "embeddedin"
        };

        url = url + "?origin=*";
        Object.keys(params).forEach(function (key) { url += "&" + key + "=" + params[key]; });
        console.log(`QUERY STRING USED: ${url}`)
        
        axios.get(url)
            .then(function (response) {
                var pages = response.data.query.pages;
                for (var p in pages) {
                    console.log(`Page ${p} response:`);
                    console.log(pages[p]);
                    if(pages[p].missing === true){
                        console.log("page is missing");
                        returnStr = `Page not found! (page \"${userString}\" does not exist)\n(The option is *case sensitive*)`;
                    } else {
                        baseEmbed.setTitle(userString);
                        baseEmbed.setURL(pages[p].canonicalurl);
                        // baseEmbed.setDescription(pages[p].description);
                        // try {
                        //     var filepath = pages[p].images[0].title;
                        //     filepath = filepath.replace("File:", "");
                        //     filepath = filepath.replace(" ", "_");
                        //     console.log(filepath); console.log("https://rekindled-embers.fandom.com/wiki/Special:FilePath/" + filepath)
                        //     baseEmbed.setImage("https://rekindled-embers.fandom.com/wiki/Special:FilePath/" + filepath);
                        // } catch (error) {
                        //     console.log("no images on page");
                        // }
                    }
                    // console.log("returnstr before resolve: " + returnStr);
                    resolve(returnStr)
                }
            })
            .catch(function (error) {
                // console.log(error);
                reject(returnStr)
            })

    })
}

function categoryListHelper(categories){
    let slicedCategories = []

    for (let i = 0; i < categories.length; i++) {
        let t = categories[i].title
        console.log('t: ' + t)
        t = t.substring(9)   //removes 'category:' from the str
        slicedCategories.push(t)
    }

    console.log('sliced: ' + slicedCategories)
    return slicedCategories.join(',')
}