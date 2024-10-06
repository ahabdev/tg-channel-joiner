import readline from 'readline';
import * as fs from 'fs/promises';
import { ChannelJoiner } from './services/channel-joiner';
import { config } from './shared/config';
import type { Proxy } from './types/proxy';
import { TelegramAuth } from './services/auth';
import { StoreSession } from 'telegram/sessions';
import { TelegramClient } from 'telegram';
import { splitProxy } from './shared/utils/split-proxy';

const API_ID = +config.api.id!;
const API_HASH = config.api.hash!;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

(async () => {
  try {
    const datas = await Promise.all([
      fs.readFile('data/users.txt', 'utf-8'),
      fs.readFile('data/proxy.txt', 'utf-8'),
      fs.readFile('data/channels.txt', 'utf-8'),
    ]);
    const [numbers, proxies, channels] = datas.map((data) => {
      return data.split('\n').map((d) => d.trim());
    });
    let proxy: Proxy | undefined;

    for (const i in numbers) {
      if (config.proxy === 'true') {
        proxy = splitProxy(proxies[i]);
      }

      const storeSession = new StoreSession(`sessions/${numbers[i]}`);
      const client = new TelegramClient(storeSession, API_ID, API_HASH, {
        connectionRetries: 5,
        autoReconnect: true,
        proxy,
      });
      const authenticator = new TelegramAuth(numbers[i], rl, client);
      const channelJoiner = new ChannelJoiner(client, authenticator);
      await channelJoiner.start();
      await channelJoiner.joinChannelBatch(channels);
    }

    console.log('All users processed');
  } catch (error) {
    console.error(error);
  }
})();
