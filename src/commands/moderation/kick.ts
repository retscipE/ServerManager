import { SlashCommandBuilder } from 'discord.js'
import { command } from '../../utils'
import ms from 'ms'

const meta = new SlashCommandBuilder()
  .setName('kick')
  .setDescription('Kick a user from the server')
  .addUserOption(option => option.setName('user').setDescription('The user to kick').setRequired(true))
  .addStringOption(option => option.setName('reason').setDescription('The reason for kicking the user'))

export default command(meta, async ({ interaction, client }) => {
    await interaction.deferReply({ ephemeral: true })
    const userToKick = interaction.guild!.members.cache.get(interaction.options.getUser('user', true)!.id)
    const reason = interaction.options.getString('reason') || 'No reason provided'

    const kicker = interaction.guild!.members.cache.get(interaction.user.id)!

    if (kicker.permissions.has('KickMembers') === false) return interaction.reply({ content: 'You do not have permission to kick members', ephemeral: true })
    if (!userToKick) return interaction.reply({ content: 'That user does not exist', ephemeral: true })
    if (userToKick.id === interaction.user.id) return interaction.reply({ content: 'You cannot kick yourself', ephemeral: true })
    if (!userToKick.kickable) return interaction.reply({ content: 'I cannot kick that user', ephemeral: true })
    if (userToKick.roles.highest.position >= kicker.roles.highest.position) return interaction.reply({ content: 'You cannot kick that user', ephemeral: true })
    if (userToKick.id === interaction.guild!.ownerId) return interaction.reply({ content: 'You cannot kick the server owner', ephemeral: true })
    if (userToKick.id === client.user!.id) return interaction.reply({ content: 'You cannot kick me', ephemeral: true })
    
    await userToKick.kick(reason)
    await interaction.editReply({ content: `Kicked **${userToKick.user.tag}** for **${reason}**.` })
})