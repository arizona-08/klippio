import { User } from './interfaces/user.interface';

export type PublicUser = Omit<
  User,
  | 'password'
  | 'forgotPasswordTokenSelector'
  | 'forgotPasswordToken'
  | 'forgotPasswordTokenExpiry'
>;

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    role: user.role,
    isBanned: user.isBanned,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    profilePicture: user.profilePicture,
    bannerPicture: user.bannerPicture,
  };
}
