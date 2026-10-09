
export enum AppTab {
  CHAT = 'Chat',
  SEARCH = 'Search & Maps',
  CREATIVE = 'Creative Lab',
  AUDIO = 'Audio Hub',
  MUSIC = 'Music Studio',
  PREVIEWS = 'Series',
  LAW_MEDICAL = 'Law & Medical',
  CODE = 'Code Smith',
  HEALTH = 'Health Sync',
  DECOYS = 'First 5 Apps'
}

export enum SubscriptionTier {
  FREE = 'Free',
  PRO = 'Pro',
  ELITE = 'Elite'
}

export interface Attachment {
  url: string;
  mimeType: string;
  name?: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  attachments?: Attachment[];
  groundingLinks?: Array<{ title: string; uri: string }>;
  isThinking?: boolean;
}

export interface GeneratedAsset {
  type: 'image' | 'video';
  url: string;
  prompt: string;
  timestamp: number;
}
