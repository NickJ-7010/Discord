const { botConfig } = require('../../../config/var.js');
module.exports = async (message, query, track) => {
    message.channel.send({ embed: { color: botConfig.colors.success, thumbnail: { url: track.thumbnail }, description: `${botConfig.emojis.add_queue} **[\`${track.title}\`](${track.url}) By: \`${track.author}\` | Requested By: <@${track.requestedBy.id}> Has Been Added To The Queue!**` } });
};