const api = require("../../core/api")
const simpleCommand = require("../../core/simpleCommand")
const Discord = require("discord.js")
module.exports = new simpleCommand(
    async(message, args, client, addCD) => {

        var user = await api.getUser(message.author.id)
        if (!user.hasOwnProperty("pets")) {
            user.pets = {}
        }
        var pet = args.join(" ").toLowerCase()
        if (user.pets.hasOwnProperty(pet)) {
            var petobj = user.pets[pet]
            const embed = new Discord.MessageEmbed()
            .setColor('#5d369d')
                .setTitle("Disowning " + petobj.name)
                .setDescription("Are you sure you want to disown your pet " + petobj.type + " " + petobj.name + "?\nIt will lose all its XP and Levels\nAre you sure?")
                .setFooter("Respond with 'Y' or 'N'\nRespond within 20 seconds!")
            message.channel.send({embeds: [embed]})
            var namexd = petobj.name
            const filter = m => m.author.id === message.author.id;
            const collector = message.channel.createMessageCollector({ filter, max: 1, time: 20000 })
            collector.on("collect", async(message23) => {
                if (message23.content.toLowerCase() == "y" || message23.content.toLowerCase() == "yes" || message23.content.toLowerCase() == "confirm") {

                    delete user.pets[pet]
                    await api.modUser(user.id, user)
                    const embed1 = new Discord.MessageEmbed()
                    .setColor('#5d369d')
                        .setTitle("Disowned " + petobj.name)
                        .setDescription("Goodbye dear friend..")
                        .setFooter("\"I'm sorry it has come to this.. 😭\" - " + namexd)
                    message23.channel.send({embeds: [embed1]})
                    await addCD()
                } else {
                    const embed1 = new Discord.MessageEmbed()
                    .setColor('#5d369d')
                        .setTitle("Operation Canceled")
                        .setDescription("Wait i'm sorry! Come back.")
                        .setFooter("\"I got scared for a second there..\" - " + namexd)
                    message23.channel.send({embeds: [embed1]})
                }
            })
        } else {
            const embed = new Discord.MessageEmbed()
                .setColor('#5d369d')
                .setTitle("You dont have a pet named `" + pet + "`")
                .setAuthor(user.name, message.author.avatarURL())
            message.channel.send({embeds: [embed]})
        }


    }, {
        name: "disown",
        aliases: ["disown"],
        cooldown: 86400000,
        cooldownMessage: "You just disowned a pet! Dont be so cruel to your pets xd\nTry again in **{timeleft}**!",
        perms: ["SEND_MESSAGES"],
        description: "Disown any of your pets! This will remove all their XP and Levels and will remove it from your pets list."
    })