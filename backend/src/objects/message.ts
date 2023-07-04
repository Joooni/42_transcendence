import { User } from './user';
import { Channel } from './channel';

export interface MessageObj {
  id?: number;
  sender: User;
  receiver: User | Channel;
  timestamp: Date;
  content: string;
}
