import { AppDataSource } from './data-source';
import { Printer } from './helpers/printer';
import {
  permission_categories,
  permissions,
  role_permissions,
  roles,
  user_roles,
  users,
} from './shared/seed-data';

const runSeed = async () => {
  for (const permission_out of permissions) {
    for (const permission_in of permissions) {
      if (
        permission_in.id === permission_out.id &&
        permission_in.title !== permission_out.title
      ) {
        Printer('WARNING DUPLICATE PERMISSION', {
          permission_in,
          permission_out,
        });
        return;
      }
    }
  }

  try {
    await AppDataSource.initialize();

    //Seeding permission categories
    await AppDataSource.query(
      `INSERT INTO permission_category (id,title) VALUES ${permission_categories
        .map(
          (permission_category) =>
            `('${permission_category.id}','${permission_category.title}')`,
        )
        .join(', ')} ON CONFLICT DO NOTHING`,
    );

    //Seeding permissions
    await AppDataSource.query(
      `INSERT INTO permission (id, permission_category_id, title) VALUES ${permissions
        .map(
          (permission) =>
            `('${permission.id}', '${permission.permission_category_id}', '${permission.title}')`,
        )
        .join(', ')} ON CONFLICT (id) DO NOTHING`,
    );

    //Seeding users
    await AppDataSource.query(
      `INSERT INTO users 
      (id,email,first_name,middle_name,last_name,address,phone_number,education_qualification,is_verified,is_active,password) VALUES
        ${users
          .map(
            (user) =>
              `('${user.id}','${user.email}','${user.first_name}','${user.middle_name}','${user.last_name}','${user.address}','${user.phone_number}','${user.education_qualification}',${user.is_verified},${user.is_active},'${user.password}')`,
          )
          .join(', ')} ON CONFLICT (id) DO NOTHING`,
    );

    //Seeding roles
    await AppDataSource.query(
      `INSERT INTO role (id,title,creator_id) VALUES ${roles
        .map((role) => `('${role.id}','${role.title}','${role.creator_id}')`)
        .join(', ')} ON CONFLICT (id) DO NOTHING`,
    );

    //Seeding role permissions
    await AppDataSource.query(
      `INSERT INTO role_permission (role_id,permission_id) VALUES ${role_permissions
        .map(
          (role_permission) =>
            `('${role_permission.role_id}','${role_permission.permission_id}')`,
        )
        .join(', ')} ON CONFLICT DO NOTHING`,
    );

    //Seeding user roles
    await AppDataSource.query(
      `INSERT INTO user_role (user_id,role_id) VALUES ${user_roles
        .map((user_role) => `('${user_role.user_id}','${user_role.role_id}')`)
        .join(', ')} ON CONFLICT DO NOTHING`,
    );
  } catch (err) {
    console.log(err);
  } finally {
    await AppDataSource.destroy();
  }
};

runSeed();
