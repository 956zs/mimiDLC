import type { CommandInteraction } from "discord.js";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  MessageFlags,
  SeparatorBuilder,
  TextDisplayBuilder,
} from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
export class Example {
  @Slash({
    description: "ping",
    name: "ping",
    integrationTypes: [0, 1],
    contexts: [0, 1, 2],
  })
  async ping(interaction: CommandInteraction): Promise<void> {
    const container = new ContainerBuilder();

    const text = new TextDisplayBuilder().setContent(
      `API Latency: ${interaction.client.ws.ping}ms\nTimes Reran: 0`
    );

    const separator = new SeparatorBuilder();

    const button = new ButtonBuilder()
      .setLabel("Rerun")
      .setCustomId("rerun-ping")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
    const text2 = new TextDisplayBuilder().setContent("<@362236724912324608>");
    container.components.push(text, separator, row, separator, text2);

    await interaction.deferReply();
    await interaction.editReply({
      flags: MessageFlags.IsComponentsV2,
      components: [container],
    });
  }
}
