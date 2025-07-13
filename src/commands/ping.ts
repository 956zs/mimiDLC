import type { CommandInteraction } from "discord.js";
import { MessageFlags, TextDisplayBuilder } from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
export class Example {
  @Slash({ description: "ping", name: "ping" })
  ping(interaction: CommandInteraction): void {
    const exampleTextDisplay = new TextDisplayBuilder().setContent(
      "pong!"
    );

    interaction.reply({
      components: [exampleTextDisplay],
      flags: MessageFlags.IsComponentsV2,
    });
  }
}