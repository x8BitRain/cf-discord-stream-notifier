import { KVNamespace } from '@cloudflare/workers-types';
import { checkChannelStatus, sendMessageToWebhook } from './fetchers';

interface ChannelStatuses {
  LIVE: string[];
  OFFLINE: string[];
}

const channelWhitelist = [
  'bitrain',
  'MuntedLIVE',
  'ExtraVirus',
  'Buffet_Time',
  'KaNangaTV',
  'Muty71',
  'ConnorAce_',
  'Proto',
  'Chinese_soup',
  'D0tv',
  'Structuralfailure',
  'IkerPineapple',
  'maxam',
  'canteven',
  'LotsOfS',
  'waezone',
  'maltemller',
  'coolkid',
  'callmeliam',
  'peroquenariz',
  'naz_atk',
  'bitrain',
  'Fnzzy',
  'BiSaXa',
  'yalter',
  'execut4ble',
  'sourceruns',
  'kllz',
  'griffinw',
  'elgu',
  'thisis2838',
  'LyrenMeow',
  'ayb_hl',
  'Tankfird'
];

const startStreamCheck = async (env: any): Promise<ChannelStatuses> => {
  const webhook = env.WEBHOOK;
  const channels =
    JSON.parse(await env.SOURCERUNS_STREAM_NOTIF.get('channels')) || {};

  const statuses = await checkChannelStatus(channelWhitelist, env);

  for (const channel of channelWhitelist) {
    const channelIsLive = statuses?.data.find(
      (userData) => userData.user_login.toLowerCase() === channel.toLowerCase()
    );
    const channelIsOfflineCacheStatus = channels[channel] === 'offline';

    if (channelIsLive) {
      channels[channel] = 'live';
      // If the streamer is live but the cache says they weren't live previously,
      // set the streamer's status in cache to live and trigger the webhook.
      if (channelIsOfflineCacheStatus) {
        await sendMessageToWebhook(channelIsLive, webhook);
      }
    }

    if (!channelIsLive) {
      channels[channel] = 'offline';
    }
  }
  await env.SOURCERUNS_STREAM_NOTIF.put('channels', JSON.stringify(channels));
  return channels;
};

export default {
  async fetch(request: Request, env: Record<string, KVNamespace | string>) {
    if (new URL(request.url).pathname === '/') {
      const statuses = await startStreamCheck(env);
      return new Response(JSON.stringify(statuses));
    } else {
      return new Response('');
    }
  },
  async scheduled(event: any, env: any) {
    await startStreamCheck(env);
  }
};
