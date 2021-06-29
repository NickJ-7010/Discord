const { botConfig } = require('../../../config/var.js');
module.exports = async (message, query, tracks, content, collector) => {
    if (content === 'cancel') {
        collector.stop();
        return message.channel.send({ embed: { color: botConfig.colors.success, description: `${botConfig.emojis.success} The Search Selection Has Been Canceled!` } });
    } else message.channel.send({ embed: { color: botConfig.colors.failure, description: `${botConfig.emojis.failure} Please Enter A Vaild Number Between \`1\` And \`${tracks.length}\`` } });
};