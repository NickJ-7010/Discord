const {  } = require('../../../config/var.js');
module.exports = async (message) => {
    if (message.author.bot && message.channel.parentID == '841860448785661962') {
        var embed = message.embeds[0];
        var fields = embed.fields;
        var image = null
        if (embed.image != null) {
            var image = embed.image.url;
        };
        var embed = new Discord.MessageEmbed()
            .setAuthor(embed.author.name)
            .setTitle(embed.title)
            .setURL(embed.url)
            .setDescription(embed.description)
            .addFields(fields)
            .setImage(image)
            .setColor(embed.color)
            .setFooter(embed.footer.text)
            .setTimestamp(embed.timestamp);
        message.channel.send(embed);
    };
};