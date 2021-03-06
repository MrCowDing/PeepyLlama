const fs = require("fs");
const Discord = require("discord.js")
const simpleCommand = require("../../core/simpleCommand");
const api = require("../../core/api")
const itemfiles = new Discord.Collection();
const itemarray = fs.readdirSync(__dirname + "/../../items").filter(file => file.endsWith('.js'));
for (const file of itemarray) {
    const itemdata = require(`../../items/${file}`);
    itemfiles.set(itemdata.name, itemdata);
    //console.log(`${itemdata.name} item success`)
}
const items = require('../../json/items.json')

module.exports = new simpleCommand(async(message, args, channel, addCD) => {
    api.getUser(message.author.id)
        .then((user) => {
            var item = args.join(' ').toLowerCase()
            if (item != 0) {
                if (items.hasOwnProperty(item)) {
                    if (items[item][4].custombuy) {
                        const embed = new Discord.MessageEmbed()
                            .setColor('#5d369d')
                            .setTitle("Not for sale.")
                            .setDescription("This item is not for sale!")
                            message.channel.send({embeds: [embed]})
                        //itemfiles.get(item).buy(message, user)
                    } else {
                        if (Math.round(user.bal / items[item][2]) == 0) {
                            const embed = new Discord.MessageEmbed()
                                .setColor('RED')
                                .setTitle("Not Enough Coins")
                                .setDescription("You need `" + (user.bal - items[item][2]) * -1 + "` more coins to buy 1 " + item)
                            message.channel.send({embeds: [embed]})
                        } else {


                            const embed = new Discord.MessageEmbed()
                                .setColor('GREEN')
                                .setTitle("Buying " + item)
                                .setDescription("How many " + item + "s do you want? \n Please respond within 20 seconds")
                                .setFooter("You can buy up to " + Math.floor(user.bal / items[item][2]) + " " + item + "s")
                            message.channel.send({embeds: [embed]})
                            const filter = m => m.author.id === message.author.id;
                            const collector = message.channel.createMessageCollector({ filter, max: 1, time: 20000 })
                            collector.on("collect", (message23) => {
                                if (isNaN(Number(message23.content)) || Number(message23.content) < 1 || !Number.isInteger(Number(message23.content))) {
                                    message23.channel.send("Please enter a valid number... \n Run the command again")
                                } else {
                                    var amount = Number(message23.content)
                                    var price = items[item][2] * amount
                                        //add inventory if does not exist
                                    if (!user.hasOwnProperty("inv")) {
                                        user.inv = {}
                                    }

                                    //check if user has enough money to buy item
                                    if (user.bal - price < 0) {
                                        const embed = new Discord.MessageEmbed()
                                            .setColor('RED')
                                            .setTitle("Not Enough Coins")
                                            .setDescription("You need `" + (user.bal - price) * -1 + "` more coins to buy " + amount + " " + item + "s")
                                        message.channel.send({embeds: [embed]})
                                    } else {
                                        //BUY THE ITEM
                                        if (user.inv.hasOwnProperty(item)) {
                                            currentAmount = user.inv[item].amount
                                        } else {
                                            currentAmount = 0;
                                        }
                                        user.inv[item] = { name: item, amount: currentAmount + amount }
                                        user.bal = user.bal - price
                                            //Save their new data
                                        api.modUser(message.author.id, user)
                                            .then(() => {
                                                const embed = new Discord.MessageEmbed()
                                                    .setColor('GREEN')
                                                    .setTitle("Purchase Successful!")
                                                    .setDescription("Congrats! You bought `" + amount + "` " + item + "s for `" + price + "`!\nYour remaining balance is `" + user.bal + "`")
                                                message.channel.send({embeds: [embed]})
                                            })
                                            .catch((err) => {
                                                message.channel.send("Something went wrong...")
                                                console.log(err)
                                            })
                                    }

                                }

                            })
                        }
                    }
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setTitle("Not found")
                        .setDescription("The item `" + item + "` was not found\nType `>shop` for a list of items")
                    message.channel.send({embeds: [embed]})
                }

            } else {
                const embed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setTitle("No item entered")
                    .setDescription("Please use the command like `>buy <itemname>`\nType `>shop` for a list of items")
                message.channel.send({embeds: [embed]})
            }
        })
        .catch((err) => {
            if (err.type == 0) {
                const embed = new Discord.MessageEmbed()
                    .setColor('#5d369d')
                    .setTitle("This user doesnt have an account!")
                message.channel.send({embeds: [embed]})
            } else {
                message.channel.send("Something went wrong....")
            }

        })
}, {
    name: "buy",
    aliases: ["buy", "purchase"],
    description: "Buy an item from the shop!\nYou can view a list of commands by typing >shop",
    usage: "{prefix}{cmd} <item>"
})