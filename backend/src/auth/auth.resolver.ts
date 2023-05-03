import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateAuthInput } from './dto/create-auth.input';
import { UpdateAuthInput } from './dto/update-auth.input';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation('createAuth')
  create(@Args('createAuthInput') createAuthInput: CreateAuthInput) {
    return this.authService.create(createAuthInput);
  }

  @Query('auth')
  findAll() {
    return this.authService.findAll();
  }

  @Query('auth')
  findOne(@Args('id') id: number) {
    return this.authService.findOne(id);
  }

  @Mutation('updateAuth')
  update(@Args('updateAuthInput') updateAuthInput: UpdateAuthInput) {
    return this.authService.update(updateAuthInput.id, updateAuthInput);
  }

  @Mutation('removeAuth')
  remove(@Args('id') id: number) {
    return this.authService.remove(id);
  }
}
