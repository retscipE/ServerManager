import { SlashCommandBuilder } from 'discord.js'
import { command } from '../../utils'
import ms from 'ms'

const meta = new SlashCommandBuilder()
  .setName('ban')
  .setDescription('Ban a user from the server')
  .addUserOption(option => option.setName('user').setDescription('The user to ban').setRequired(true))
  .addStringOption(option => option.setName('reason').setDescription('The reason for banning the user'))

export default command(meta, async ({ interaction, client }) => {
    await interaction.deferReply({ ephemeral: true })
    const userToBan = interaction.guild!.members.cache.get(interaction.options.getUser('user', true)!.id)
    const reason = interaction.options.getString('reason') || 'No reason provided'

    const banner = interaction.guild!.members.cache.get(interaction.user.id)!

    if (banner.permissions.has('BanMembers') === false) return interaction.reply({ content: 'You do not have permission to ban members', ephemeral: true })
    if (!userToBan) return interaction.reply({ content: 'That user does not exist', ephemeral: true })
    if (userToBan.id === interaction.user.id) return interaction.reply({ content: 'You cannot ban yourself', ephemeral: true })
    if (!userToBan.bannable) return interaction.reply({ content: 'I cannot ban that user', ephemeral: true })
    if (userToBan.roles.highest.position >= banner.roles.highest.position) return interaction.reply({ content: 'You cannot ban that user', ephemeral: true })
    if (userToBan.id === interaction.guild!.ownerId) return interaction.reply({ content: 'You cannot ban the server owner', ephemeral: true })
    if (userToBan.id === client.user!.id) return interaction.reply({ content: 'You cannot ban me', ephemeral: true })
    
    await userToBan!.ban({ reason, deleteMessageSeconds: 0 })
    await interaction.editReply({ content: `You banned **${userToBan.user.tag}** for **${reason}**.` })
})