export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export interface UserModel {
  id: string;
  username: string;
  locked: boolean;
  forcePasswordChange: boolean;
  memberId: string;
  roles: Role[];
}
