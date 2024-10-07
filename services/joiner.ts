import { Api, TelegramClient } from 'telegram';
import type { TelegramAuth } from './auth';

export class Joiner {
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

  async joinBatch(urls: string[]) {
    try {
      for (const url of urls) {
        await this.join(url);
        console.log(`${this.username} joined ${url}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  private async join(url: string) {
    try {
      const entity = await this.client.getEntity(url);
      if (entity.className === 'User' && entity.bot) {
        await this.joinBot(url);
      } else if (entity.className === 'Channel') {
        this.joinChannel(url);
      }
    } catch (error) {
      console.log(error);
    }
  }

  private async joinBot(url: string) {
    try {
      const startAppValue =
        new URLSearchParams(url.split('?')[1]).get('startapp') ?? undefined;
      await this.client.invoke(
        new Api.messages.StartBot({
          bot: url,
          startParam: startAppValue,
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  private async joinChannel(url: string) {
    try {
      await this.client.invoke(
        new Api.channels.JoinChannel({
          channel: url,
        })
      );
    } catch (error) {
      console.log(error);
    }
  }
}
