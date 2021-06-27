const { fs, print, chalk, HelperBot, HelperPlayer, commands, functions } = require('./config/var.js');

fs.readdirSync('./src/commands').forEach(dirs => {
    const commandFiles = fs.readdirSync(`./src/commands/${dirs}`).filter(files => files.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./src/commands/${dirs}/${file}`);
        console.log(chalk.blue(`Loading discord command `) + chalk.greenBright(file.split('.')[0]));
        commands.set(command.name.toLowerCase(), command);
    };
});

const functionFiles = fs.readdirSync(`./src/functions`).filter(file => file.endsWith('.js'));
const scripts = fs.readdirSync(`./src/scripts`).filter(file => file.endsWith('.js'));
const botEvents = fs.readdirSync('./src/events/discord').filter(file => file.endsWith('.js'));
const playerEvents = fs.readdirSync('./src/events/player').filter(file => file.endsWith('.js'));

for (const file of functionFiles) {
    print(chalk.cyanBright(`Loading Function `) + chalk.greenBright(file.split('.')[0]));
    const functionFile = require(`./src/functions/${file}`)
    eval(`functions.${file.split('.')[0]} = functionFile.execute`)
};

for (const file of botEvents) {
    print(chalk.blueBright(`Loading discord.js event `) + chalk.greenBright(file.split('.')[0]));
    const event = require(`./src/events/discord/${file}`);
    HelperBot.on(file.split(".")[0], event.bind());
};

for (const file of playerEvents) {
    print(chalk.yellowBright(`Loading discord-player event `) + chalk.greenBright(file.split('.')[0]));
    const event = require(`./src/events/player/${file}`);
    HelperPlayer.on(file.split(".")[0], event.bind());
};

for (const file of scripts) {
    print(chalk.redBright(`Loading script `) + chalk.greenBright(file));
    const script = require(`./src/scripts/${file}`);
    script.execute();
};
print(chalk.green('Successfully Started Up The Scripts!'))