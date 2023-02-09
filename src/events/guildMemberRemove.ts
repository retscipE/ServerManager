import { event, GuildSchema } from "../utils";
import keys from "../keys";
import { AuditLogEvent, EmbedBuilder, TextChannel } from "discord.js";

export default event("guildMemberRemove", async ({ log, client }, member) => {

    const guildSettings = await GuildSchema.findOne({ guildID: member.guild.id })
    
    if (guildSettings!.sendLogs) {
        const fetchedKickLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberKick,
        });
    
        const kickLog = fetchedKickLogs.entries.first();
    
        if (!kickLog) {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("Member Left")
                .setDescription(`**Member:** ${member.user.tag} (${member.id})`)
                .setTimestamp()
                .setFooter({ text: `ID: ${member.id}` });
    
            const logChannel = client.channels.cache.get(guildSettings!.loggingChannelId) as TextChannel
            await logChannel.send({ embeds: [embed] });
        } else {
            const { executor, target, reason } = kickLog;
    
            if (target!.id === member.id) {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("Member Kicked")
                .setDescription(`**Member:** ${member.user.tag} (${member.id})\n**Kicked By:** ${executor!.tag} (${executor!.id})\n**Reason:** ${reason}`)
                .setTimestamp()
                .setFooter({ text: `ID: ${member.id}` });
    
            const logChannel = client.channels.cache.get(guildSettings!.loggingChannelId) as TextChannel
            await logChannel.send({ embeds: [embed] });
    
        } else return;
        }
    }

    


});
