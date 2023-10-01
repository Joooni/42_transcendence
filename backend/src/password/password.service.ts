import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcryptjs';

@Injectable()
export class PasswordService {
  async hashPassword(
    password: string | undefined,
  ): Promise<string | undefined> {
    console.log('i was in the passwordService');
    if (!password) {
      console.log('no password given');
      return undefined;
    }
    const saltRounds = 10;
    const hashedPassword = await hash(password, saltRounds);
    return hashedPassword;
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isMatch = await compare(password, hashedPassword);
    return isMatch;
  }
}
