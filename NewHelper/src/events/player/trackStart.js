const { botConfig } = require('../../../config/var.js');
module.exports = async (message, track) => {
    message.channel.send({ embed: { color: botConfig.colors.event, thumbnail: { url: track.thumbnail }, description: `${botConfig.emojis.play} **Now Playing: [\`${track.title}\`](${track.url}) | By: \`${track.author}\` | Requested By: <@${track.requestedBy.id}>!**` } });
};