const api = require("../../core/api")
const Discord = require("discord.js")
const simpleCommand = require("../../core/simpleCommand")

module.exports = new simpleCommand(
    async(message, args, client, addCD) => {
        var user = message.mentions.users.first()

        if (user) {
            if (user.id == message.author.id) {
                const embed = new Discord.MessageEmbed()
                    .setColor('#5d369d')
                    .setTitle("You can't steal from yourself dumdum")

                message.channel.send({embeds: [embed]})
            } else {
                api.getUser(message.author.id)
                    .then((mainuser) => {
                        if (mainuser.passive){
                            const embed = new Discord.MessageEmbed()
                                .setColor('#5d369d')
                                .setTitle("Passive mode")
                                .setDescription(mainuser.name + ", you cannot rob with Passive Mode enabled.")
                            return message.channel.send({embeds: [embed]})
                        }
                        if (mainuser.bal < 1000) {
                            const embed = new Discord.MessageEmbed()
                                .setColor('#5d369d')
                                .setTitle("Not enough money")
                                .setDescription("You need at least `1000` coins to rob from someone\nYou currently have `" + mainuser.bal + "`")
                            message.channel.send({embeds: [embed]})
                        } else {


                            api.getUser(user.id)
                                .then((taguser) => {
                                    if(taguser.passive){
                                        const embed = new Discord.MessageEmbed()
                                            .setColor('#5d369d')
                                            .setTitle("Passive mode")
                                            .setDescription(taguser.name + " has passive mode enabled.")
                                        return message.channel.send({embeds: [embed]})
                                    }
                                    if (taguser.bal < 1000) {
                                        const embed = new Discord.MessageEmbed()
                                            .setColor('#5d369d')
                                            .setTitle("Not enough money")
                                            .setDescription(taguser.name + " doesnt have even `1000` coins!\nNot worth it man")
                                        message.channel.send({embeds: [embed]})
                                    } else {
                                        api.checkCool(message.author.id, "l" + message.author.id + user.id)
                                            .then((cooldown) => {
                                                if (cooldown.cooldown) {
                                                    const embed = new Discord.MessageEmbed()
                                                        .setColor('#5d369d')
                                                        .setTitle("Cooldown")
                                                        .setDescription("You just robbed " + taguser.name + "\nYou can rob them again in `" + api.convertMS(cooldown.msleft) + "`")
                                                    message.channel.send({embeds: [embed]})
                                                } else {

                                                    if (Math.random() <= 0.6) {
                                                        var maxSteal = 10000000
                                                        var toSteal = Math.floor(Math.floor(Math.random() * 10) + 1 == 10 ? (taguser.bal >= maxSteal ? maxSteal : taguser.bal) * getRandomInt(5, 8) / 100 : (taguser.bal >= maxSteal ? maxSteal : taguser.bal) * (Math.floor(Math.random() * 10) + 1) / 100)
                                                        api.changeBal(message.author.id, toSteal)
                                                            .then(() => {
                                                                api.changeBal(user.id, -toSteal)
                                                                    .then(() => {
                                                                        const embed = new Discord.MessageEmbed()
                                                                            .setColor('#5d369d')
                                                                            .setTitle("Steal Results for " + mainuser.name)
                                                                            .setDescription("You stole `" + toSteal + "` coins!")
                                                                        message.channel.send({embeds: [embed]})
                                                                        api.addCool(message.author.id, "l" + message.author.id + user.id, 3600000)
                                                                    })
                                                            })

                                                    } else {

                                                        var userbal = mainuser.bal
                                                        var moneyTaken = Math.floor(Math.floor((Math.random() * +(Math.random() * 100 / 100).toFixed(2)) + 1) / 100 * userbal > 100000 ? 100000 : Math.floor((Math.random() * 3) + 1) / 100 * userbal)

                                                        api.changeBal(message.author.id, -moneyTaken)
                                                            .then(() => {
                                                                api.changeBal(user.id, moneyTaken)
                                                                    .then(() => {
                                                                        const embed = new Discord.MessageEmbed()
                                                                            .setColor('#5d369d')
                                                                            .setTitle("Steal Results for " + mainuser.name)
                                                                            .setDescription("YOU WERE CAUGHT **AHHHHHH***\nYou had to give `" + moneyTaken + "` to " + taguser.name)
                                                                        message.channel.send({embeds: [embed]})
                                                                        api.addCool(message.author.id, "l" + message.author.id + user.id, 3600000)
                                                                    })
                                                            })
                                                    }
                                                }
                                            })
                                    }
                                })
                                .catch((err) => {
                                    if (err.type == 0) {
                                        const embed = new Discord.MessageEmbed()
                                            .setColor('#5d369d')
                                            .setTitle("The user you tagged isnt in our database! Make them say something and then try again")
                                        message.channel.send({embeds: [embed]})
                                    } else {
                                        message.channel.send("Something went wrong. Pls try again")
                                    }
                                })
                        }
                    })
                    .catch((err) => {
                        if (err.type == 0) {
                            const embed = new Discord.MessageEmbed()
                                .setColor('#5d369d')
                                .setTitle("You doesnt have an account!")
                            message.channel.send({embeds: [embed]})
                        } else {
                            message.channel.send("Something went wrong. Pls try again")
                        }
                    })
            }
        } else {
            message.channel.send("Please tag a user to steal from!\nUsage: `>rob <@user>`")
        }


    }, {
        name: "rob",
        aliases: ["rob", "steal", "take", "thieve"],
        cooldown: 0,
        cooldownMessage: "",
        perms: [],
        description: "Rob a user for their money! But be careful, you might get caught and have to pay them...",
        usage: "{prefix}{command} <@user>"
    }
)