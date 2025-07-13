import "reflect-metadata";
import { Client } from "discordx";
import { IntentsBitField } from "discord.js";
import { dirname, importx } from "@discordx/importer";
import { config } from "./config.js";

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
  ],
  // The importx function below handles finding and loading all commands and events
  botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
  silent: false,
});

client.once("ready", async () => {
  // Make sure all commands are registered
  await client.initApplicationCommands();
  console.log(">> Bot started");
});

async function start() {
  await importx(
    `${dirname(import.meta.url)}/{commands,events}/**/*.{js,ts}`
  );
  await client.login(config.botToken);
}

start();