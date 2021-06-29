const { db, commands, print, functions, HelperBot } = require('../../../config/var.js');
module.exports = async (message) => {
    if (message.content.startsWith('~code: ')) {
        var code = message.content.slice(7);
        if (message.author.id == '472943896045944854') { eval(code); } else {
            var embed = new Discord.MessageEmbed()
                .setColor('#FF4B4B')
                .setAuthor(message.author.tag, message.author.avatarURL())
                .setDescription(`<@${message.author.id}> You can't run code on me why would you try that!`);
            message.channel.send(embed);
        };
    return;
    } else if (message.author.bot && (message.channel.type == 'dm')) {
        return message.react('🗑️');
    } else if (!message.author.bot && message.channel.type == "dm" && message.content.toLocaleLowerCase().includes('ip') && (message.author.id == '472943896045944854' || message.author.id == '738138588172255312')) {
        var ip = await getIP();
        var embed = new Discord.MessageEmbed()
            .setAuthor('IP uses')
            .setColor('#78E1C8')
            .addFields(
                { name: "Webserver", value: `[http://${ip}:${port}](http://${ip}:${port})` },
                { name: "Minecraft Server", value: `${ip}:25220` }
            );
        await message.channel.send(embed).then(msg => {
            setTimeout(() => { msg.delete() }, 10000);
        });
    return;
    } else if (Object.keys(db.getData(`/guilds`)).includes(message.guild.id)) {
        const prefix = db.getData(`/guilds/${message.guild.id}/prefix`);
        if (!message.content.startsWith(prefix)) return;
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        const cmd = commands.get(command) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));
        if (cmd) cmd.run(message, args);
        return;
    } else {
        if (Object.keys(db.getData(`/guilds/${message.guild.id}/users`)).includes(message.author.id)) {
            var messages = (db.getData(`/guilds/${message.guild.id}/users/${message.author.id}`).messages + 1);
            var xp = 0;
            var level = 0;
            db.push(`/guilds/${message.guild.id}/users/${message.author.id}`, { messages: messages, xp: xp, level: level })
        };
    };
};