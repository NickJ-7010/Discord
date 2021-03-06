const { print, db, HelperBot } = require('../../../config/var.js');
module.exports = async (guild) => {
    await db.reload();
    if (!Object.keys(db.getData('/guilds')).includes(guild.id)) {
        print(`I have been added to the "${guild.name}" server!`);
        var users = JSON.parse(`{ ${guild.members.cache.map(member => `"${member.id}": { "messages": 0, "xp": 0, "level": 0 }`).join(', ')} }`);
        for (i = 0; i < guild.channels.cache.size; i++) {
            if (guild.channels.cache.array()[i].isText()) {
                var channel = HelperBot.channels.cache.get(`${guild.channels.cache.array()[i].id}`);
                channel.send(`<@${guild.ownerID}> Please configure Me For This Server For More Info Do "-help config"`);
                db.push(`/guilds/${guild.id}`, { users: users, prefix: '-', welcome_channel_id: channel.id, member_role_id: guild.roles.cache.find(r => r.name.toLowerCase() == '@everyone').id });
                break;
            };
        };
    } else {
        print(`I have been added back to the "${guild.name}" server!`);
        for (i = 0; i < guild.channels.cache.size; i++) {
            if (guild.channels.cache.array()[i].isText()) {
                var channel = HelperBot.channels.cache.get(`${guild.channels.cache.array()[i].id}`);
                channel.send(`<@${guild.ownerID}> Thanks For Adding Me Back To **${guild.name}**!`);
                break;
            };
        };
        for (i = 0; i < guild.members.cache.size; i++) {
            if (!Object.keys(db.getData(`/guilds/${guild.id}/users`)).includes(guild.members.cache.array()[i])) {
                db.push(`/guilds/${guild.id}/users/${guild.members.cache.array()[i].id}`, { messages: 0, xp: 0, level: 0 })
            };
        };
    };
    await db.reload()
    guild.me.setNickname(`${HelperBot.user.username} (-)`)
};