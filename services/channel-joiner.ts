import { Api, TelegramClient } from 'telegram';
import type { TelegramAuth } from './auth';

export class ChannelJoiner {
  private readonly client: TelegramClient;
  private readonly authenticator: TelegramAuth;
  private id?: Api.long;
  private username?: string;

  constructor(client: TelegramClient, authenticator: TelegramAuth) {
    this.client = client;
    this.authenticator = authenticator;
  }

  // Start the whole proccess
  async start() {
    try {
      await this.authenticator.logIn();
      const { id, username } = await this.client.getMe();
      this.id = id;
      this.username = username;
      this.client.session.save();
    } catch (error) {
      console.log(error);
    }
  }

  private async joinChannel(channel: string) {
    const result = await this.client.invoke(
      new Api.channels.JoinChannel({
        channel,
      })
    );
  }

  async joinChannelBatch(channels: string[]) {
    for (const channel of channels) {
      await this.joinChannel(channel);
      console.log(`${this.username} joined ${channel}`);
    }
  }
}
