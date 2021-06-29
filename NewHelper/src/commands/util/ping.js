const { Discord, HelperBot } = require('../../../config/var.js');
module.exports = {
    name: 'ping',
    aliases: [],
    category: 'util',
    utilisation: '{prefix}ping',
    description: 'Gives The Bot\'s Current Ping To Discord!',
    async run(message) {
        message.channel.send({ embeds: [ { title: `Ping: ${HelperBot.ws.ping}` } ], components: [ { type: 1, components: [ { type: 2, style: 4, label: 'RELOAD', custom_id: 'reloadPing' } ] } ] })
    }
}