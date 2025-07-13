import type { ButtonInteraction, TextDisplayComponent } from "discord.js";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ComponentType,
  MessageFlags,
  SeparatorBuilder,
  TextDisplayBuilder,
} from "discord.js";
import { ButtonComponent, Discord } from "discordx";

@Discord()
export class ButtonEvent {
  @ButtonComponent({ id: "rerun-ping" })
  async rerunPing(interaction: ButtonInteraction): Promise<void> {
    // The container is the first and only component
    const container = interaction.message.components[0];
    if (!container || container.type !== ComponentType.Container) {
      return;
    }

    // The TextDisplay is the first component inside the container
    const textDisplay = container.components[0] as TextDisplayComponent;
    if (!textDisplay || textDisplay.type !== ComponentType.TextDisplay) {
      return;
    }

    // Parse the rerun count from the TextDisplay content
    const rerunCountMatch = textDisplay.content.match(/Times Reran: (\d+)/);
    const currentRerunCount = rerunCountMatch
      ? parseInt(rerunCountMatch[1], 10)
      : 0;
    const newRerunCount = currentRerunCount + 1;

    // Re-calculate latency
    const latency = Math.round(interaction.client.ws.ping);

    // Rebuild the components
    const newTextDisplay = new TextDisplayBuilder().setContent(
      `API Latency: ${latency}ms\nTimes Reran: ${newRerunCount}`
    );

    const separator = new SeparatorBuilder();

    // The button is in an action row, which is the third component in the container
    const originalActionRow = container.components[2];
    if (
      !originalActionRow ||
      originalActionRow.type !== ComponentType.ActionRow
    ) {
      return;
    }

    // Rebuild the action row from the original component
    const newActionRow = new ActionRowBuilder<ButtonBuilder>(
      originalActionRow.toJSON()
    );

    // Update the message
    await interaction.update({
      components: [
        {
          type: ComponentType.Container,
          components: [
            newTextDisplay.toJSON(),
            separator.toJSON(),
            newActionRow.toJSON(),
          ],
        },
      ],
      flags: MessageFlags.IsComponentsV2,
    });
  }
}
