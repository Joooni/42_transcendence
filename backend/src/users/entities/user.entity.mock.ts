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
  user.status = 'online';
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
  wins: 0,
  losses: 0,
});

export const mockUsers: User[] = [
  createMockUser({
    id: 1,
    intra: 'dikong',
    firstname: 'Diddy',
    lastname: 'Kong',
    username: 'RedCapsRule',
    email: 'redcapsle@kongs.com',
    picture: 'https://www.mariowiki.com/Diddy_Kong#/media/File:DiddyKong2.png',
    wins: 4,
    losses: 9,
  }),
  createMockUser({
    id: 2,
    intra: 'lakong',
    firstname: 'Lanky',
    lastname: 'Kong',
    username: 'LongArmMaster',
    email: 'lanky@kongs.com',
    picture:
      'https://mario.wiki.gallery/images/thumb/b/bf/Lankyblast.jpg/1200px-Lankyblast.jpg',
    wins: 41,
    losses: 9,
  }),
  createMockUser({
    id: 3,
    intra: 'tikong',
    firstname: 'Tiny',
    lastname: 'Kong',
    username: 'gurlpower',
    email: 'tiny@kongs.com',
    picture:
      'https://mario.wiki.gallery/images/thumb/8/81/Tiny_Kong_MSS_art.png/200px-Tiny_Kong_MSS_art.png',
    wins: 100,
    losses: 100,
  }),
  createMockUser({
    id: 4,
    intra: 'chunkykong',
    firstname: 'Chunky',
    lastname: 'Kong',
    username: 'Afraidycat',
    email: 'chunky@kongs.com',
    picture:
      'https://mario.wiki.gallery/images/thumb/8/81/SSBU_Chunky_Kong_Spirit.png/200px-SSBU_Chunky_Kong_Spirit.png',
    wins: 100,
    losses: 100,
  }),
];
