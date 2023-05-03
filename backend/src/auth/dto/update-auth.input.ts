import { CreateAuthInput } from './create-auth.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateAuthInput extends PartialType(CreateAuthInput) {
  id: number;
}
