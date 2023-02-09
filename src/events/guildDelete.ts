import { event, GuildSchema } from "../utils";
import keys from "../keys";

export default event("guildDelete", async ({ log }, guild) => {
    await GuildSchema.findOneAndDelete({ guildID: guild.id })
});
