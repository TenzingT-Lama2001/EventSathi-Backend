import { User } from 'src/user/entity/user.entity';

export interface IExtendedUser extends User {
  my_roles: { role_id: string }[];
  my_permissions: string[];
}
