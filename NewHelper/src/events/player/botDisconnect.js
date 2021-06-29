const { botConfig } = require('../../../config/var.js');
module.exports = async (message) => {
    message.channel.send({ embeds: [ { color: botConfig.colors.error, description: `${botConfig.emojis.failure} I Am No Longer In A Channel So I Am Stopping The Player And Clearing The Queue!` } ] });
};