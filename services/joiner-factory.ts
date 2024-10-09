import { Api, TelegramClient } from 'telegram';
import type { TelegramAuth } from './auth';
import { parseUrl } from '../shared/utils/parse-url';
import { BotJoiner } from './bot-joiner';
import { ChannelJoiner } from './channel-joiner';

export class JoinerFactory {
  private client: TelegramClient;
  private readonly authenticator: TelegramAuth;
  private readonly botJoiner: BotJoiner;
  private readonly channelJoiner: ChannelJoiner;
  private id?: Api.long;
  private username?: string;

  constructor(client: TelegramClient, authenticator: TelegramAuth) {
    this.client = client;
    this.authenticator = authenticator;
    this.botJoiner = new BotJoiner(this.client);
    this.channelJoiner = new ChannelJoiner(this.client);
  }

  // Start the whole proccess
  async start(urls: string[]) {
    try {
      await this.authenticator.logIn();
      const { id, username } = await this.client.getMe();
      this.id = id;
      this.username = username;
      this.client.session.save();
      this.joinBatch(urls);
    } catch (error) {
      console.log(error);
    }
  }

  private async joinBatch(urls: string[]) {
    for (const url of urls) {
      await this.join(url);
      console.log(`${this.username} joined ${url}`);
    }
  }

  private async join(url: string) {
    const { baseUrl, shortName, startParam } = parseUrl(url);
    const entity = await this.client.getEntity(baseUrl);

    if (entity.className === 'User' && entity.bot) {
      this.botJoiner.join(baseUrl, startParam);
    } else if (entity.className === 'Channel') {
      this.channelJoiner.join(baseUrl);
    }
  }
}
