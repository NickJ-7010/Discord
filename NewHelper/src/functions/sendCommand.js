const { bss, uuid, print } = require('../../config/var.js');
module.exports = {
    async execute(command) {
        const requestId = uuid.v4();
        bss.server.send(JSON.stringify({
            "body": {
                "commandLine": command,
                "version": 1,
            },
            "header": {
                "requestId": requestId,
                "messagePurpose": "commandRequest",
                "version": 1,
            },
        }));   
    }
};