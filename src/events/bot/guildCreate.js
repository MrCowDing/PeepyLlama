const { MessageEmbed } = require('discord.js'),
Event = require('../../structures/Event'),
config = require('../../config');

/**
 * Ready event
 * @event IUNGO#guildCreate
 * @extends {Event}
*/
class guildCreate extends Event {
	constructor(...args) {
		super(...args, {
			dirname: __dirname,
		});
	}

	/**
	 * Function for recieving event.
	 * @param {client} client The instantiating client
	 * @readonly
	*/
	async run(client, guild, message) {
	const embed = new MessageEmbed()
            .setColor('#5d369d')
			.setTitle(`[GUILD JOIN] ${guild.name}`);
		if (guild.icon == null) {
		} else {
			embed.setImage(guild.iconURL({ dynamic: true, size: 1024 }));
		}
		embed.setDescription([
			`Guild ID: ${guild.id ?? 'undefined'}`,
			`Owner: ${guild.ownerId}`,
			`MemberCount: ${guild.memberCount ?? 'undefined'}`,
		].join('\n'));
    console.log("Joined a new guild: " + guild.name);
    client.channels.cache.get(config.SupportServer.GuildChannel).send({embeds: [embed]});
    console.log("Left a guild: " + guild.name);
	}
}

module.exports = guildCreate;
