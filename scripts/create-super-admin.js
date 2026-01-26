require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createSuperAdmin() {
  // Read environment variables
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;
  const name = process.env.SUPER_ADMIN_NAME || 'Super Admin';

  // Validate required environment variables
  if (!email) {
    throw new Error('SUPER_ADMIN_EMAIL environment variable is required');
  }
  if (!password) {
    throw new Error('SUPER_ADMIN_PASSWORD environment variable is required');
  }

  try {
    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create or update Super Admin user
    const user = await prisma.users.upsert({
      where: { email },
      update: {
        role: 'SUPER_ADMIN',
        password: hashedPassword,
        name,
        plan: 'Pro',
        usageLimit: 999999,
        disabled: false,
      },
      create: {
        email,
        name,
        role: 'SUPER_ADMIN',
        password: hashedPassword,
        plan: 'Pro',
        usageLimit: 999999,
        disabled: false,
      },
    });

    console.log('Super Admin user processed successfully');
    console.log('Email:', email);
    console.log('Name:', name);
    console.log('Role: SUPER_ADMIN');
  } catch (error) {
    console.error('Error creating/updating Super Admin:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();