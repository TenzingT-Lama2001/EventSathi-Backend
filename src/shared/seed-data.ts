import { User } from '../users/entities/user.entity';
import { PermissionType } from '../role/enum/permissions.enum';
import { Role } from '../role/entities/role.entity';
import { RolePermission } from '../role/entities/role-permission.entity';
import { RoleType } from '../role/enum/roles.enum';
import { PermissionCategory } from '../role/entities/permission-category.entity';
import { Permission } from '../role/entities/permission.entity';
import { UserRole } from '../role/entities/user-role.entity';

type Users = Partial<User>[];
type Roles = Partial<Role>[];
type RolePermissions = Partial<RolePermission>[];
type PermissionCategories = Partial<PermissionCategory>[];
type Permissions = Partial<Permission>[];
type UserRoles = Partial<UserRole>[];

export const permission_categories: PermissionCategories = [
  { id: '7c95e81e-2c84-49e1-8b76-7bc4b8ad3dfc', title: 'ROLE_AND_PERMISSION' },
  { id: 'b7adfe6e-862e-41ea-b626-e4356eee2af3', title: 'PRODUCT' },
  { id: 'b7adfe6e-862e-41ea-b626-e4356eee2af4', title: 'EVENT' },
];

export const permissions: Permissions = [
  //ROLE AND PERMISSIONS
  {
    id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59217',
    permission_category_id: '7c95e81e-2c84-49e1-8b76-7bc4b8ad3dfc',
    title: PermissionType.MANAGE_ROLE,
  },
  {
    id: '6ae44f02-b5ef-4de7-8102-10c2af1d9524',
    permission_category_id: '7c95e81e-2c84-49e1-8b76-7bc4b8ad3dfc',
    title: PermissionType.CREATE_ROLE,
  },
  {
    id: '67065865-520a-44fe-aa42-cad5cba7cb22',
    permission_category_id: '7c95e81e-2c84-49e1-8b76-7bc4b8ad3dfc',
    title: PermissionType.DELETE_ROLE,
  },
  {
    id: 'c6581210-8850-4cc7-abe5-66719516be2c',
    permission_category_id: '7c95e81e-2c84-49e1-8b76-7bc4b8ad3dfc',
    title: PermissionType.UPDATE_ROLE,
  },
  {
    id: 'aa741756-07fb-4411-9c10-2d47f17936de',
    permission_category_id: '7c95e81e-2c84-49e1-8b76-7bc4b8ad3dfc',
    title: PermissionType.GET_ALL_ROLE,
  },
  {
    id: '3d9a4288-135e-4b22-aba6-7ca84fec4469',
    permission_category_id: '7c95e81e-2c84-49e1-8b76-7bc4b8ad3dfc',
    title: PermissionType.ASSIGN_ROLE,
  },
  {
    id: '462a4fac-9d42-40b4-a0c1-d800c7d33bed',
    permission_category_id: '7c95e81e-2c84-49e1-8b76-7bc4b8ad3dfc',
    title: PermissionType.UNASSIGN_ROLE,
  },
  //PRODUCT
  {
    id: 'da7ac708-0341-4500-bc51-06b94d0eb418',
    permission_category_id: 'b7adfe6e-862e-41ea-b626-e4356eee2af3',
    title: PermissionType.MANAGE_PRODUCT,
  },
  {
    id: '8d1c64b2-1084-49a9-af4a-a40d86856d39',
    permission_category_id: 'b7adfe6e-862e-41ea-b626-e4356eee2af3',
    title: PermissionType.CREATE_PRODUCT,
  },
  {
    id: '37cfd5dc-dfcb-44e6-a222-931d03b82b31',
    permission_category_id: 'b7adfe6e-862e-41ea-b626-e4356eee2af3',
    title: PermissionType.DELETE_PRODUCT,
  },
  {
    id: 'e64d5a97-52af-48eb-a3cb-0fc0c1897ba8',
    permission_category_id: 'b7adfe6e-862e-41ea-b626-e4356eee2af3',
    title: PermissionType.UPDATE_PRODUCT,
  },
  {
    id: 'ba3d1e9c-3878-4415-a511-8486ff20432b',
    permission_category_id: 'b7adfe6e-862e-41ea-b626-e4356eee2af3',
    title: PermissionType.GET_ALL_PRODUCT,
  },

  //EVENT
  {
    id: 'ba3d1e9c-3878-4415-a511-8486ff20432c',
    permission_category_id: 'b7adfe6e-862e-41ea-b626-e4356eee2af4',
    title: PermissionType.MANAGE_EVENT,
  },
  {
    id: 'ba3d1e9c-3878-4415-a511-8486ff20432d',
    permission_category_id: 'b7adfe6e-862e-41ea-b626-e4356eee2af4',
    title: PermissionType.CREATE_EVENT,
  },
  {
    id: 'ba3d1e9c-3878-4415-a511-8486ff20432e',
    permission_category_id: 'b7adfe6e-862e-41ea-b626-e4356eee2af4',
    title: PermissionType.DELETE_EVENT,
  },
  {
    id: 'ba3d1e9c-3878-4415-a511-8486ff20432f',
    permission_category_id: 'b7adfe6e-862e-41ea-b626-e4356eee2af4',
    title: PermissionType.UPDATE_EVENT,
  },
  {
    id: 'aa3d1e9c-3878-4415-a511-8486ff20432f',
    permission_category_id: 'b7adfe6e-862e-41ea-b626-e4356eee2af4',
    title: PermissionType.GET_ALL_EVENT,
  },
  {
    id: 'ca3d1e9c-3878-4415-a511-8486ff20432f',
    permission_category_id: 'b7adfe6e-862e-41ea-b626-e4356eee2af4',
    title: PermissionType.GET_EVENT,
  },
];

export const users: Users = [
  {
    id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59211',
    email: 'admin@gmail.com',
    first_name: 'Admin',
    middle_name: 'Middle',
    last_name: 'Lama',
    address: 'Kathmandu',
    phone_number: '9840000000',
    education_qualification: 'Bachelors',
    is_verified: true,
    is_active: true,
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$MOXgZg8YOYDI/mhcDRURSA$Mv9T3b+OLKSiazlS99enN33etDohnQvM6qVri8OWInQ',
  },
  {
    id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59322',
    email: 'user@gmail.com',
    first_name: 'User',
    middle_name: 'Middle',
    last_name: 'Lama',
    address: 'Pokhara',
    phone_number: '98330300303',
    education_qualification: 'Masters',
    is_verified: true,
    is_active: true,
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$MOXgZg8YOYDI/mhcDRURSA$Mv9T3b+OLKSiazlS99enN33etDohnQvM6qVri8OWInQ',
  },
  {
    id: 'c126c8bf-76a9-4cc7-bb34-695da4a59113',
    email: 'user_organizer@gmail.com',
    first_name: 'UserOrganizer',
    middle_name: 'Middle',
    last_name: 'Lama',
    address: 'Pokhara',
    phone_number: '98330300303',
    education_qualification: 'Masters',
    is_verified: true,
    is_active: true,
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$MOXgZg8YOYDI/mhcDRURSA$Mv9T3b+OLKSiazlS99enN33etDohnQvM6qVri8OWInQ',
  },
];

export const roles: Roles = [
  {
    id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59212',
    title: RoleType.ADMIN,
    creator_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59211',
  },
  {
    id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59213',
    title: RoleType.USER,
    creator_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59211',
  },
  {
    id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59214',
    title: RoleType.ORGANIZER,
    creator_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59211',
  },
];

export const role_permissions: RolePermissions = [
  //ADMIN
  //ROLE AND PERMISSIONS
  {
    role_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59212',
    permission_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59217',
  },
  {
    role_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59212',
    permission_id: '6ae44f02-b5ef-4de7-8102-10c2af1d9524',
  },
  {
    role_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59212',
    permission_id: '67065865-520a-44fe-aa42-cad5cba7cb22',
  },
  {
    role_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59212',
    permission_id: 'c6581210-8850-4cc7-abe5-66719516be2c',
  },
  {
    role_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59212',
    permission_id: 'aa741756-07fb-4411-9c10-2d47f17936de',
  },
  {
    role_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59212',
    permission_id: '3d9a4288-135e-4b22-aba6-7ca84fec4469',
  },
  {
    role_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59212',
    permission_id: '462a4fac-9d42-40b4-a0c1-d800c7d33bed',
  },
  {
    role_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59212',
    permission_id: 'ba3d1e9c-3878-4415-a511-8486ff20432c',
  },
  {
    role_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59212',
    permission_id: 'ba3d1e9c-3878-4415-a511-8486ff20432d',
  },
  {
    role_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59212',
    permission_id: 'ba3d1e9c-3878-4415-a511-8486ff20432e',
  },
  {
    role_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59212',
    permission_id: 'ba3d1e9c-3878-4415-a511-8486ff20432f',
  },
  {
    role_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59212',
    permission_id: 'aa3d1e9c-3878-4415-a511-8486ff20432f',
  },
  {
    role_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59212',
    permission_id: 'ca3d1e9c-3878-4415-a511-8486ff20432f',
  },

  //PRODUCT
  {
    role_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59212',
    permission_id: 'da7ac708-0341-4500-bc51-06b94d0eb418',
  },
  {
    role_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59212',
    permission_id: '8d1c64b2-1084-49a9-af4a-a40d86856d39',
  },
  {
    role_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59212',
    permission_id: '37cfd5dc-dfcb-44e6-a222-931d03b82b31',
  },
  {
    role_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59212',
    permission_id: 'e64d5a97-52af-48eb-a3cb-0fc0c1897ba8',
  },
  {
    role_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59212',
    permission_id: 'ba3d1e9c-3878-4415-a511-8486ff20432b',
  },

  //USER
  //PRODUCT
  //GET ALL PRODUCT
  {
    role_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59213',
    permission_id: 'ba3d1e9c-3878-4415-a511-8486ff20432b',
  },
  //ORGANIZER
  //EVENT
  {
    role_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59214',
    permission_id: 'ba3d1e9c-3878-4415-a511-8486ff20432c',
  },
  {
    role_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59214',
    permission_id: 'ba3d1e9c-3878-4415-a511-8486ff20432d',
  },
  {
    role_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59214',
    permission_id: 'ba3d1e9c-3878-4415-a511-8486ff20432e',
  },
  {
    role_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59214',
    permission_id: 'ba3d1e9c-3878-4415-a511-8486ff20432f',
  },
  {
    role_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59214',
    permission_id: 'aa3d1e9c-3878-4415-a511-8486ff20432f',
  },
  {
    role_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59214',
    permission_id: 'ca3d1e9c-3878-4415-a511-8486ff20432f',
  },
  //ORGANIZER ROLE HAVING CREATE_PRODUCT PERMISSION FOR TESTING
  {
    role_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59214',
    permission_id: '8d1c64b2-1084-49a9-af4a-a40d86856d39',
  },
];

export const user_roles: UserRoles = [
  {
    user_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59211',
    role_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59212',
  },
  {
    user_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59322',
    role_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59213',
  },

  {
    user_id: 'c126c8bf-76a9-4cc7-bb34-695da4a59113',
    role_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59213',
  },
  {
    user_id: 'c126c8bf-76a9-4cc7-bb34-695da4a59113',
    role_id: 'a8f6c8bf-76a9-4cc7-bb34-695da4a59214',
  },
];
