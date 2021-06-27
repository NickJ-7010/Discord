const {  } = require('../../../config/var.js');
module.exports = async (reaction) => {
    if (reaction.message.author.bot && reaction.emoji.name == '🗑️' && !reaction.me && reaction.users.cache.has('817907443816202261')) {
        reaction.message.delete();
    };
};