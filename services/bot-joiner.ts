import { Api, type TelegramClient } from 'telegram';

export class BotJoiner {
  private readonly client: TelegramClient;

  constructor(client: TelegramClient) {
    this.client = client;
  }

  async join(url: string, startParam?: string): Promise<void> {
    startParam
      ? await this.startBotWithStartParam(url, startParam)
      : await this.startBot(url);
  }

  private async startBot(url: string) {
    await this.client.invoke(
      new Api.messages.SendMessage({
        peer: url,
        message: '/start',
      })
    );
  }

  private async startBotWithStartParam(url: string, startParam: string) {
    await this.client.invoke(
      new Api.messages.StartBot({
        bot: url,
        peer: url,
        startParam,
      })
    );
  }
}
