const { botConfig } = require('../../../config/var.js');
module.exports = async (error, message) => {
    switch (error) {
        case 'NotPlaying':
            message.channel.send(`${botConfig.emojis.failure} - There is no music being played on this server !`);
            break;
        case 'NotConnected':
            message.channel.send(`${botConfig.emojis.failure} - You are not connected in any voice channel !`);
            break;
        case 'UnableToJoin':
            message.channel.send(`${botConfig.emojis.failure} - I am not able to join your voice channel, please check my permissions !`);
            break;
        case 'VideoUnavailable':
            message.channel.send(`${botConfig.emojis.failure} - ${args[0].title} is not available in your country! Skipping...`);
            break;
        case 'MusicStarting':
            message.channel.send(`The music is starting... please wait and retry!`);
            break;
        default:
            message.channel.send(`${botConfig.emojis.failure} - Something went wrong ... Error : ${error}`);
    };  
};