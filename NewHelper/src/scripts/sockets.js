const { luaS, getIP, print, bWss, bss, uuid, fs, db } = require('../../config/var.js');
module.exports = {
    execute() {
        luaS.on('connection', async (ws) => {
            print('connection');
            luaS.on('message', async (message) => {
                print(message)
                ws.send("message recived have a good day!")
            });
            ws.send(`Connected to ${await getIP()}`);
        });

        bWss.on('connection', async (ws) => {
            bss.server = ws;
            bss.server.send(JSON.stringify({
                "body": {
                    "eventName": "PlayerLeave",
                },
                "header": {
                    "requestId": uuid.v4(),
                    "messagePurpose": 'subscribe',
                    "version": 1,
                },
            }));
            bss.server.send(JSON.stringify({
                "body": {
                    "eventName": "PlayerJoin",
                },
                "header": {
                    "requestId": uuid.v4(),
                    "messagePurpose": 'subscribe',
                    "version": 1,
                },
            }));
            bss.server.on('message', async (packet) => {
                const data = JSON.parse(packet)
                db.push(`/events/${data.body.eventName}`, data.body.properties)
            });
        });
    }
};