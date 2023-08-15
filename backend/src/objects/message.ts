import { Channel } from 'src/channels/entities/channel.entity';
import { User } from './user';

export interface MessageObj {
  id?: number;
  sender: User;
  receiverUser?: User;
  receiverChannel?: Channel;
  timestamp: Date;
  content: string;
}
