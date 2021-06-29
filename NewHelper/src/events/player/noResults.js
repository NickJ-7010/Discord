const { botConfig } = require('../../../config/var.js');
module.exports = async (message, query) => {
    message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} No Results Found On YouTube For \`${query}\`!` } });
};