const { HelperBot, print, env, db } = require('../../config/var.js');
module.exports = {
    execute() {
        HelperBot.login(env.HelperToken);
    },
};