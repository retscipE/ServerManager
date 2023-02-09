import { SlashCommandBuilder } from 'discord.js'
import { command, GuildSchema, settings } from '../../utils'
import ms from 'ms'

const meta = new SlashCommandBuilder()
  .setName('settings')
  .setDescription('Adjust the settings for the server')
  .addSubcommand(subcommand => 
    subcommand
        .setName('configure')
        .setDescription('Configure the server settings')
        .addStringOption(option => {
            option
                .setName('setting')
                .setDescription('The setting to configure')
                .setRequired(true)
            settings.forEach(setting => {
                option.addChoices({ name: setting.name, value: setting.value })
            })

            return option
        })
        .addStringOption(option =>
            option
                .setName('value')
                .setDescription('The value to set the setting to')
                .setRequired(true)
        )
  )
  .addSubcommand(subcommand => 
    subcommand
        .setName('setup')
        .setDescription('Setup the server for logging and other features')
        .addChannelOption(option =>
            option
                .setName('logging-channel')
                .setDescription('The channel to send logs to')
                .setRequired(true)
        )
        .addBooleanOption(option =>
            option
                .setName('send-logs')
                .setDescription('Whether or not to send logs to the logging channel')
                .setRequired(true)
        )
        .addBooleanOption(option =>
            option
                .setName('server-stats')
                .setDescription('Whether or not to display server statistics as channels')
                .setRequired(true)    
        )
  )
  .addSubcommand(subcommand =>
    subcommand
        .setName('get')
        .setDescription('Get the current value of a setting')
        .addStringOption(option => {
            option
                .setName('setting')
                .setDescription('The setting to get the value of')
                .setRequired(true)
            settings.forEach(setting => {
                option.addChoices({ name: setting.name, value: setting.value })
            })
            return option
        })
  )

export default command(meta, async ({ interaction }) => {
    if ((await interaction.guild!.members.fetch({ user: interaction.user, cache: true })).permissions.has("ManageGuild")) {
        if (!interaction.guild) return interaction.reply({ content: 'This command can only be used in a server', ephemeral: true })
        
        switch (interaction.options.getSubcommand()) {
            case 'configure': {
                if (!(await GuildSchema.exists({ guildId: interaction.guildId })))
                    return interaction.reply({ content: 'You must run the setup command before you can configure the server settings', ephemeral: true })

                const guildSettings = await GuildSchema.findOne({ guildId: interaction.guildId })
                const settingOption: string = interaction.options.getString('setting', true)
                const valueOption: string = interaction.options.getString('value', true)

                settings.filter(setting => setting.value === settingOption).forEach(setting => {

                    switch (setting.type) {
                        case 'string': {
                            GuildSchema.findOneAndUpdate({ guildId: interaction.guildId }, { $set: { [setting.name]: valueOption } })
                            break
                        }
                        case 'number': {
                            GuildSchema.findOneAndUpdate({ guildId: interaction.guildId }, { $set: { [setting.name]: parseInt(valueOption) } })
                            break
                        }
                        case 'boolean': {
                            GuildSchema.findOneAndUpdate({ guildId: interaction.guildId }, { $set: { [setting.name]: valueOption === 'true' ? true : false } })
                            break
                        }
                        case 'time': {
                            GuildSchema.findOneAndUpdate({ guildId: interaction.guildId }, { $set: { [setting.name]: ms(valueOption) } })
                            break
                        }
                    }

                    interaction.reply({ content: `The setting \`${setting.name}\` has been set to \`${valueOption}\`!`, ephemeral: true })
                })
            }
            case 'setup': {
                if (await GuildSchema.exists({ guildId: interaction.guildId }))
                    return interaction.reply({ content: 'You have already setup the server settings', ephemeral: true })
                    
                const guildId = interaction.guild!.id
                const loggingChannelId = interaction.options.getChannel('logging-channel', true).id
                const sendLogs = interaction.options.getBoolean('send-logs', true)
                const serverStats = interaction.options.getBoolean('server-stats', true)

                const guild = new GuildSchema({
                    guildId,
                    loggingChannelId,
                    sendLogs,
                    serverStats
                })
                await guild.save();

                interaction.reply({ content: 'Server settings have been created!', ephemeral: true })
            }
            case 'get': {
                if (!(await GuildSchema.exists({ guildId: interaction.guildId })))
                    return interaction.reply({ content: 'You must run the setup command before you can get the server settings', ephemeral: true })
            
                const guildSettings = await GuildSchema.findOne({ guildId: interaction.guildId })
                const settingOption = interaction.options.getString('setting', true)

                settings.filter(setting => setting.value === settingOption).forEach(setting => {
                    let settingValue;

                    switch (setting.name) {
                        case 'loggingChannelId': {
                            settingValue = guildSettings!.loggingChannelId
                            break
                        }
                        case 'sendLogs': {
                            settingValue = guildSettings!.sendLogs
                            break
                        }
                        case 'serverStats': {
                            settingValue = guildSettings!.serverStats
                            break
                        }
                    }

                    
                    interaction.reply({ content: `The setting \`${setting.name}\` is currently set to \`${settingValue}\`!`, ephemeral: true })
                })
            }
        }
    } else {
        return interaction.reply({ content: 'You do not have the required permissions to use this command', ephemeral: true })
    }
})