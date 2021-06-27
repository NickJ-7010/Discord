const { print, HelperBot, db, functions } = require('../../../config/var.js');
module.exports = async () => {
    setTimeout(() => print(`${HelperBot.user.tag} Is Now Online With ${HelperBot.ws.ping}ms ping`), 1000);
    HelperBot.guilds.cache.forEach(guild => {
        if (Object.keys(db.getData('/guilds')).includes(guild.id)) {
            guild.me.setNickname(`${HelperBot.user.username} (${db.getData(`/guilds/${guild.id}/prefix`)})`);
        };
    });
    HelperBot.ws.on('INTERACTION_CREATE', interaction => {
        runCommand(interaction);
    });
};