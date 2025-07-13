import type { ButtonInteraction } from "discord.js";
import { ButtonComponent, Discord } from "discordx";

@Discord()
export class FeedCoyoteButton {
  @ButtonComponent({ id: "feed_coyote" })
  async handle(interaction: ButtonInteraction): Promise<void> {
    await interaction.reply({
      content: "你拿出了一根香蕉，他看起來很開心。",
      //ephemeral: true,
    });
  }
}
