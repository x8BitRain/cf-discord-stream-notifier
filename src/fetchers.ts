export interface TwitchUserData {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name: string;
  type: string;
  title: string;
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: string;
  tag_ids: string[];
  tags: string[];
  is_mature: Boolean;
}

export interface TwitchOAuthResponse {
  access_token: string;
  expires_in: number;
  token_type: 'bearer';
}

interface TwitchAPIResponse {
  data: TwitchUserData[] | [];
}

export const checkChannelStatus = async (
  channelList: string[],
  env: any
): Promise<TwitchAPIResponse | undefined> => {
  const oauth = (await getTwitchOAuthToken(env))?.access_token;
  if (!oauth) return;
  const queryString = channelList.reduce((acc, name) => {
    return acc + `&user_login=${name}`;
  }, '');

  try {
    const response = await fetch(
      `https://api.twitch.tv/helix/streams?${queryString}`,
      {
        headers: {
          'Client-ID': env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${oauth}`
        }
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Failed to grab twitch user statuses', error);
  }
};

export const getTwitchOAuthToken = async (
  env: any
): Promise<TwitchOAuthResponse | undefined> => {
  const details = {
    client_id: env.TWITCH_CLIENT_ID,
    client_secret: env.TWITCH_CLIENT_SECRET,
    grant_type: 'client_credentials'
  };

  const formBody = Object.entries(details)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join('&');

  try {
    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody
    });
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
};

export const sendMessageToWebhook = async (
  liveChannel: TwitchUserData,
  webhook: string
) => {
  const content = `**${liveChannel.user_login}** is live with ${liveChannel.title}! \nhttps://twitch.tv/${liveChannel.user_login}`;
  try {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    });

    if (response.ok) {
      console.info('Message sent successfully!');
    } else {
      console.error(
        'Error sending message:',
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
};
