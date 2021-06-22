const { fs } = require('./config/var.js');

const files = fs.readdirSync(`./src`).filter(files => files.endsWith('.js'));

for (const file of files) {
    const script = require(`./src/${file}`);
    script.execute();
};