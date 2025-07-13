import type { ButtonInteraction } from "discord.js";
import { ButtonComponent, Discord } from "discordx";

@Discord()
export class RunAwayButton {
  @ButtonComponent({ id: "run_away" })
  async handle(interaction: ButtonInteraction): Promise<void> {
    await interaction.reply({
      content: "你逃跑了！",
      //ephemeral: true,
    });
  }
}
