const { botConfig } = require('../../../config/var.js');
module.exports = async (message) => {
    message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} No one is in the channel!` } });
};