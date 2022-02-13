const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require("fs");
const config = require('./config.json');
const { DefinitionManager } = require('./externalDefinitions.js');

let prevMsg = null;
let errors = 0;

let EDMgr = new DefinitionManager("testWord\ntestWord2");

client.once("ready", () => {
    console.log("Online and Ready");
    client.user.setActivity("for fishy messages...", {type:WATCHING});
})

client.login(config.token);

function sendReport(type, message) {
    let file = fs.readFileSync("./stats.json");
    let stats= JSON.parse(file);
    let newStats;
    let reportChannel = message.guild.channels.cache.find(channel => channel.name === "okabot-reports");
    if (reportChannel != null) {
        if (type === "spam") {
            reportChannel.send(`${message.author.username}(ID:${message.author.id}) sent a message that triggered the spam filter!\n \nMessage contents:\`${message.content}\``);
            newStats = {
                "deletedSpam":stats.deletedSpam + 1,
                "deletedPing":stats.deletedPing
            }
        }
        if (type === "everyone") {
            reportChannel.send(`${message.author.name} sent an everyone ping without permissions.\n \nMessage contents:\`${message.content}\``);
            newStats = {
                "deletedSpam":stats.deletedSpam,
                "deletedPing":stats.deletedPing + 1
            }
        }
        fs.writeFileSync("./stats.json", JSON.stringify(newStats));
    }
}

client.on("message", message => {
    let file = fs.readFileSync("./stats.json");
    let stats= JSON.parse(file);

    let msg = message.content.toLowerCase();
    if (message.content.includes("<@!941422459201138718>")) {

        message.channel.send(`**UsefulOkabot: A spam prevention bot**\n\n**Total Deleted Spam Messages:** ${stats.deletedSpam}\n**Total Deleted Bad Pings:** ${stats.deletedPing}\n**Errors:** ${errors}:`);
    }

    if (message.content.includes("://") && prevMsg != null) {
        if (prevMsg.content.toLowerCase().includes("free") && prevMsg.content.toLowerCase().includes("nitro") && message.author != 941422459201138718) {
            prevMsg.delete();
            message.delete();
            sendReport("spam", message);
            message.channel.send(`<@!${message.author.id}>, your message was flagged as spam and deleted.`).then(message => {
                message.delete({ timeout: 5000 });
            });
        }
    }

    if(EDMgr.filterMessage(message)) {
        message.delete();
        sendReport("spam", message);
        message.channel.send(`<@!${message.author.id}>, your message was flagged as spam and deleted.`).then(message => {
            message.delete({ timeout: 5000 });
        });
    }

    /*  if ((msg.includes("can you test play") || msg.includes(".zip")) && msg.includes("://") && message.author != 941422459201138718) { //test play scams
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
    }  */

    if (msg.includes("@everyone") && !message.member.hasPermission("MENTION_EVERYONE") && message.author != 941422459201138718) {
        message.delete();
        sendReport("everyone", message);
        message.channel.send(`<@!${message.author.id}>, you can't ping everyone!`);
    }

    prevMsg = message;
})