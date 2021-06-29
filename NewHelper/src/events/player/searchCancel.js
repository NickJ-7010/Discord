const { botConfig } = require('../../../config/var.js');
module.exports = async (message) => {
    message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} The Search Has Been Canceled!` } });
};