import { category } from '../../utils'
import ping from './ping'
import { helpCommand } from './help'
import settings from './settings'

export default category("Utility", "Commands to help with utility in your server", [
    ping,
    helpCommand,
    settings
])