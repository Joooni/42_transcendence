export interface Channel {
  id: string;
  name: string;
  ownerid: number;
  type: string;
  users: number[];
  admins: number[];
  muted: number[];
  invited: number[];
  banned: number[];

  hasUnreadMessagesToActiveUser?: boolean;
}
