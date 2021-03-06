const api = require("../../core/api")
const simpleCommand = require("../../core/simpleCommand");
const Discord = require("discord.js")
const pets = require('../../json/pets.json')

module.exports = new simpleCommand(
    async(message, args, client, addCD) => {
        var user = await api.getUser(message.author.id)
        if (!user.hasOwnProperty("pets")) {
            user.pets = {}
        }
        if (Object.keys(user.pets).length > 9) {
            message.channel.send("**Are you a crazy cat person! **\nYou have 10 pets already, are you good?")
            return
        }
        var pet = args.join(' ').toLowerCase()
        if (pet != 0) {
            if (pets.hasOwnProperty(pet)) {

                if (Math.round(user.bal / pets[pet][2]) == 0) {
                    const embed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setTitle("Not Enough Coins")
                        .setDescription("You need `" + (user.bal - pets[pet][2]) * -1 + "` more coins to adopt 1 " + pet)
                    message.channel.send({embeds: [embed]})
                } else {
                    var price = pets[pet][2]
                    if (user.bal - price < 0) {

                        console.log(price)
                        const embed = new Discord.MessageEmbed()
                            .setColor('RED')
                            .setTitle("Not Enough Coins")
                            .setDescription("You need `" + (user.bal - price) * -1 + "` more coins to buy 1 " + pet)
                        message.channel.send({embeds: [embed]})
                    } else {
                        const embed = new Discord.MessageEmbed()
                            .setColor('GREEN')
                            .setTitle("Name your " + pet)
                            .setDescription("Enter a name for your new " + pet + "!\nMax 30 characters long!")
                            .setFooter("Please respond within 20 seconds")
                        message.channel.send({embeds: [embed]})
                        const filter = m => m.author.id === message.author.id;
                        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 20000 })
                        collector.on("collect", async(message) => {
                            if (message.content.length > 30) {
                                message.channel.send("**Do you listen?**\nYour pets name is `" + message.content.length + "` characters long.\nThat's " + `\`${message.content.length - 30}\`` + " characters longer than I asked for!")
                            } else {

                                if (user.pets.hasOwnProperty(message.content.toLowerCase())) {
                                    message.channel.send("*Hmmm, that's strange.*\nYou already have a pet " + user.pets[message.content.toLowerCase()].type + " named " + message.content.toLowerCase())
                                } else {
                                    var name = message.content.replace(/ +(?= )/g, '').trim();

                                    //BUY THE pet
                                    user.pets[name.toLowerCase()] = {
                                        type: pet,
                                        name: name,
                                        exp: 0,
                                        level: 0,
                                        adopted: new Date().toLocaleDateString()

                                    }
                                    user.bal = user.bal - price
                                        //Save their new data
                                    await api.modUser(message.author.id, user)
                                    const embed = new Discord.MessageEmbed()
                                        .setColor('GREEN')
                                        .setTitle("Adoption Successful")
                                        .setDescription("Congrats! You adopted a new pet " + pet + " named " + name + " for `" + price + "` coins!\nYour remaining balance is `" + user.bal + "`")
                                        .setFooter("You can view all your pets by typing >pets")
                                    message.channel.send({embeds: [embed]})
                                    await addCD()


                                }
                            }
                        })




                    }
                }
            } else {
                const embed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setTitle("Not found")
                    .setDescription("The pet `" + pet + "` was not found\nType `>petshop` for a list of pets")
                message.channel.send({embeds: [embed]})
            }

        } else {
            const embed = new Discord.MessageEmbed()
                .setColor('RED')
                .setTitle("No pet entered")
                .setDescription("Please use the command like `>adopt <petname>`\nType `>petshop` for a list of pets")
            message.channel.send({embeds: [embed]})
        }


    }, {
        name: "adopt",
        aliases: ["adopt"],
        cooldown: 20000,
        cooldownMessage: "You just adopted a pet!\nYou can adopt another one in **{timeleft}**",
        perms: ["SEND_MESSAGES"],
        description: "Adopt a pet from the petshop! View the list of pets by >petshop",
        usage: "{prefix}{cmd} <petname>"
    }
)