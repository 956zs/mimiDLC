# Discord.js v14 新版 Components (V2) 詳盡使用指南

本文件旨在詳細說明如何使用 Discord.js v14 中引入的新版訊息元件 (Components V2)。這些新元件提供了比以往更豐富、更具結構性的訊息排版能力。

## 核心概念

新版元件的核心是 **容器 (Container)**，所有其他元件都必須被包裹在一個頂層容器中。這與傳統的 `ActionRow` 有所不同，提供了更大的排版自由度。

### 1. 啟用 V2 Components

要使用新版元件，最關鍵的一步是在 `interaction.reply` 中設定 `flags` 屬性。如果沒有這個旗標，Discord 將會回退到舊版的 Components，導致顯示錯誤或完全不顯示。

```typescript
import { MessageFlags } from "discord.js";

await interaction.reply({
  // ... 其他選項
  flags: MessageFlags.IsComponentsV2,
});
```

#### 組合多個旗標

如果您需要同時使用多個旗標（例如，同時啟用 V2 Components 並將訊息設為臨時訊息），您可以使用位元「或」運算子 (`|`) 來組合它們。

```typescript
import { MessageFlags } from "discord.js";

await interaction.reply({
  // ... 其他選項
  flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
});
```

這樣，回覆的訊息將只對發送該指令的使用者可見。

## 2. 元件建構器 (Builders)

以下是 Components V2 中常用的各種建構器。

### 主容器 `ContainerBuilder`

所有 V2 元件都必須放在一個 `ContainerBuilder` 實例中。您可以把它想像成一個包裹所有內容的頂層容器。

`ContainerBuilder` 也可以設定一些排版屬性，例如使用 `.setAccentColor()` 方法來設定左側的強調色。

**方法一：手動加入元件 (如範例所示)**

```typescript
import { ContainerBuilder, TextDisplayBuilder } from "discord.js";

const container = new ContainerBuilder();
const title = new TextDisplayBuilder().setContent("# 這是標題");

// 將元件實例按順序 push 到 container.components 陣列中
container.components.push(title);
```

**方法二：使用鏈式方法 (官方文件風格)**

`ContainerBuilder` 提供了一系列 `.add...Components()` 的方法，讓您可以用鏈式呼叫的方式加入元件，程式碼更簡潔。

```typescript
import { ContainerBuilder, UserSelectMenuBuilder } from 'discord.js';

const exampleContainer = new ContainerBuilder()
	.setAccentColor(0x0099FF)
	.addTextDisplayComponents(
		textDisplay => textDisplay
			.setContent('這是一個文字元件！')
	)
	.addActionRowComponents(
		actionRow => actionRow
			.setComponents(
				new UserSelectMenuBuilder()
					.setCustomId('exampleSelect')
					.setPlaceholder('選擇使用者'),
			),
	);
```

### 基礎內容元件

*   **`TextDisplayBuilder`**: 用於顯示文字內容，支援 Markdown 語法。您可以把它當作一個文字區塊。
*   **`MediaGalleryBuilder`**: 用於顯示圖片或媒體。您可以加入多個媒體項目來建立一個畫廊。
*   **`SeparatorBuilder`**: 用於在元件之間加入一條分隔線或間距，讓排版更清晰。
*   **`ActionRowBuilder`**: 與舊版相似，用於放置按鈕 (`ButtonBuilder`)、選單 (`StringSelectMenuBuilder`) 等互動元件。

### 進階內容元件

#### `SectionBuilder` (區塊元件)

`SectionBuilder` 是一個強大的元件，它本身可以容納最多三個 `TextDisplay` 元件，並且可以在右側附加一個「配件 (Accessory)」。

**配件 (Accessory)** 可以是：
*   一個按鈕 (`ButtonBuilder`)
*   一個縮圖 (`ThumbnailBuilder`)

**範例：帶有按鈕配件的 Section**

```typescript
import { SectionBuilder, ButtonStyle, MessageFlags } from 'discord.js';

const exampleSection = new SectionBuilder()
	.addTextDisplayComponents(
		textDisplay => textDisplay.setContent('這是一個 Section 元件。'),
		textDisplay => textDisplay.setContent('它可以包含多個文字區塊。')
	)
	.setButtonAccessory(
		button => button
			.setCustomId('exampleButton')
			.setLabel('Section 裡的按鈕')
			.setStyle(ButtonStyle.Primary),
	);

await channel.send({
	components: [exampleSection],
	flags: MessageFlags.IsComponentsV2,
});
```

#### `FileBuilder` (檔案元件)

用於在訊息中直接嵌入一個上傳的檔案。

```typescript
import { AttachmentBuilder, FileBuilder, MessageFlags } from 'discord.js';

// 先建立一個附件
const file = new AttachmentBuilder('./assets/guide.pdf');

const exampleFile = new FileBuilder()
    // 這裡的 URL 必須對應到附件的名稱
	.setURL('attachment://guide.pdf');

await channel.send({
	components: [exampleFile],
	files: [file], // 同時發送檔案
	flags: MessageFlags.IsComponentsV2,
});
```

## 完整程式碼範例

這個範例改編自 [`src/commands/coyote.ts`](src/commands/coyote.ts:0)，展示了如何結合使用上述多種元件來建立一個複雜的訊息。

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
import { MessageFlags } from "discord.js";
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
    // 1. 建立主容器並設定顏色
    const container = new ContainerBuilder().setAccentColor(703487);

    // 2. 建立各種內容元件
    const separator = new SeparatorBuilder();
    const title = new TextDisplayBuilder().setContent("# 小男娘鑑定工作！");
    const text = new TextDisplayBuilder().setContent("你是小男娘嗎?");
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
    container.components.push(title, separator, image, separator, text, row);

    // 4. 回覆互動，並啟用 V2 Components
    await interaction.reply({
      components: [container], // 將主容器傳入 components
      flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
    });
  }
}
```

## 進階技巧

### 修改已接收的元件

從 API 收到的元件是不可變的。若要修改它（例如，在使用者點擊按鈕後禁用該按鈕），您必須使用 `ComponentBuilder.from()` 靜態方法來建立一個可變的建構器實例。

```diff
- const editedButton = receivedButton
-   .setDisabled(true);

+ import { ButtonBuilder } from 'discord.js';
+ const editedButton = ButtonBuilder.from(receivedButton)
+   .setDisabled(true);
```

## 總結

使用新版 Components V2 的流程如下：
1.  建立一個 `ContainerBuilder` 或其他頂層元件 (如 `SectionBuilder`)。
2.  建立所有你需要的內容元件 (`TextDisplayBuilder`, `ActionRowBuilder` 等)。
3.  將這些元件實例按順序加入到容器中 (可使用 `.push()` 或鏈式方法)。
4.  在 `interaction.reply` 中，將元件陣列作為 `components` 的值，並**務必**加上 `flags: MessageFlags.IsComponentsV2`。
