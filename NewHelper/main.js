const { fs, print, chalk, HelperBot, HelperPlayer, commands, functions, env } = require('./config/var.js');

const commandNames = [];

fs.readdirSync('./src/commands').forEach(dirs => {
    const commandFiles = fs.readdirSync(`./src/commands/${dirs}`).filter(files => files.endsWith('.js'));

    for (const file of commandFiles) {
        commandNames.push(file.split('.')[0])
        const command = require(`./src/commands/${dirs}/${file}`);
        commands.set(command.name.toLowerCase(), command);
    };
});
print(chalk.blue(`Loading discord commands: `) + chalk.greenBright(commandNames.join(', ')));

const functionFiles = fs.readdirSync(`./src/functions`).filter(file => file.endsWith('.js'));
const scripts = fs.readdirSync(`./src/scripts`).filter(file => file.endsWith('.js'));
const botEvents = fs.readdirSync('./src/events/discord').filter(file => file.endsWith('.js'));
const playerEvents = fs.readdirSync('./src/events/player').filter(file => file.endsWith('.js'));

for (const file of functionFiles) {
    const functionFile = require(`./src/functions/${file}`)
    eval(`functions.${file.split('.')[0]} = functionFile.execute`)
};
print(chalk.cyanBright(`Loading Functions: `) + chalk.greenBright(functionFiles.map(file => file.split('.')[0]).join(', ')));

for (const file of botEvents) {
    const event = require(`./src/events/discord/${file}`);
    HelperBot.on(file.split(".")[0], event.bind());
};
print(chalk.blueBright(`Loading discord.js events: `) + chalk.greenBright(botEvents.map(file => file.split('.')[0]).join(', ')));

for (const file of playerEvents) {
    const event = require(`./src/events/player/${file}`);
    HelperPlayer.on(file.split(".")[0], event.bind());
};
print(chalk.yellowBright(`Loading discord-player events: `) + chalk.greenBright(playerEvents.map(file => file.split('.')[0]).join(', ')));

for (const file of scripts) {
    print(chalk.redBright(`Running script: `) + chalk.greenBright(file));
    const script = require(`./src/scripts/${file}`);
    script.execute();
};

print(chalk.green('Successfully Started Up The Scripts!'));

HelperBot.login(env.HelperToken);