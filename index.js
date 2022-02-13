const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
let prevMsg = null;

client.once("ready", () => {
    console.log("Online and Ready");
})

client.login(config.token);

function sendReport(type, message) {
    let reportChannel = message.guild.channels.cache.find(channel => channel.name === "okabot-reports");
    if (reportChannel != null) {
        if (type === "spam") {
            reportChannel.send(`${message.author.username}(ID:${message.author.id}) sent a message that triggered the spam filter!\n \nMessage contents:\`${message.content}\``);
        }
        if (type === "everyone") {
            reportChannel.send(`${message.author.name} sent an everyone ping without permissions.\n \nMessage contents:\`${message.content}\``);
        }
    }
}

client.on("message", message => {
    let msg = message.content.toLowerCase();
    if (message.content.includes("<@!941422459201138718>")) {
        message.channel.send("");
    }

    if (message.content.includes("://") && prevMsg != null) {
        if (prevMsg.content.includes("free") && prevMsg.content.includes("nitro")) {
            prevMsg.delete();
            message.delete();
            sendReport("spam", message);
            message.channel.send(`<@!${message.author.id}>, your message was flagged as spam and deleted.`).then(message => {
                message.delete({ timeout: 5000 });
            });
        }
    }

    if ((msg.includes("can you test play") || msg.includes(".zip")) && msg.includes("://") && message.author != 941422459201138718) { //test play scams
        message.delete();
        sendReport("spam", message);
        message.channel.send(`<@!${message.author.id}>, your message was flagged as spam and deleted.`).then(message => {
            message.delete({ timeout: 5000 });
        });
    }

    if (msg.includes("nitro") && msg.includes("free") && (msg.includes("://") || msg.includes(".com") || msg.includes(".net")) && message.author != 941422459201138718) {
        message.delete();
        sendReport("spam", message);
        message.channel.send(`<@!${message.author.id}>, your message was flagged as spam and deleted.`).then(message => {
            message.delete({ timeout: 5000 });
        });
    }

    if (msg.includes("@everyone") && !message.member.hasPermission("MENTION_EVERYONE") && message.author != 941422459201138718) {
        message.delete();
        sendReport("everyone", message);
        message.channel.send(`<@!${message.author.id}>, you can't ping everyone!`);
    }

    prevMsg = message;
})