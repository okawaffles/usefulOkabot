const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

client.once("ready", () => {
    console.log("Online and Ready");
})

client.login(config.token);

client.on("message", message => {
    if(message.content.includes("<@!941422459201138718>")) {
        message.channel.send("");
    }

    if(message.content.includes("@everyone") && !message.author.hasPermission("MENTION_EVERYONE")) {
        message.delete();
        message.channel.send(`<@!${message.author.id}>, you can't ping everyone!`);
    }

    if((message.content.includes("can you test play") || message.content.includes(".zip")) && message.content.includes("://")) { //test play scams
        message.delete();
        message.channel.send(`<@!${message.author.id}>, your message was flagged as spam and deleted.`).then(message => {
            message.delete({timeout:5000});
        });
    }

    if(message.content.includes("nitro") && message.content.includes("free") && message.content.includes("://")) {
        message.delete();
        message.channel.send(`<@!${message.author.id}>, your message was flagged as spam and deleted.`).then(message => {
            message.delete({timeout:5000});
        });
    }
})