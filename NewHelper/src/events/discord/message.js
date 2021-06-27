const { HelperBot, db } = require('../../../config/var.js');
module.exports = async (message) => {
    if (message.content.startsWith('~code: ')) {
        var code = message.content.slice(7);
        if (message.author.id == '472943896045944854') { eval(code); } else {
            var embed = new Discord.MessageEmbed()
                .setColor('#FF4B4B')
                .setAuthor(message.author.tag, message.author.avatarURL())
                .setDescription(`<@${message.author.id}> You can't run code on me why would you try that!`);
            message.channel.send(embed);
        };
    return;
    } else if (message.author.bot && (message.channel.type == 'dm')) {
        return message.react('🗑️');
    } else if (!message.author.bot && message.channel.type == "dm" && message.content.toLocaleLowerCase().includes('ip') && (message.author.id == '472943896045944854' || message.author.id == '738138588172255312')) {
        var ip = await getIP();
        var embed = new Discord.MessageEmbed()
            .setAuthor('IP uses')
            .setColor('#78E1C8')
            .addFields(
                { name: "Webserver", value: `[http://${ip}:${port}](http://${ip}:${port})` },
                { name: "Minecraft Server", value: `${ip}:25220` }
            );
        await message.channel.send(embed).then(msg => {
            setTimeout(() => { msg.delete() }, 10000);
        });
    return;
    } else if (Object.keys(`/guilds`).includes(message.guild.id)) {
        const prefix = db.getData(`/guilds/${message.guild.id}/prefix`);
        if (!message.content.startsWith(prefix)) return;
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        switch (command) {
            case 'play':
                if (!HelperPlayer.getQueue(message) || !HelperPlayer.getQueue(message).paused) {
                    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} You Are Not In The Same Voice Channel!` } });
                    if (!args[0]) return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} Please Indicate The Title Of The Track!` } });
                    HelperPlayer.play(message, args.join(" "), { firstResult: true });
                } else {
                    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} You Are Not In The Same Voice Channel!` } });
                    if (!HelperPlayer.getQueue(message)) return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} No Track Is Playing!` } });
                    if (HelperPlayer.resume(message)) message.channel.send({ embed: { color: botConfig.colors.success, thumbnail: { url: HelperPlayer.nowPlaying(message).thumbnail }, description: `${botConfig.emojis.play} **Track [\`${HelperPlayer.nowPlaying(message).title}\`](${HelperPlayer.nowPlaying(message).url}) Has Resumed!**\n${HelperPlayer.createProgressBar(message, { timecodes: true })}` } });
                };
                break;
            case 'pause':
                if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} You Are Not In The Same Voice Channel!` } });
                if (!HelperPlayer.getQueue(message)) return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} No Track Is Currenty Playing` } });
                if (HelperPlayer.getQueue(message).paused) return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} The Track Is Already Paused` } });
                if (HelperPlayer.pause(message)) message.channel.send({ embed: { color: botConfig.colors.success, footer: { text: 'Use "-play" To Resume The Track!' }, thumbnail: { url: HelperPlayer.nowPlaying(message).thumbnail }, description: `${botConfig.emojis.pause} **Track [\`${HelperPlayer.getQueue(message).playing.title}\`](${HelperPlayer.nowPlaying(message).url}) Is Now Paused**!\n${HelperPlayer.createProgressBar(message, { timecodes: true })}` } });
                break;
            case 'np':
                if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} You Are Not In The Same Voice Channel!` } });
                if (!HelperPlayer.getQueue(message)) return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} No Track Is Currently Playing!` } });
                var track = HelperPlayer.nowPlaying(message);
                const filters = [];
                Object.keys(HelperPlayer.getQueue(message).filters).forEach((filterName) => HelperPlayer.getQueue(message).filters[filterName]) ? filters.push(filterName) : false;
                message.channel.send({
                    embed: {
                        color: botConfig.colors.event,
                        author: { name: track.title, url: track.url },
                        fields: [
                            { name: 'Channel', value: `\`${track.author}\``, inline: true },
                            { name: 'Requested by', value: `<@${track.requestedBy.id}>`, inline: true },
                            { name: 'Views', value: `\`${track.views.toLocaleString()}\``, inline: true },
        
                            { name: 'Volume', value: `\`${HelperPlayer.getQueue(message).volume}%\``, inline: true },
                            { name: 'Repeat mode', value: `\`${HelperPlayer.getQueue(message).repeatMode ? 'Yes' : 'No'}\``, inline: true },
                            { name: 'Currently paused', value: `\`${HelperPlayer.getQueue(message).paused ? 'Yes' : 'No'}\``, inline: true },
        
                            { name: 'Progress bar', value: `${HelperPlayer.createProgressBar(message, { timecodes: true })}`, inline: true }
                        ],
                        thumbnail: { url: track.thumbnail },
                        timestamp: new Date(),
                    },
                });
                break;
            case 'queue':
                if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} You Are Not In The Same Voice Channel!` } });
                if (!HelperPlayer.getQueue(message)) return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} No Track Is Currently Playing!` } });
                var queue = HelperPlayer.getQueue(message);
                if (args.length == 0) { message.channel.send({ embed: { color: botConfig.colors.event, thumbnail: { url: HelperPlayer.nowPlaying(message).thumbnail }, description: `${botConfig.emojis.play}**Current Track:** Title: [\`${queue.playing.title}\`](${queue.playing.url}) | By: \`${queue.playing.author}\` | Requested By: <@${queue.playing.requestedBy.id}>\n${botConfig.emojis.queue} **QUEUE:**\n${queue.tracks.map((track, i) => `**#${i}** - Title: [\`${track.title}\`](${track.url}) | By: \`${track.author}\` | Requested By: <@${track.requestedBy.id}>`).slice(1, 11).join('\n')}\n\nThere ${queue.tracks.length == 11 ? `Is \`1\` More Track For A Total Of \`11\` Tracks!` : `Are \`${queue.tracks.length > 11 ? queue.tracks.length - 11 : '0'}\` More Tracks For A Total Of \`${queue.tracks.length}\` Track${queue.tracks.length == 1 ? '' : 's'}!`}`, author: { name: `${message.guild.name}${message.guild.name.endsWith('s') ? '\'' : '\'s'} queue ${queue.loopMode ? '- (looped)' : ''}` } } }); } else {
                    if (isNaN(args[0]) || args[0].toLocaleLowerCase() === 'infinity' || parseInt(args[0] == 0)) return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} You Need To Enter A Vaild Number!` } });
                    message.channel.send({ embed: { color: botConfig.colors.event, thumbnail: { url: HelperPlayer.nowPlaying(message).thumbnail }, description: `${botConfig.emojis.play}**Current Track:** Title: [\`${queue.playing.title}\`](${queue.playing.url}) | By: \`${queue.playing.author}\` | Requested By: <@${queue.playing.requestedBy.id}>\n${botConfig.emojis.queue} **QUEUE:**\n${queue.tracks.map((track, i) => `**#${i}** - Title: [\`${track.title}\`](${track.url}) | By: \`${track.author}\` | Requested By: <@${track.requestedBy.id}>`).slice(((parseInt(args[0] * 10) + 1)), ((parseInt(args[0] * 10) + 11))).join('\n')}\n\nNow Displaying Page \`${args[0]}\`, Total Tracks: \`${queue.tracks.length}\`!`}, author: { name: `${message.guild.name}${message.guild.name.endsWith('s') ? '\'' : '\'s'} queue ${queue.loopMode ? '- (looped)' : ''}` } });
                };
                break;
            case 'skip':
                if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} You Are Not In The Same Voice Channel!` } });
                if (!HelperPlayer.getQueue(message)) return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} No Track Is Currently Playing!` } });
                if (HelperPlayer.skip(message)) message.channel.send({ embed: { color: botConfig.colors.success, description: `${botConfig.emojis.next_track} The Current Track Has Been Skipped!` } });
                break;
            case 'volume':
                if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} You Are Not In The Same Voice Channel!` } });
                if (!args[0] || isNaN(args[0]) || args[0].toLocaleLowerCase() === 'infinity') return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} You Need To Enter A Vaild Number!` } });
                if (Math.round(parseInt(args[0])) < 1 || Math.round(parseInt(args[0])) > 1000) return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} You Need To Enter A Vaild Number Between 1 and 1000!` } });
                if (HelperPlayer.setVolume(message, parseInt(args[0]))) message.channel.send({ embed: { color: botConfig.colors.success, description: `${botConfig.emojis.volume} The Players Volume Has Been Set To **\`${args[0]}%\`**!` } });
                break;
            case 'loop':
                if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} You Are Not In The Same Voice Channel!` } });
                if (!HelperPlayer.getQueue(message)) return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} No Track Is Currently Playing!` } });
                if (!args[0]) return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} No loop medium was specified!` } });
                if (args[0].toLowerCase() == 'track') {
                    if (HelperPlayer.getQueue(message).repeatMode) {
                        HelperPlayer.setRepeatMode(message, false);
                        message.channel.send({ embed: { color: botConfig.colors.success, thumbnail: { url: HelperPlayer.nowPlaying(message).thumbnail }, description: `${botConfig.emojis.loop} Loop Mode For \`${HelperPlayer.nowPlaying(message).title}\` Has Been **\`DISABLED\`**!` } });
                    } else {
                        HelperPlayer.setRepeatMode(message, true);
                        message.channel.send({ embed: { color: botConfig.colors.success, thumbnail: { url: HelperPlayer.nowPlaying(message).thumbnail }, description: `${botConfig.emojis.loop} Loop Mode For \`${HelperPlayer.nowPlaying(message).title}\` Has Been **\`ENABLED\`**!` } });
                    };
                } else if (args[0].toLowerCase() == 'queue') {
                    if (HelperPlayer.getQueue(message).loopMode) {
                        HelperPlayer.setLoopMode(message, false);
                        message.channel.send({ embed: { color: botConfig.colors.success, description: `${botConfig.emojis.loop} Loop Mode For The Queue Has Been **\`DISABLED\`**!` } });
                    } else {
                        HelperPlayer.setLoopMode(message, true);
                        message.channel.send({ embed: { color: botConfig.colors.success, description: `${botConfig.emojis.loop} Loop Mode For The Queue Has Been **\`ENABLED\`**!` } });
                    };
                };
                break;
            case 'search':
                if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} You Are Not In The Same Voice Channel!` } });
                if (!args[0]) return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} Please Indicate The Title Of The Track!` } });
                HelperPlayer.play(message, args.join(' '));
                break;
            case 'position':
                if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} You Are Not In The Same Voice Channel!` } });
                const timeString = args[0].split(':');
                var duration = HelperPlayer.nowPlaying(message).durationMS;
                var time = 0;
                switch (timeString.length) {
                    case 1:
                        var time = Math.floor(time + (timeString[0] * 1000));
                        if (time >= duration) { var time = duration };
                        break;
                    case 2:
                        var time = Math.floor(time + (timeString[1] * 1000));
                        var time = Math.floor(time + (timeString[0] * 60000));
                        if (time >= duration) { var time = duration };
                        break;
                    case 3:
                        var time = Math.floor(time + (timeString[2] * 1000));
                        var time = Math.floor(time + (timeString[1] * 60000));
                        var time = Math.floor(time + (timeString[0] * 3600000));
                        if (time >= duration) { var time = duration };
                        break;
                    default:
                        for (i = timeString.length; i > 3; i--) {
                            timeString.shift();
                        };
                        var time = Math.floor(time + (timeString[2] * 1000));
                        var time = Math.floor(time + (timeString[1] * 60000));
                        var time = Math.floor(time + (timeString[0] * 3600000));
                        if (time >= duration) { var time = duration };
                        break;
                };
                var seconds = Math.floor(time / 1000);
                var minutes = 0;
                var hours = 0;
                for (seconds; seconds >= 60; seconds = (seconds - 60)) {
                    minutes++;
                };
                for (minutes = minutes; minutes >= 60; minutes = (minutes - 60)) {
                    hours++;
                };
                if (HelperPlayer.setPosition(message, time)) message.channel.send({ embed: { color: botConfig.colors.success, thumbnail: { url: HelperPlayer.nowPlaying(message).thumbnail }, description: `${botConfig.emojis.seek} I Have Set The Current Playing Position To: ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds!` } });
                break;
            case 'join':
                if (message.guild.me.voice.channel && message.member.voice.channel.id == message.guild.me.voice.channel.id) return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} You Are In The Same Voice Channel!` } });
                if (message.member.voice.channel.join()) message.channel.send({ embed: { color: botConfig.colors.success, description: `${botConfig.emojis.success} I Have Joined The Channel <#${message.member.voice.channel.id}>!` } });
                break;
            case 'leave':
                if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} You Are Not In The Same Voice Channel!` } });
                if (message.guild.me.voice.channel.leave()) message.channel.send({ embed: { color: botConfig.colors.success, description: `${botConfig.emojis.success} I Have Left The Voice Channel And Closed The Queue!` } });
                break;
            case 'stop':
                if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} You Are Not In The Same Voice Channel!` } });
                if (HelperPlayer.stop(message)) message.channel.send({ embed: { color: botConfig.colors.success, description: `${botConfig.emojis.success} I Have Stopped The Player And Cleared The Queue!` } });
                break;
            case 'replay':
                if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} You Are Not In The Same Voice Channel!` } });
                if (HelperPlayer.setPosition(message, 0)) message.channel.send({ embed: { color: botConfig.colors.success, description: `${botConfig.emojis.success} I Have Restarted The Track!` } });
                break;
            case 'previous':
                if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} You Are Not In The Same Voice Channel!` } });
                if (HelperPlayer.back(message)) message.channel.send({ embed: { color: botConfig.colors.success, thumbnail: HelperPlayer.nowPlaying(message).thumbnail, description: `${botConfig.emojis.previous_track} Playing The Previous Track!` } });
                break;
            case 'shuffle':
                if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} You Are Not In The Same Voice Channel!` } });
                if (HelperPlayer.shuffle(message)) message.channel.send({ embed: { color: botConfig.colors.success, description: `${botConfig.emojis.success} I Have Shuffled The Queue!` } });
                break;
            case 'remove':
                if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} You Are Not In The Same Voice Channel!` } });
                if (!args[0] || isNaN(args[0]) || args[0].toLocaleLowerCase() === 'infinity') return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} You Need To Enter A Vaild Number!` } });
                var queue = HelperPlayer.getQueue(message);
                if (Math.round(parseInt(args[0])) > queue.tracks.length)  return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} You Need To Enter A Track Number From 1 And ${queue.tracks.length}!` } });
                var track = queue.tracks[Math.round(parseInt(args[0]))];
                if (HelperPlayer.remove(message, Math.round(parseInt(args[0])))) message.channel.send({ embed: {
                    color: botConfig.colors.event,
                    author: { name: track.title, url: track.url },
                    description: `${botConfig.emojis.success} I Have Removed That Track From The Queue!`,
                    fields: [
                        { name: 'Channel', value: `\`${track.author}\``, inline: true },
                        { name: 'Requested By', value: `<@${track.requestedBy.id}>`, inline: true },
                        { name: 'Views', value: `\`${track.views.toLocaleString()}\``, inline: true },
    
                        { name: 'Duration', value: `\`${track.duration}\``, inline: true },
                        { name: 'From Playlist', value: `\`${track.fromPlaylist ? 'Yes' : 'No'}\``, inline: true },
                        { name: 'Position In Queue', value: `\`${args[0]}\``, inline: true }
                    ],
                    thumbnail: { url: track.thumbnail },
                    timestamp: new Date(),
                }});
                break;
            case 'info':
                if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} You Are Not In The Same Voice Channel!` } });
                if (!args[0] || isNaN(args[0]) || args[0].toLocaleLowerCase() === 'infinity') return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} You Need To Enter A Vaild Number!` } });
                if (Math.round(parseInt(args[0])) < 1 || Math.round(parseInt(args[0])) > 1000) return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} You Need To Enter A Vaild Number Between 1 and 1000!` } });
                var queue = HelperPlayer.getQueue(message);
                if (Math.round(parseInt(args[0])) > queue.tracks.length) return message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} You Need To Enter A Track Number From 1 And ${queue.tracks.length}!` } });
                var track = queue.tracks[Math.round(parseInt(args[0]))];
                message.channel.send({ embed: {
                        color: botConfig.colors.event,
                        author: { name: track.title, url: track.url },
                        fields: [
                            { name: 'Channel', value: `\`${track.author}\``, inline: true },
                            { name: 'Requested By', value: `<@${track.requestedBy.id}>`, inline: true },
                            { name: 'Views', value: `\`${track.views.toLocaleString()}\``, inline: true },
        
                            { name: 'Duration', value: `\`${track.duration}\``, inline: true },
                            { name: 'From Playlist', value: `\`${track.fromPlaylist ? 'Yes' : 'No'}\``, inline: true },
                            { name: 'Position In Queue', value: `\`${args[0]}\``, inline: true }
                        ],
                        thumbnail: { url: track.thumbnail },
                        timestamp: new Date(),
                    }});
                break;
            case 'config':
                switch (args[0].toLowerCase()) {
                    case 'prefix':
                        db.delete(`guilds/${message.guild.id}/prefix`)
                        db.push(`guilds/${message.guild.id}/prefix`, args[1]);
                        message.guild.me.setNickname(`${HelperBot.user.username} (${args[1]})`);
                        await db.reload();
                        break;
                    default:
                        message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} Command Not Found Use "${prefix}help"` } });
                };
                break;
            case 'help':
                args.push('main')
                switch (args[0].toLowerCase()) {
                    case 'music':
                        var commands = ['play', 'pause', 'np', 'queue', 'skip', 'volume', 'loop', 'search', 'position', 'join', 'leave', 'stop', 'replay', 'previous', 'shuffle', 'remove', 'info'];
                        var descriptions = ['Play / Add A Track Usage: `(prefix)play [Title / URL]` ─ Resume Playing: `(prefix)play`', 'Pause Current Track Usage: `(prefix)pause`', 'Now Playing Info Usage: `(prefix)np`', 'Server Queue Usage: `(prefix)queue` ─ Server Queue Page Usage: `(prefix)queue [page number]`', 'Skip Track Usage: `(prefix)skip`', 'Change Volume Usage: `(prefix)volume [1(prefix)1000]`', 'Loop The Queue Usage: `(prefix)loop queue` ─ Loop Track Usage: `(prefix)loop track`', 'Search By Title Usage: `(prefix)search [title]`', 'Change The Playing Time Usage: `(prefix)position [hours]:[minutes]:[seconds]`', 'Join The Voice Channel Usage: `(prefix)join`', 'Leave The Voice Channel Usage: `(prefix)leave`', 'End Playing And Clear Queue Usage: `(prefix)stop`', 'Restart Current Track Usage: `(prefix)replay`', 'Play Previous Track Usage: `(prefix)previous`', 'Shuffle The Queue Usage: `(prefix)shuffle`', 'Remove A Track Usage: `(prefix)remove [track number in queue]`', 'Get Track Info Usage: `(prefix)info [track number in queue]`'];
                        message.channel.send({ embed: {
                            color: botConfig.colors.event,
                            author: { name: 'Helper Music Commands' },
                            footer: { text: `Prefix: "${prefix}"` },
                            timestamp: new Date(),
                            description: `${commands.map((m, i) => `**${m.toUpperCase()}:**\n${descriptions[i]}`).join(`\n`)}`
                        }});
                        break;
                    case 'config':
                        var commands = ['prefix']
                        var descriptions = ['Change The Prefix Usage: `(prefix)botConfig prefix [the new prefix]`'];
                        message.channel.send({ embed: {
                            color: botConfig.colors.event,
                            author: { name: 'Helper botConfig Commands' },
                            footer: { text: `Prefix: "${prefix}"` },
                            timestamp: new Date(),
                            description: `${commands.map((m, i) => `**${m.toUpperCase()}:**\n${descriptions[i]}`).join(`\n`)}`
                        }});
                        break;
                    case 'about':
                        message.channel.send({ embeds: [ {
                            color: botConfig.colors.event,
                            author: { name: 'Helper About Page' },
                            timestamp: new Date(),
                            description: `Hello I Am <@${HelperBot.user.id}> A Bot Created By ${HelperBot.users.cache.get('472943896045944854').tag} As A Better Alternative to MEE6 I Can Be Found On ('GitHub')['https://github.com/NickJ-7010/Discord'] Where A Current Stable Version Of My Code Can Be Found!\n**CURRENT FEATURES:**`,
                            fields: [
                                { name: '', value: '``', inline: true }
                            ]
                        }]});
                        break;
                    default: message.channel.send()
                        message.channel.send({ embeds: [ {
                            color: botConfig.colors.event,
                            author: { name: 'Helper Commands Pages' },
                            footer: { text: `Prefix: "${prefix}"` },
                            timestamp: new Date(),
                            fields: [
                                { name: 'Music Commands', value: `\`${prefix}help music\``, inline: true },
                                { name: 'botConfig Commands', value: `\`${prefix}help botConfig\``, inline: true },
                                { name: 'Info', value: `\`${prefix}help about\``, inline: true }
                            ]
                        }]});
                        break;
                };
                break;
            case 'test': 
                message.channel.send({ content: "lol", components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                style: 2,
                                label: "YEET!",
                                custom_id: "EA"
                            }
                        ]
                    }
                ], });
                break;
                default:
                message.channel.send({ embed: { color: botConfig.colors.error, description: `${botConfig.emojis.failure} Command Not Found Use "${prefix}help"` } });
                break;
        };
    } else {
        if (Object.keys(db.getData(`/guilds/${message.guild.id}/users`)).includes(message.author.id)) {
            var messages = (db.getData(`/guilds/${message.guild.id}/users/${message.author.id}`).messages + 1);
            var xp = 0;
            var level = 0;
            db.push(`/guilds/${message.guild.id}/users/${message.author.id}`, { messages: messages, xp: xp, level: level })
        };
    };
};