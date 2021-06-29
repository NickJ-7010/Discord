require('dotenv').config();
const env = process.env;
const Discord = require('discord.js');
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const fs = require('fs');
const { Player } = require('discord-player');
const webSocket = require('ws');
const botConfig = require('../config/bot.json');
const webConfig = require('../config/web.json');
const { db } = require('../src/scripts/db.ts');
const minecraft = require('minecraft-server-util');
const chalk = require('chalk');
const ipify = require('ipify');
const canvas = require('canvas');
const uuid = require('uuid')
const bWss = new webSocket.Server({ port: webConfig.ports.bedrock_ws });
var bss = {  };
const print = console.log;
const commands = new Discord.Collection();
const serverRCON = new minecraft.RCON('mc-server', { port: 25425, enableSRV: true, timeout: 5000, password: env.RCONpassword });
const HelperBot = new Discord.Client({ intents: Discord.Intents.ALL, partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER'] });
const HelperHook = new Discord.WebhookClient('837810167445717002', 'x5R47Ql_aQDzjwCos3n7IDmgRatEsTTad_cH1r6BSQ_SpkiAlw6_WJSY0LxqvrLAOoHd');
const HelperPlayer = new Player(HelperBot);
const functions = { };
const webServer = express();
const luaS = new webSocket.Server({ port: webConfig.ports.websocket });

module.exports = { env, Discord, express, bodyParser, fetch, fs, Player, webSocket, functions, botConfig, webConfig, db, minecraft, chalk, ipify, canvas, uuid, bWss, bss, print, commands, serverRCON, HelperBot, HelperHook, HelperPlayer, webServer, luaS,
    async addCommands() {
        addCommand({ name: "test", description: "test for things", options: [] }, false, '817906100262141982');
        addCommand({ name: "ping", description: "replys with the bots ping" }, false, '817906100262141982');
        addCommand({ name: "info", description: "gives info on things", options: [{ name: "server", description: "info for this server", type: 1 }, { name: "member", description: "info on a server member", type: 1, options: [{ name: "MEMBER", description: "the member for the command", type: 6, required: true }] }, { name: "channel", description: "info on a server channel", type: 1, options: [{ name: "CHANNEL", description: "the channel for the command", type: 7, required: true }] }] }, false, '817906100262141982');
        addCommand({ name: "reload", description: "reloads the commands in the server" }, false, '817906100262141982');
    },
    async addCommand(data, global, guild) {
        switch (global) {
            case true:
                HelperBot.api.applications(HelperBot.user.id).commands.post({
                    data: data
                });
                break;
            case false:
                HelperBot.api.applications(HelperBot.user.id).guilds(guild).commands.post({
                    data: data
                });
                break;
        };
    },
    async runCommand(interaction) {
        const command = interaction.data.name.toLowerCase();
        const args = interaction.data.options;
        const senderUsername = interaction.member.user.username;
        const senderDiscriminator = interaction.member.user.discriminator;
        const senderAvatar = `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}.webp`;
    
        switch (command) {
            case 'ping':
                var embed = new Discord.MessageEmbed()
                    .setColor('#B964C8')
                    .setDescription('Ping: ' + HelperBot.ws.ping);
                HelperBot.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: await createAPIMessage(interaction, embed)
                    }
                });
            case 'test':
                var user = HelperBot.users.cache.get(interaction.member.user.id)
                print(interaction.member)
                HelperBot.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: { flags: '64', content: "dismiss this" }
                    }
                });
                break;
            case 'reload':
                for (j = 0; j < HelperBot.guilds.cache.size; j++) {
                    var commands = await HelperBot.api.applications(HelperBot.user.id).guilds(HelperBot.guilds.cache.map(m => m.id)[j]).commands.get();
                    for (i = 0; i < commands.length; i++) {
                        HelperBot.api.applications(HelperBot.user.id).guilds(HelperBot.guilds.cache.map(m => m.id)[j]).commands(commands[i].id).delete();
                    };
                };
                addCommands();
                HelperBot.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: {
                            content: "`I Have Reloaded The Commands In All Servers!`"
                        }
                    }
                });
                break;
            case 'info':
                switch (args[0].name) {
                    case 'server':
                        var server = HelperBot.guilds.cache.get(interaction.guild_id);
                        var serverOwner = HelperBot.users.cache.get(server.ownerID);
                        var embed = new Discord.MessageEmbed()
                            .addFields(
                                { name: 'Owner', value: `\`${serverOwner.tag}\``, inline: true },
                                { name: 'Members', value: `\`${server.memberCount}\``, inline: true },
                                { name: 'Creation date', value: `\`${server.createdAt.toDateString()}\``, inline: true },
                                { name: 'Creation time', value: `\`${server.createdAt.toLocaleTimeString()}\``, inline: true },
                                { name: 'ID', value: `\`${server.id}\``, inline: true },
                                { name: 'Region', value: `\`${server.region}\``, inline: true }
                            )
                            .setAuthor(`${server.name}`)
                            .setThumbnail(`${server.iconURL()}`)
                            .setColor('#4B8CFF');
                        break;
                    case 'member':
                        var user = HelperBot.users.cache.get(args[0].options[0].value);
                        var avatar = "http://beeimg.com/images/p55408786611.png"
                        if (user.avatarURL() != null) var avatar = user.avatarURL();
                        var embed = new Discord.MessageEmbed()
                            .setColor('#4B8CFF')
                            .setThumbnail(`${avatar}`)
                            .addFields(
                                { name: 'Username', value: `\`${user.username}\``, inline: true },
                                { name: 'discriminator', value: `\`${user.discriminator}\``, inline: true },
                                { name: 'Join date', value: `\`${user.createdAt.toDateString()}\``, inline: true },
                                { name: 'Join time', value: `\`${user.createdAt.toLocaleTimeString()}\``, inline: true },
                                { name: 'ID', value: `\`${user.id}\``, inline: true },
                                { name: 'Is a bot', value: `\`${user.bot}\``, inline: true }
                            );
                        break;
                    case 'channel':
                        var channel = HelperBot.channels.cache.get(args[0].options[0].value);
                        if (channel.parentID == null) {
                            var embed = new Discord.MessageEmbed()
                                .setColor('#4B8CFF')
                                .addFields(
                                    { name: 'Name', value: `\`${channel.name}\``, inline: true },
                                    { name: 'ID', value: `\`${channel.id}\``, inline: true },
                                    { name: 'Created date', value: `\`${channel.createdAt.toDateString()}\``, inline: true },
                                    { name: 'Created time', value: `\`${channel.createdAt.toLocaleTimeString()}\``, inline: true },
                                    { name: 'Parent', value: `\`${channel.parent.name}\``, inline: true },
                                    { name: 'Type', value: `\`${channel.type}\``, inline: true }
                                );
                        } else {
                            var embed = new Discord.MessageEmbed()
                                .setColor('#4B8CFF')
                                .addFields(
                                    { name: 'Name', value: `\`${channel.name}\``, inline: true },
                                    { name: 'ID', value: `\`${channel.id}\``, inline: true },
                                    { name: 'Created date', value: `\`${channel.createdAt.toDateString()}\``, inline: true },
                                    { name: 'Created time', value: `\`${channel.createdAt.toLocaleTimeString()}\``, inline: true },
                                    { name: 'Parent', value: `\`${channel.parent.name}\``, inline: true },
                                    { name: 'Parent ID', value: `\`${channel.parent.id}\``, inline: true },
                                    { name: 'Type', value: `\`${channel.type}\``, inline: true }
                                );
                        }
                        break;
                };
                HelperBot.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: await createAPIMessage(interaction, embed)
                    }
                });
                break;
            case 'evidence':
                switch (args[0].name) {
                    case 'player':
                        var server = HelperBot.guilds.cache.get('838849999973515334');
                        switch (args[0].options.find(arg => arg.name == 'private').value) {
                            case true:
                                if (args[0].options.length == 3) {
                                    server.channels.create(args[0].options.find(arg => arg.name == 'gamertag').value, {
                                        type: 'text',
                                        parent: HelperBot.channels.cache.get('841860448785661962'),
                                        position: 0,
                                        topic: `Discord Tag: ${args[0].options.find(arg => arg.name == 'discord-tag').value}\nXbox Gamertag: ${args[0].options.find(arg => arg.name == 'gamertag').value}`,
                                        permissionOverwrites: [
                                            {
                                                id: server.roles.everyone,
                                                deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                                            },
                                            {
                                                id: interaction.member.user.id,
                                                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                                            }
                                        ]
                                    });
                                } else {
                                    server.channels.create(args[0].options.find(arg => arg.name == 'gamertag').value, {
                                        type: 'text',
                                        parent: HelperBot.channels.cache.get('841860448785661962'),
                                        position: 0,
                                        topic: `${args[0].options.find(arg => arg.name == 'gamertag').value}: Doesn't Have Discord\nXbox Gamertag: ${args[0].options.find(arg => arg.name == 'gamertag').value}`,
                                        permissionOverwrites: [
                                            {
                                                id: server.roles.everyone,
                                                deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                                            },
                                            {
                                                id: interaction.member.user.id,
                                                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                                            }
                                        ]
                                    });
                                };
                                break;
                            case false:
                                if (args[0].options.length == 3) {
                                    server.channels.create(args[0].options.find(arg => arg.name == 'gamertag').value, {
                                        type: 'text',
                                        parent: HelperBot.channels.cache.get('841860448785661962'),
                                        position: 0,
                                        topic: `Discord Tag: ${args[0].options.find(arg => arg.name == 'discord-tag').value}\nXbox Gamertag: ${args[0].options.find(arg => arg.name == 'gamertag').value}`
                                    });
                                } else {
                                    server.channels.create(args[0].options.find(arg => arg.name == 'gamertag').value, {
                                        type: 'text',
                                        parent: HelperBot.channels.cache.get('841860448785661962'),
                                        position: 0,
                                        topic: `${args[0].options.find(arg => arg.name == 'gamertag').value}: Doesn't Have Discord\nXbox Gamertag: ${args[0].options.find(arg => arg.name == 'gamertag').value}`
                                    });
                                };
                                break;
                        };
                        HelperBot.api.interactions(interaction.id, interaction.token).callback.post({
                            data: {
                                type: 4,
                                data: {
                                    content: `✅ Success The Channel For Collecting Evidence on ${args[0].options.find(arg => arg.name == 'gamertag').value} Is Now Ready`,
                                    flags: '64'
                                }
                            }
                        });
                        break;
                    case 'add':
                        var channel = HelperBot.channels.cache.get(interaction.channel_id);
                        if (channel.parentID != '841860448785661962') return;
                        var variables = channel.topic.split('\n');
                        var filter = m => m.author.id == interaction.member.user.id;
                        var collector = channel.createMessageCollector(filter, { time: 60000 });
    
                        collector.on('collect', m => {
                            var gamertag = variables[1].split(': ')[1];
                            var attachment = m.attachments
                            var attachment = attachment.array()[0].url
                            if (attachment.endsWith('.mp4')) {
                                var embed = new Discord.MessageEmbed()
                                    .setURL(attachment)
                                    .setColor('#FAFF64')
                                    .setTitle(args[0].options.find(arg => arg.name == 'name').value)
                                    .setAuthor(gamertag)
                                    .setTimestamp()
                                    .setDescription(args[0].options.find(arg => arg.name == 'description').value)
                                    .setFooter(`${args[0].options.find(arg => arg.name == 'evidence-date').value} at ${args[0].options.find(arg => arg.name == 'evidence-time').value}`)
                                m.reply(embed)
                            } else if (attachment.endsWith('.png') || attachment.endsWith('.jpeg') || attachment.endsWith('.jpg') || attachment.endsWith('.png')) {
                                var embed = new Discord.MessageEmbed()
                                    .setURL(attachment)
                                    .setColor('#FAFF64')
                                    .setImage(attachment)
                                    .setTitle(args[0].options.find(arg => arg.name == 'name').value)
                                    .setAuthor(gamertag)
                                    .setTimestamp()
                                    .setDescription(args[0].options.find(arg => arg.name == 'description').value)
                                    .setFooter(`${args[0].options.find(arg => arg.name == 'evidence-date').value} at ${args[0].options.find(arg => arg.name == 'evidence-time').value}`)
                                m.delete()
                                m.channel.send(embed)
                            };
                            collector.stop();
                        });
                        HelperBot.api.interactions(interaction.id, interaction.token).callback.post({
                            data: {
                                type: 4,
                                data: {
                                    flags: '64',
                                    content: "You Have 60 seconds to post the evidence!"
                                }
                            }
                        });
                        break;
                    case 'log':
                        var channel = HelperBot.channels.cache.get(interaction.channel_id);
                        if (channel.parentID != '841860448785661962') return;
                        var variables = channel.topic.split('\n');
                        var gamertag = variables[1].split(': ')[1];
                        switch (args[0].options[0].name) {
                            case 'ban':
                                var embed = new Discord.MessageEmbed()
                                    .setColor('#FF6464')
                                    .setTitle('BAN')
                                    .setAuthor(gamertag)
                                    .setTimestamp()
                                    .addFields({ name: "Ban Length", value: `\`${args[0].options[0].options.find(arg => arg.name == 'length').value}\``, inline: true })
                                    .setDescription(args[0].options[0].options.find(arg => arg.name == 'reason').value)
                                    .setFooter(`${args[0].options[0].options.find(arg => arg.name == 'ban-date').value} at ${args[0].options[0].options.find(arg => arg.name == 'ban-time').value}`);
                                channel.send(embed);
                                HelperBot.api.interactions(interaction.id, interaction.token).callback.post({
                                    data: {
                                        type: 4,
                                        data: {
                                            content: `✅ Success The Ban On ${gamertag} Has Been Logged!`,
                                            flags: '64'
                                        }
                                    }
                                });
                                break;
                            case 'unban':
                                var embed = new Discord.MessageEmbed()
                                    .setColor('#64FF7D')
                                    .setTitle('UNBAN')
                                    .setAuthor(gamertag)
                                    .setTimestamp()
                                    .addFields({ name: "Ban Length", value: `\`${args[0].options[0].options.find(arg => arg.name == 'ban-length').value}\``, inline: true })
                                    .setDescription(args[0].options[0].options.find(arg => arg.name == 'reason').value)
                                    .setFooter(`${args[0].options[0].options.find(arg => arg.name == 'unban-date').value} at ${args[0].options[0].options.find(arg => arg.name == 'unban-time').value}`);
                                channel.send(embed);
                                HelperBot.api.interactions(interaction.id, interaction.token).callback.post({
                                    data: {
                                        type: 4,
                                        data: {
                                            content: `✅ Success The Unban On ${gamertag} Has Been Logged!`,
                                            flags: '64'
                                        }
                                    }
                                });
                                break;
                            case 'other':
                                var embed = new Discord.MessageEmbed()
                                    .setColor('#64BDFF')
                                    .setTitle(args[0].options[0].options.find(arg => arg.name == 'log-message').value)
                                    .setAuthor(gamertag)
                                    .setTimestamp()
                                    .setDescription(args[0].options[0].options.find(arg => arg.name == 'log-details').value)
                                    .setFooter(`${args[0].options[0].options.find(arg => arg.name == 'log-date').value} at ${args[0].options[0].options.find(arg => arg.name == 'log-time').value}`);
                                channel.send(embed);
                                HelperBot.api.interactions(interaction.id, interaction.token).callback.post({
                                    data: {
                                        type: 4,
                                        data: {
                                            content: `✅ Success The Log On ${gamertag} Has Been Logged!`,
                                            flags: '64'
                                        }
                                    }
                                });
                                break;
                        };
                        break;
                };
                break;
    
        };
    },
    async createAPIMessage(interaction, content) {
        const apiMessage = await Discord.APIMessage.create(HelperBot.channels.resolve(interaction.channel_id), content).resolveData().resolveFiles();
        return { ...apiMessage.data };
    },
    async getIP() {
        var ip = JSON.parse(await ipify({ endpoint: "https://api.ipify.org?format=json", useIPv6: true })).ip;
        return ip
    },
    async rCon(command) {
        serverRCON.connect().then(() => serverRCON.run(command)).catch((error) => {
            console.error(error);
        });
    },
};