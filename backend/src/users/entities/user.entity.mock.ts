import { User } from './user.entity';

export const createMockUser = (options: Partial<User> = {}): User => {
  const user = new User();
  user.id = 987654321;
  user.intra = 'logName';
  user.firstname = 'firstname';
  user.lastname = 'lastname';
  user.username = 'username';
  user.email = 'address@provider.com';
  user.picture = 'PictureLinkGoesHere.com';
  user.twoFAEnabled = false;
  user.twoFAsecret = null;
  user.status = 'mock';
  user.wins = 0;
  user.losses = 0;

  Object.assign(user, options);
  return user;
};

export const mockUser1: User = createMockUser({
  id: 4269,
  intra: 'dokong',
  firstname: 'Donkey',
  lastname: 'Kong',
  username: 'LoveBarrelsHateMario',
  email: 'redtiesrule@kongs.com',
  picture: 'https://mario.wiki.gallery/images/8/84/MPS_Donkey_Kong_Artwork.png',
  wins: 69,
  losses: 42,
});

export const mockUser2: User = createMockUser({
  id: 6942,
  intra: 'dikong',
  firstname: 'Diddy',
  lastname: 'Kong',
  username: 'BongosAreMyJam',
  email: 'redcapsrule@kongs.com',
  picture:
    'https://mario.wiki.gallery/images/thumb/0/06/DiddyKong2.png/1200px-DiddyKong2.png',
  wins: 42,
  losses: 69,
});
