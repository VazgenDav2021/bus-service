import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

function generateQrToken(): string {
  return `QR-${randomBytes(16).toString('hex')}`;
}

async function main() {
  const hashedPassword = await bcrypt.hash('Admin123!', 12);

  const admin = await prisma.admin.upsert({
    where: { email: 'admin@municipality.gov' },
    update: {},
    create: {
      email: 'admin@municipality.gov',
      password: hashedPassword,
      name: 'Municipality Admin',
    },
  });

  const busOwner = await prisma.busOwner.upsert({
    where: { email: 'owner@bustransport.com' },
    update: {},
    create: {
      email: 'owner@bustransport.com',
      password: hashedPassword,
      name: 'Bus Transport Co',
      phone: '+1234567890',
    },
  });

  const driver = await prisma.driver.upsert({
    where: { email: 'driver@bustransport.com' },
    update: {
      ownerId: busOwner.id,
    },
    create: {
      email: 'driver@bustransport.com',
      password: hashedPassword,
      name: 'John Driver',
      phone: '+1234567891',
      ownerId: busOwner.id,
    },
  });

  const students = await Promise.all([
    prisma.student.upsert({
      where: { studentId: 'STU-001' },
      update: {},
      create: {
        studentId: 'STU-001',
        name: 'Alice Student',
        email: 'alice@university.edu',
      },
    }),
    prisma.student.upsert({
      where: { studentId: 'STU-002' },
      update: {},
      create: {
        studentId: 'STU-002',
        name: 'Bob Student',
        email: 'bob@university.edu',
      },
    }),
    prisma.student.upsert({
      where: { studentId: 'STU-003' },
      update: {},
      create: {
        studentId: 'STU-003',
        name: 'Carol Student',
        email: 'carol@university.edu',
      },
    }),
  ]);

  for (const student of students) {
    await prisma.qRCode.upsert({
      where: { studentId: student.id },
      update: {},
      create: {
        token: generateQrToken(),
        studentId: student.id,
      },
    });
  }

  console.log('Seed completed:');
  console.log('- Admin:', admin.email);
  console.log('- Bus Owner:', busOwner.email);
  console.log('- Driver:', driver.email, '(password: Admin123!)');
  console.log('- Students:', students.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
