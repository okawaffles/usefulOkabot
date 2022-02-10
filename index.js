const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('config.json');

client.once("ready", () => {
    console.log("Online and Ready");
})

client.login(config.token);

client.on("message", message => {
    if(message.content.includes("@everyone") && !message.author.hasPermission("MENTION_EVERYONE")) {
        message.delete();
        message.channel.send(`<@!${message.author.id}>, you can't ping everyone!`);
    }

    if(message.content.incudes("can you test play") && message.content.includes("://")) {
        message.delete();
        message.channel.send(`<@!${message.author.id}>, your message was flagged as spam and deleted.`);
    }
})