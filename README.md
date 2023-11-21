# cf-discord-stream-notifier
Twitch stream to Discord notifier via webhook running on Cloudflare workers. Runs every 5 minutes on a cron timer.

<img width="551" alt="image" src="https://github.com/x8BitRain/cf-discord-stream-notifier/assets/15372551/5d84f9b8-1a5b-4f47-8557-52ac347bcd7b">

### How to use: 
1. Add your Twitch streamers to a whitelist in [index.ts here](https://github.com/x8BitRain/cf-discord-stream-notifier/blob/main/src/index.ts#L9)
2. Register a new application on the Twitch developers dashboard https://dev.twitch.tv/console/apps
3. Add your discord webhook URL, TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET to [wrangler.toml here ](https://github.com/x8BitRain/cf-discord-stream-notifier/blob/main/wrangler.toml)
  It's better to add TWITCH_CLIENT_SECRET as a secret in with `wrangler secret put` and put it into a `.dev.vars` file if you plan on forking this repo and making changes.
4. Publish with `wrangler publish`.
