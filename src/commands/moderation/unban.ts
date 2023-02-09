import { SlashCommandBuilder } from 'discord.js'
import { command } from '../../utils'
import ms from 'ms'

const meta = new SlashCommandBuilder()
  .setName('unban')
  .setDescription('Unban a user from the server')
  .addUserOption(option => option.setName('user').setDescription('The user to unban').setRequired(true))
  .addStringOption(option => option.setName('reason').setDescription('The reason for unbanning the user'))

export default command(meta, async ({ interaction, client }) => {
    await interaction.deferReply({ ephemeral: true })
    const userToUnban = interaction.guild!.members.cache.get(interaction.options.getUser('user', true)!.id)
    const reason = interaction.options.getString('reason') || 'No reason provided'

    const banner = interaction.guild!.members.cache.get(interaction.user.id)!

    if (banner.permissions.has('BanMembers') === false) return interaction.reply({ content: 'You do not have permission to unban members', ephemeral: true })
    if (!userToUnban) return interaction.reply({ content: 'That user does not exist', ephemeral: true })
    if (interaction.guild!.bans.cache.has(userToUnban.id) === false) return interaction.reply({ content: 'That user is not banned.', ephemeral: true })

    await interaction.guild!.members.unban(userToUnban, reason)
    await interaction.editReply({ content: `You unbanned **${userToUnban.user.tag}** for **${reason}**.` })
})