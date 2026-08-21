import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const roles = {
  MERCHANT_ADMIN: [
    'MERCHANT_READ', 'MERCHANT_UPDATE', 'TRANSACTION_READ', 'TRANSACTION_CREATE',
    'TRANSACTION_UPDATE', 'RECOVERY_READ', 'RECOVERY_CREATE', 'RECOVERY_UPDATE',
    'POLICY_READ', 'POLICY_CREATE', 'POLICY_UPDATE', 'POLICY_DELETE',
    'EXPERIMENT_READ', 'EXPERIMENT_CREATE', 'EXPERIMENT_UPDATE', 'AUDIT_READ',
  ],
  MERCHANT_OPERATOR: [
    'MERCHANT_READ', 'TRANSACTION_READ', 'TRANSACTION_CREATE', 'TRANSACTION_UPDATE',
    'RECOVERY_READ', 'RECOVERY_CREATE', 'RECOVERY_UPDATE', 'POLICY_READ',
    'POLICY_UPDATE', 'EXPERIMENT_READ',
  ],
  ANALYST: [
    'MERCHANT_READ', 'TRANSACTION_READ', 'RECOVERY_READ', 'POLICY_READ',
    'EXPERIMENT_READ', 'AUDIT_READ',
  ],
} as const;

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  try {
    for (const roleName of Object.keys(roles) as Array<keyof typeof roles>) {
      const role = await prisma.role.upsert({
        where: { name: roleName },
        update: {},
        create: { name: roleName },
      });

      for (const permissionName of roles[roleName]) {
        const permission = await prisma.permission.upsert({
          where: { name: permissionName },
          update: {},
          create: { name: permissionName },
        });

        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: { roleId: role.id, permissionId: permission.id },
          },
          update: {},
          create: { roleId: role.id, permissionId: permission.id },
        });
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});