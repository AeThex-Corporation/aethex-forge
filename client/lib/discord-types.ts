export interface DiscordUser {
  id: string;
  username: string;
  avatar?: string | null;
  email?: string | null;
  discriminator?: string;
}

export interface DiscordSDKUser {
  id: string;
  username: string;
  discriminator?: string;
  avatar?: string | null;
  email?: string | null;
  verified?: boolean;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  public_flags?: number;
}

export interface DiscordSDK {
  ready: () => Promise<void>;
  user: {
    getMe: () => Promise<DiscordSDKUser>;
  };
  commands?: {
    authorize: (options: {
      client_id: string;
      response_type: string;
      scope: string[];
    }) => Promise<{ code: string }>;
    getChannel: (id: string) => Promise<any>;
  };
  subscribe?: (
    event: string,
    callback: (data: any) => void,
  ) => () => void;
}

declare global {
  interface Window {
    DiscordSDK?: DiscordSDK;
    discordSdkReady?: boolean;
  }
}
