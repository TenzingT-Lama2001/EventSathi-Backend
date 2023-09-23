import { User } from 'src/users/entities/user.entity';

export interface IExtendedUser extends User {
  my_roles: { role_id: string }[];
  my_permissions: string[];
}
