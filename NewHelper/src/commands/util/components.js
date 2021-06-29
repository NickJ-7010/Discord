const { print } = require('../../../config/var.js');
module.exports = {
    name: 'components',
    aliases: ['comp'],
    category: 'util',
    utilisation: '{prefix}components',
    description: '',
    async run(message, args) {
        print({ content: "Components!", components: [ args.join(' ') ] })
        message.channel.send({ content: "Components!", components: [ JSON.parse(args.join(' ')) ] });
    }
};