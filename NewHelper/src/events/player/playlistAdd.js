const { botConfig } = require('../../../config/var.js');
module.exports = async (message, query, playlist) => {
    message.channel.send({ embed: { color: botConfig.colors.success, description: `${config.emojis.success} Playlist \`${playlist.title}\` Has Been Added To The Queue With \`${playlist.tracks.length}\` Songs!` } });   
};