import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  ContainerBuilder,
  SeparatorBuilder,
  TextDisplayBuilder,
  MediaGalleryBuilder,
} from "discord.js";
import { MessageFlags } from "discord-api-types/v10";
import { Discord, Slash } from "discordx";
@Discord()
export class Coyote {
  @Slash({
    description: "Shows a wild coyote.",
    name: "coyote",
    integrationTypes: [0, 1],
    contexts: [0, 1, 2],
  })
  async coyote(interaction: CommandInteraction): Promise<void> {
    const container = new ContainerBuilder().setAccentColor(703487);
    const separator = new SeparatorBuilder();

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("pet_coyote")
        .setLabel("對")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("feed_coyote")
        .setLabel("沒錯")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("run_away")
        .setLabel("是")
        .setStyle(ButtonStyle.Danger)
    );
    const title = new TextDisplayBuilder().setContent("# 小男娘鑑定工作！");
    const text = new TextDisplayBuilder().setContent("你是小男娘嗎?");
    const image = new MediaGalleryBuilder().addItems({
      media: { url: "https://db.nlcat.dpdns.org/GrD8cqtbwAI2DNN.jpg" },
    });

    container.components.push(title, separator, image, separator, text, row);

    await interaction.reply({
      components: [container],
      //ephemeral: true,
      flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
    });
  }
}
