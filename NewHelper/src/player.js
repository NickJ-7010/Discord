const { HelperPlayer } = require('../config/var.js');
module.exports = {
    execute() {
        HelperPlayer.on('searchResults', (message, query, tracks) => {
            message.channel.send({
                embed: {
                    color: config.colors.misc,
                    footer: { text: 'Type The Number Of The Track You Want To Add!' },
                    author: { name: `Here Are The Search Results For: ${query}` },
                    timestamp: new Date(),
                    description: `${tracks.map((t, i) => `${config.emojis.search} **#${i + 1}** - [\`${t.title}\`](${t.url})`).join('\n')}`,
                },
            });
        });
        HelperPlayer.on('botDisconnect', (message) => {
            message.channel.send({ embed: { color: config.colors.error, description: `${config.emojis.failure} I Am No Longer In A Channel So I Am Stopping The Player And Clearing The Queue!` } });
        });
        HelperPlayer.on('channelEmpty', (message) => {
            message.channel.send({ embed: { color: config.colors.error, description: `${config.emojis.failure} No one is in the channel!` } });
        });
        HelperPlayer.on('error', (error, message) => {
            switch (error) {
                case 'NotPlaying':
                    message.channel.send(`${config.emojis.failure} - There is no music being played on this server !`);
                    break;
                case 'NotConnected':
                    message.channel.send(`${config.emojis.failure} - You are not connected in any voice channel !`);
                    break;
                case 'UnableToJoin':
                    message.channel.send(`${config.emojis.failure} - I am not able to join your voice channel, please check my permissions !`);
                    break;
                case 'VideoUnavailable':
                    message.channel.send(`${config.emojis.failure} - ${args[0].title} is not available in your country! Skipping...`);
                    break;
                case 'MusicStarting':
                    message.channel.send(`The music is starting... please wait and retry!`);
                    break;
                default:
                    message.channel.send(`${config.emojis.failure} - Something went wrong ... Error : ${error}`);
            };
        });
        HelperPlayer.on('playlistAdd', (message, query, playlist) => {
            message.channel.send({ embed: { color: config.colors.success, description: `${config.emojis.success} Playlist \`${playlist.title}\` Has Been Added To The Queue With \`${playlist.tracks.length}\` Songs!` } });
        });
        HelperPlayer.on('queueEnd', (message, queue) => {
            message.channel.send({ embed: { color: config.colors.event, description: `${config.emojis.pause} Player Stopped As There Are No More Tracks In The Queue!` } });
        });
        HelperPlayer.on('searchCancel', (message, query, tracks) => {
            message.channel.send({ embed: { color: config.colors.error, description: `${config.emojis.failure} The Search Has Been Canceled!` } });
        });
        HelperPlayer.on('searchInvalidResponse', (message, query, tracks, content, collector) => {
            if (content === 'cancel') {
                collector.stop();
                return message.channel.send({ embed: { color: config.colors.success, description: `${config.emojis.success} The Search Selection Has Been Canceled!` } });
            } else message.channel.send({ embed: { color: config.colors.failure, description: `${config.emojis.failure} Please Enter A Vaild Number Between \`1\` And \`${tracks.length}\`` } });
        });
        HelperPlayer.on('trackAdd', (message, query, track) => {
            message.channel.send({ embed: { color: config.colors.success, thumbnail: { url: track.thumbnail }, description: `${config.emojis.add_queue} **[\`${track.title}\`](${track.url}) By: \`${track.author}\` | Requested By: <@${track.requestedBy.id}> Has Been Added To The Queue!**` } });
        });
        HelperPlayer.on('trackStart', (message, track) => {
            message.channel.send({ embed: { color: config.colors.event, thumbnail: { url: track.thumbnail }, description: `${config.emojis.play} **Now Playing: [\`${track.title}\`](${track.url}) | By: \`${track.author}\` | Requested By: <@${track.requestedBy.id}>!**` } });
        });
        HelperPlayer.on('noResults', (message, query) => {
            message.channel.send({ embed: { color: config.colors.error, description: `${config.emojis.failure} No Results Found On YouTube For \`${query}\`!` } });
        });
    }
}