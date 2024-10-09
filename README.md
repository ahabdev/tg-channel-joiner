# tg-channel-joiner

Firstly you need to have bun installed, refer to: [bun installation](https://bun.sh/docs/installation)

To install dependencies:

```bash
bun install
```

Update .env file to your `API_ID`, `API_HASH` and `PROXY` to `true` or `false` depending on whether you're using one.. 

Add urls to join into `data/urls.txt` line by line.  
Add phone numbers of your users into `data/users.txt` line by line.  
Add proxies in format of `ip:port:username:password`  

To run:

```bash
bun start
```

This project was created using `bun init` in bun v1.1.29. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
