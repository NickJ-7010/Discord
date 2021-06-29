const { print, HelperBot } = require('../../../config/var.js');
module.exports = async (interaction) => {
    switch (interaction.type) {
        case 'MESSAGE_COMPONENT':
            switch (interaction.customID) {
                case 'reloadPing':
                    interaction.message.edit({ embeds: [ { title: `Ping: ${HelperBot.ws.ping}` } ], components: [ { type: 1, components: [ { type: 2, style: 4, label: 'RELOAD', custom_id: 'reloadPing' } ] } ] });
                    break;
                default:
                    interaction.reply({ content: 'No Responce Was Given!' });
                    break;
            };
            break;
        case 'APPLICATION_COMMAND':
            switch (interaction.commandName) {
                case 'reload':
                    break;
            };
            break;
    };
};