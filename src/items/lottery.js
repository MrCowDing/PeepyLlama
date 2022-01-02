const Discord = require('discord.js')
const api = require('../core/api')
module.exports = {

    name: 'lottery',
    use(message, userItem, user) {
        api.checkCool(message.author.id, "lottery")
            .then((cooldown) => {
                if (cooldown.cooldown) {
                    const embed = new Discord.MessageEmbed()
                        .setColor('#5d369d')
                        .setTitle("Cooldown")
                        .setDescription("You just tried the lottery!\nYou can try it again in `" + api.convertMS(cooldown.msleft) + "`")
                    message.channel.send({embeds: [embed]})
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setColor('#5d369d')
                        .setTitle("Enter the Lottery")
                        .setDescription("How many tickets do you want to enter in this lottery?")
                        .setFooter("Respond with a number from 1 - " + userItem.amount + "\nPlease respond within 20 seconds")
                    message.channel.send({embeds: [embed]})
                    const filter = m => m.author.id === message.author.id;
            const collector67 = message.channel.createMessageCollector({ filter, max: 1, time: 20000 })
                    collector67.on("collect", (message23) => {
                        if (isNaN(Number(message23.content)) || Number(message23.content) < 1 || !Number.isInteger(Number(message23.content))) {
                            message23.channel.send("Please enter a valid number... \n Run the command again")
                        } else {
                            amount = Number(message23.content)
                            if (userItem.amount >= amount) {
                                var randm = Math.floor(Math.random() * 100) + 1
                                if (randm == 1) {
                                    var moneyEarned = 100000 * amount
                                    var typ1e = "MEGA MEGA JACKPOT!!!!!🤑🤑🤑🤑"
                                } else if (randm >= 2 && randm <= 9) {
                                    var moneyEarned = 1000 * amount
                                    var typ1e = "JACKPOT!!!!!💰💰💰"
                                } else if (randm >= 70 && randm <= 100) {
                                    var moneyEarned = 250 * amount
                                    var typ1e = "Quik Cash💵💵"
                                } else {
                                    var moneyEarned = 0
                                    var typ1e = "Nothing :("
                                }
                                message.channel.send("WAITING FOR LOTTERY RESULTS!!!")
                                    .then((msg) => {
                                        user.bal = user.bal + moneyEarned
                                        user.inv.lottery.amount = userItem.amount - amount;
                                        if (user.inv.lottery.amount == 0) {
                                            delete user.inv.lottery
                                        }
                                        api.modUser(message.author.id, user)
                                            .then(() => {
                                                setTimeout(() => {
                                                    const embed = new Discord.MessageEmbed()
                                                        .setColor('#5d369d')
                                                        .setTitle("Lottery Results")
                                                        .setDescription("You won " + typ1e + "\nYou got `" + moneyEarned + "` coins!")
                                                    msg.delete()
                                                    msg.channel.send({embeds: [embed]})
                                                    api.addCool(message.author.id, "lottery", 900000)
                                                        .catch(() => {

                                                        })
                                                }, 1000)
                                            })
                                            .catch(() => {
                                                message23.channel.send("Something went wrong. Please try again")
                                            })


                                    })


                            } else {
                                const embed = new Discord.MessageEmbed()
                                    .setColor('#5d369d')
                                    .setTitle("You dont have `" + amount + "` lottery tickets!")
                                message.channel.send({embeds: [embed]})

                            }
                        }
                    })
                }
            })

    }
}