import type { ButtonInteraction } from "discord.js";
import { ButtonComponent, Discord } from "discordx";

@Discord()
export class PetCoyoteButton {
  @ButtonComponent({ id: "pet_coyote" })
  async handle(interaction: ButtonInteraction): Promise<void> {
    await interaction.reply({
      content: "你摸了摸小男娘的頭。",
      //ephemeral: true,
    });
  }
}
