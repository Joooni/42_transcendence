export interface User {
  id: number;
  intra: string;
  email: string;
  picture: string;
  twoFAEnabled: boolean;
  twoFAsecret?: string;
  status: string;
  wins: number;
  losses: number;
  xp: number;
  rank: number;
  map: number;
  achievements: number[];
  isLoggedIn: boolean;
  hasUnreadMessagesToActiveUser?: boolean;
}
