import "reflect-metadata";
import { dirname, importx } from "@discordx/importer";
import { Client } from "discordx";
import { IntentsBitField } from "discord.js";
import { config } from "./config.js";

export const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
  ],
  silent: false,
});

client.once("ready", async () => {
  await client.initApplicationCommands();
  console.log("Bot started.");
});

client.on("interactionCreate", (interaction) => {
  client.executeInteraction(interaction);
});

async function run() {
  await importx(
    `${dirname(import.meta.url)}/{commands,events,interactions}/**/*.{js,ts}`
  );
  await client.login(config.botToken);
}

run().catch((error) => {
  console.error("An error occurred during bot startup:", error);
  process.exit(1);
});