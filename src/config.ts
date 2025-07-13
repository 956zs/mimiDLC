import "dotenv/config";

export const config = {
  botToken: process.env.BOT_TOKEN ?? "",
  clientId: process.env.CLIENT_ID ?? "",
};