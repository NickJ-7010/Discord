const { db } = require('../../../config/var.js');
module.exports = async (member) => {
    if (!Object.keys(db.getData(`/guilds/${member.guild.id}/users`)).includes(member.user.id)) {
        db.push(`/guilds/${member.guild.id}/users/${member.user.id}`, { messages: 0, xp: 0, level: 0 })
    } else {

    };
    member.user.roles.add(member.guild.roles.cache.get(db.getData(`/guilds/${member.guild.id}/member_role_id`)));
};