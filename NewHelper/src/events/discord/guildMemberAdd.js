const { db } = require('../../../config/var.js');
module.exports = async (member) => {
    if (!Object.keys(db.getData(`/guilds/${member.guild.id}/users`)).includes(member.user.id)) {
        db.push(`/guilds/${member.guild.id}/users/${member.user.id}`, { messages: 0, xp: 0, level: 0 })
    } else {

    };
    for (i = 0; i < member.guild.roles.cache.size; i++) {
        if (member.guild.roles.cache.array()[i].name.toLocaleLowerCase() == 'member') {
            member.roles.add(member.guild.roles.cache.array()[i]);
        };
    };
};