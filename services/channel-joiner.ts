import { Api, type TelegramClient } from 'telegram';

export class ChannelJoiner {
  private readonly client: TelegramClient;

  constructor(client: TelegramClient) {
    this.client = client;
  }

  async join(url: string): Promise<void> {
    await this.client.invoke(
      new Api.channels.JoinChannel({
        channel: url,
      })
    );
  }
}
