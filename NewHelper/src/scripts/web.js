const { webServer, bodyParser, print, getIP, webConfig } = require('../../config/var.js');
module.exports = {
    execute () {
        webServer.listen(webConfig.ports.webserver, async () => { var ip = await getIP(); print(`Webserver is open on ${ip}:5050`) });
        webServer.use(bodyParser.urlencoded({ extended: true }));
        webServer.get('/', async (req, res) => {
            var ip = await getIP();
            res.redirect(`http://${ip}:${port}/homepage`);
        });
        webServer.post('/*', (req, res) => {
            switch (req.originalUrl) {
                case '/':
                    switch (req.body.form_entry.toLocaleLowerCase()) {
                        case 'run code':
                            eval(req.body.code);
                            break;
                    };
                    break;
                case '/minecraft':
                    rCon(req.body.command);
                    serverRCON.on('output', (message) => {
                        return res.send(message);
                    });
                    break;
                case '/discord':
                    switch (req.body.form_entry.toLocaleLowerCase()) {
                        case 'reload commands':
                            addCommands();
                            break;
                        case 'update presence':
                            if (req.body.url == '') {
                                HelperBot.user.setPresence({
                                    status: req.body.status,
                                    activity: {
                                        name: req.body.text,
                                        type: req.body.activity,
                                    }
                                });
                            } else {
                                HelperBot.user.setPresence({
                                    status: req.body.status,
                                    activity: {
                                        name: req.body.text,
                                        type: req.body.activity,
                                        url: req.body.url
                                    }
                                });
                            };
                            break;
                    };
                    break;
            };
            var filePath = req.originalUrl;
            if (req.originalUrl.endsWith('/')) var filePath = filePath.slice(0, -1);
            res.sendFile(`web${filePath}.html`, { root: '.' });
        });
        webServer.get('/*', (req, res) => {
            var filePath = req.originalUrl;
            if (req.originalUrl.includes("?")) var filePath = filePath.split("?")[0];
            if (req.originalUrl.endsWith('/')) var filePath = filePath.slice(0, -1);
            if (!fs.existsSync(`./web${filePath}.html`)) { res.sendFile(`web/404.html`, { root: '.' }); return; };
            res.sendFile(`web${filePath}.html`, { root: '.' });
        });
        return 'WebServer Has Loaded!';
    }
};