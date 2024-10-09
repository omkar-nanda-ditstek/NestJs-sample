// src/migrations/create-roles-permissions.ts
import Roles, { Permissions } from '../../src/common/enums/Roles';

import { getDb } from '../migrations-utils/db';

export const up = async () => {
  const db = await getDb();
  const superAdminPermissions = [ Permissions.CREATE, Permissions.READ, Permissions.UPDATE, Permissions.DELETE ]
  const adminPermissions = [Permissions.CREATE, Permissions.READ, Permissions.UPDATE];
  const userPermissions = [ Permissions.READ ];

  const roles = [
    {
      role: Roles.SUPER_ADMIN,
      permissions: superAdminPermissions.map((p) => p),
    },
    {
      role: Roles.ADMIN,
      permissions: adminPermissions.map((p) => p),
    },
    {
      role: Roles.USER,
      permissions: userPermissions.map((p) => p),
    },
  ];
  // Create roles
  try {
    await db.collection('roles').updateMany(roles);
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      console.error('Duplicate key error:', error.message);
    } else {
      console.error('Error inserting roles:', error);
    }
  }
};

export const down = async () => {
  const db = await getDb();
  await db.collection('roles').drop();
};

