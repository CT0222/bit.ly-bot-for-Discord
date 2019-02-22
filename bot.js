const config = require("./config.json");
const token = config.discordToken;
const prefix = config.prefix;
const color = config.color;
const name = config.name;

const BitlyAPI = require("node-bitlyapi");
const Bitly = new BitlyAPI({
    client_id: "1a71c978abeb4643781c7f167f784f273ba754a8",
    client_secret: "2480ba4475ff3c1b2dc60f41a97a9fa5a9873dff"
});

Bitly.setAccessToken(config.bitlyToken);

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', async () => {
    console.log(`Logged in as => ${client.user.tag}!`);
    let invite = await client.generateInvite(["ADMINISTRATOR"]);
    console.log("invite =>", invite);
    client.user.setActivity(`${prefix}help`);
});

client.on("guildCreate", guild => {

    let channelID;
    let channels = guild.channels;
    channelLoop:
        for (let c of channels) {
            let channelType = c[1].type;
            if (channelType === "text") {
                channelID = c[0];
                break channelLoop;
            }
        }

    let channel = client.channels.get(guild.systemChannelID || channelID);
    let embed = new Discord.RichEmbed()
        .setColor(color)
        .setDescription("**" + `${name}` + "** just joined " + guild.name)
        .addField("Display the command list:", "```" + `${prefix}help` + "```")
        .addField("Shorten a URL:", "```" + `${prefix}short` + " [your URL]" + "```")
    channel.sendEmbed(embed);
});

client.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);
    if (!command.startsWith(prefix)) return;

    if (command === `${prefix}short`) {
        let inputURL = messageArray[1];
        Bitly.shortenLink(inputURL, function(err, results) {
            bitlink = JSON.parse(results);
            finalURL = bitlink.data.url;
            let embed = new Discord.RichEmbed()
                .setColor(color)
                .addField("Original URL:", inputURL)
                .addField("Shortened URL:", finalURL)
            message.channel.sendEmbed(embed);
        });
    }

    if (command === `${prefix}help`) {
        let embed = new Discord.RichEmbed()
            .setColor(color)
            .setDescription("**" + `${name}` + "** command list")
            .addField("Display this command list:", "```" + `${prefix}help` + "```")
            .addField("Shorten a URL:", "```" + `${prefix}short` + " [your URL]" + "```")
            .addField("For more...", "Check out this project's [Github repository](https://github.com/TasosY2K/bit.ly-bot-for-Discord)")
        message.channel.sendEmbed(embed);
    }
});

client.login(token);
