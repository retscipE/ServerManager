import { category } from '../../utils'
import ban from './ban'
import kick from './kick'
import unban from './unban'

export default category("moderation", "Commands to help moderate your server.", [
    kick,
    ban,
    unban
])