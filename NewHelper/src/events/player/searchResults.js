const { botConfig } = require('../../../config/var.js');
module.exports = async (message, query, tracks) => {
    message.channel.send({ embeds: [{
            color: botConfig.colors.misc,
            footer: { text: 'Type The Number Of The Track You Want To Add!' },
            author: { name: `Here Are The Search Results For: ${query}` },
            timestamp: new Date(),
            description: `${tracks.map((t, i) => `${botConfig.emojis.search} **#${i + 1}** - [\`${t.title}\`](${t.url})`).join('\n')}`,
    }]});
};