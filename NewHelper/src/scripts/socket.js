const { luaS, getIP, print } = require('../../config/var.js');
module.exports = {
    execute() {
        luaS.on('connection', async (ws, req) => {
            print('connection');
            luaS.on('message', async (message) => {
                print(message)
                ws.send("message recived have a good day!")
            });
            ws.send(`Connected to ${await getIP()}`);
        });
    }
};