import { model, Schema, SchemaType, connect, set } from "mongoose";

export function startConnection(uri: string) {
  // Connect to the mongoose database and catch for errors
  connect(uri).catch((err) => console.error(err))
  set('strictQuery', true)
}

export interface GuildSettings {
  guildId: string
  loggingChannelId: string
  sendLogs: boolean
  serverStats: boolean
}

export const GuildSchema = model("guild", new Schema<GuildSettings>({
  guildId: { type: String, required: true, unique: true },
  loggingChannelId: { type: String, required: true },
  sendLogs: { type: Boolean, required: true, default: false },
  serverStats: { type: Boolean, required: true, default: false },
}))