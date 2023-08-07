export interface Channel {
  id: string;
  name: string;
  ownerid: number;
  type: string; //ENUM: PUBLIC,PRIVATE,PASSWORD,DM
  users: number[];
  admins: number[];
  muted: number[];
  invited: number[];
  banned: number[];

  hasUnreadMessagesToActiveUser?: boolean;
}
