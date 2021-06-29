const { botConfig } = require('../../../config/var.js');
module.exports = async (message) => {
    message.channel.send({ embed: { color: botConfig.colors.event, description: `${botConfig.emojis.pause} Player Stopped As There Are No More Tracks In The Queue!` } });
};