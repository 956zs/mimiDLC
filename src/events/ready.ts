import type { ArgsOf, Client } from "discordx";
import { Discord, On } from "discordx";

@Discord()
export class Example {
  @On({ event: "ready" })
  onReady([_]: ArgsOf<"ready">, client: Client): void {
    console.log(`>> ${client.user?.username} is ready`);
  }
}