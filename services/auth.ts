import * as readline from 'readline';
import type { TelegramClient } from 'telegram';
import type { Auth } from '../types/auth';

export class TelegramAuth implements Auth {
  private readonly phoneNumber: string;
  private readonly rl: readline.Interface;
  private readonly client: TelegramClient;

  constructor(
    phoneNumber: string,
    rl: readline.Interface,
    client: TelegramClient
  ) {
    this.phoneNumber = phoneNumber;
    this.rl = rl;
    this.client = client;
  }

  async logIn(): Promise<void> {
    await this.client.start({
      phoneNumber: this.phoneNumber,
      password: async () =>
        new Promise((resolve) =>
          this.rl.question('Please enter your password: ', resolve)
        ),
      phoneCode: async () =>
        new Promise((resolve) =>
          this.rl.question('Please enter the code you received: ', resolve)
        ),
      onError: (error) => console.log(error),
    });
  }
}
