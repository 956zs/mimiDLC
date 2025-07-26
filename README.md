# Discord v14 新版 Components (V2) 使用指南

本文件旨在說明如何使用 Discord.js v14 中引入的新版訊息元件 (Components V2)。這些新元件提供了更豐富、更具結構性的訊息排版能力。

## 核心概念

新版元件的核心是 `Container`，所有其他元件都必須被包裹在其中。

### 1. 啟用 V2 Components

要使用新版元件，最關鍵的一步是在 `interaction.reply` 中設定 `flags` 屬性。如果沒有這個旗標，Discord 將會回退到舊版的 Components，導致顯示錯誤。

```typescript
import { MessageFlags } from "discord-api-types/v10";

await interaction.reply({
  // ... 其他選項
  flags: MessageFlags.IsComponentsV2,
});
```

### 組合多個旗標

如果您需要同時使用多個旗標（例如，同時啟用 V2 Components 並將訊息設為臨時訊息），您可以使用位元「或」運算子 (`|`) 來組合它們。

```typescript
import { MessageFlags } from "discord-api-types/v10";

await interaction.reply({
  // ... 其他選項
  flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
});
```

這樣，回覆的訊息將只對發送該指令的使用者可見。

### 2. 主容器 `ContainerBuilder`

所有 V2 元件都必須放在一個 `ContainerBuilder` 實例中。您可以把它想像成一個包裹所有內容的頂層容器。

```typescript
import { ContainerBuilder } from "discord.js";

const container = new ContainerBuilder();
// 將其他元件加入 container.components 陣列中
```

`ContainerBuilder` 也可以設定一些排版屬性，例如使用 `.setAccentColor()` 方法來設定左側的強調色。

### 3. 內容元件

以下是幾個常用的內容元件：

*   **`TextDisplayBuilder`**: 用於顯示文字內容，支援 Markdown 語法。您可以把它當作一個文字區塊。
*   **`MediaGalleryBuilder`**: 用於顯示圖片或媒體。您可以加入多個媒體項目來建立一個畫廊。
*   **`SeparatorBuilder`**: 用於在元件之間加入一條分隔線，讓排版更清晰。
*   **`ActionRowBuilder`**: 與舊版相似，用於放置按鈕 (`ButtonBuilder`)、選單 (`StringSelectMenuBuilder`) 等互動元件。

## 程式碼範例

這個範例改編自 [`src/commands/coyote.ts`](src/commands/coyote.ts:0)，展示了如何結合使用上述元件來建立一個複雜的訊息。

```typescript
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
    // 1. 建立主容器
    const container = new ContainerBuilder().setAccentColor(703487);

    // 2. 建立各種內容元件
    // 分隔線
    const separator = new SeparatorBuilder();

    // 標題文字
    const title = new TextDisplayBuilder().setContent("# 小男娘鑑定工作！");

    // 內文
    const text = new TextDisplayBuilder().setContent("你是小男娘嗎?");

    // 圖片庫
    const image = new MediaGalleryBuilder().addItems({
      media: { url: "https://db.nlcat.dpdns.org/GrD8cqtbwAI2DNN.jpg" },
    });

    // 按鈕列
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

    // 3. 將所有元件按照期望的順序加入容器中
    // 元件會由上到下依序排列
    container.components.push(title, separator, image, separator, text, row);

    // 4. 回覆互動，並啟用 V2 Components
    await interaction.reply({
      components: [container], // 將主容器傳入 components
      flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral, // **啟用 V2 Components 並設為臨時訊息**
    });
  }
}
```

## 總結

使用新版 Components V2 的流程如下：
1.  建立一個 `ContainerBuilder`。
2.  建立所有你需要的內容元件 (`TextDisplayBuilder`, `MediaGalleryBuilder`, `ActionRowBuilder` 等)。
3.  將這些元件實例按順序 `push` 到 `container.components` 陣列中。
4.  在 `interaction.reply` 中，將 `[container]` 作為 `components` 的值，並**務必**加上 `flags: MessageFlags.IsComponentsV2`。