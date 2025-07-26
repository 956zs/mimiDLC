import {
  ActionRowBuilder,
  ButtonBuilder,
  ComponentType,
  MessageFlags,
  TextDisplayBuilder,
  type ButtonInteraction,
} from "discord.js";
import { ButtonComponent, Discord } from "discordx";

@Discord()
export class FeedCoyoteButton {
  @ButtonComponent({ id: "feed_coyote" })
  async handle(interaction: ButtonInteraction): Promise<void> {
    // The container is the first and only component
    const container = interaction.message.components[0];
    if (!container || container.type !== ComponentType.Container) {
      return;
    }

    // Find the ActionRow with buttons
    const actionRow = container.components.find(
      (component) => component.type === ComponentType.ActionRow
    );

    if (!actionRow || actionRow.type !== ComponentType.ActionRow) {
      return;
    }

    // Create new ActionRow with disabled buttons
    const newActionRow = new ActionRowBuilder<ButtonBuilder>();
    for (const component of actionRow.components) {
      if (component.type === ComponentType.Button) {
        newActionRow.addComponents(
          new ButtonBuilder()
            .setCustomId(component.customId!)
            .setLabel(component.label ?? "")
            .setStyle(component.style)
            .setDisabled(true)
        );
      }
    }

    // Create response text
    const responseText = new TextDisplayBuilder().setContent(
      "你拿出了一包洋芋片，他看起來很開心。"
    );

    // Create new container with updated components
    const newComponents = container.components.map((component) => {
      if (component.type === ComponentType.ActionRow) {
        return newActionRow.toJSON();
      }
      return component.toJSON();
    });

    // Add response text at the beginning
    newComponents.unshift(responseText.toJSON());

    await interaction.update({
      components: [
        {
          type: ComponentType.Container,
          components: newComponents,
        },
      ],
      flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
    });
  }
}
