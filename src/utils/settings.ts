export interface ISetting {
    name: string
    description: string
    value: string
    type: 'string' | 'boolean' | 'number' | 'time'
    required: boolean
}

export const settings: ISetting[] = [
    {
        name: 'send-logs',
        description: 'Whether or not to send logs to the logging channel',
        value: 'sendlogs_option',
        type: 'boolean',
        required: true
    },
    {
        name: 'server-stats',
        description: 'Whether or not to display server statistics as channels',
        value: 'serverstats_option',
        type: 'boolean',
        required: true
    },
    {
        name: 'logging-channel',
        description: 'The channel to send logs to',
        value: 'loggingchannel_option',
        type: 'string',
        required: true
    },
]