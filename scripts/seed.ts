/**
 * SDWA Database Seed Script
 * 
 * Populates Firestore with initial data:
 * - Association settings
 * - Achievement categories (6)
 * - Achievement levels (5)
 * - Weight divisions (4)
 * - Weight classes
 * - Affiliated institutions (17)
 * 
 * Usage: npm run seed
 * Requires: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env.local
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// ─── Initialize Firebase Admin ──────────────────────────────────────────────

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!projectId) {
  console.error('❌ FIREBASE_PROJECT_ID is not set in .env.local');
  process.exit(1);
}

if (getApps().length === 0) {
  if (clientEmail && privateKey) {
    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
  } else {
    initializeApp({ projectId });
  }
}

const db = getFirestore();
const auth = getAuth();

// ─── Helper ─────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ─── Seed Data ──────────────────────────────────────────────────────────────

async function seedAssociationSettings() {
  console.log('📋 Seeding association settings...');

  await db.collection('settings').doc('association').set({
    name: 'Salem District Weightlifting Association',
    shortName: 'SDWA',
    registrationNumber: '112 / 2020',
    affiliation: {
      organizationName: 'Tamil Nadu State Weightlifting Association',
      relationship: 'Affiliated to',
    },
    address: 'Shiv, Shaktinagar, Salem, Tamil Nadu 636201',
    phone: '09944301212',
    email: 'shanmugamsdwa@gmail.com',
    logoUrl: '',
    googleMapsEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3907.9050662374866!2d78.13689007010963!3d11.630114717643819!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3babefd6fceb62a3%3A0xf3581da1e2038658!2sISHA%20GYM%20Weightlifting%20sports%20academy!5e0!3m2!1sen!2sin!4v1786905574773!5m2!1sen!2sin',
    description: '',
    mission: '',
    vision: '',
    socialLinks: {
      instagram: 'https://www.instagram.com/isha_gym_shanmugam?igsh=MnlneHF1ZG9wb2Ny',
      facebook: 'https://www.facebook.com/share/14kUMAKhV4x',
      youtube: 'https://youtube.com/@ishagym_salem_tn?si=gxU5QBkCYOTBjxYb',
    },
    workingHours: [
      {
        day: 'Saturday',
        open: '06:00',
        close: '22:00',
        note: 'Hours might differ',
      },
      {
        day: 'Sunday',
        open: '06:30',
        close: '10:00',
      },
      {
        day: 'Monday',
        open: '06:00',
        close: '21:00',
      },
      {
        day: 'Tuesday',
        open: '06:00',
        close: '21:00',
      },
      {
        day: 'Wednesday',
        open: '06:00',
        close: '21:00',
      },
      {
        day: 'Thursday',
        open: '06:00',
        close: '21:00',
      },
      {
        day: 'Friday',
        open: '06:00',
        close: '21:00',
      },
    ],
  });

  console.log('  ✅ Association settings created');
}

async function seedCommitteeMembers() {
  console.log('👥 Seeding committee members...');

  const committee = [
    { name: 'L.R. Marconi', designation: 'President', position: 'President', displayOrder: 1 },
    { name: 'S. Shanmugam', designation: 'Secretary', position: 'Secretary', displayOrder: 2 },
    { name: 'G. Thilagam', designation: 'Treasurer', position: 'Treasurer', displayOrder: 3 },
    { name: 'T.V. Rajagopalan', designation: 'Vice-President', position: 'Vice-President', displayOrder: 4 },
    { name: 'T. Muthukumar', designation: 'Vice-President', position: 'Vice-President', displayOrder: 5 },
    { name: 'V. Ponnusamy', designation: 'Joint Secretary', position: 'Joint Secretary', displayOrder: 6 },
    { name: 'I.S. Sneha', designation: 'Joint Secretary', position: 'Joint Secretary', displayOrder: 7 },
    { name: 'R. Ranjithkumar', designation: 'Executive Member', position: 'Executive Member', displayOrder: 8 },
    { name: 'S. Revathi', designation: 'Executive Member', position: 'Executive Member', displayOrder: 9 },
    { name: 'K. Viknesh', designation: 'Executive Member', position: 'Executive Member', displayOrder: 10 },
    { name: 'S. Vijayagaravan', designation: 'Executive Member', position: 'Executive Member', displayOrder: 11 },
  ];

  const batch = db.batch();
  for (const member of committee) {
    const ref = db.collection('committeeMembers').doc();
    batch.set(ref, {
      name: member.name,
      designation: member.designation,
      position: member.position,
      description: 'Executive committee member of Salem District Weightlifting Association.',
      photoUrl: '',
      photoPublicId: '',
      displayOrder: member.displayOrder,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  await batch.commit();

  console.log(`  ✅ ${committee.length} committee members created`);
}

async function seedAchievementCategories() {
  console.log('🏋️ Seeding achievement categories...');

  const categories = [
    { name: 'Senior Men', displayOrder: 1 },
    { name: 'Junior Men', displayOrder: 2 },
    { name: 'Senior Women', displayOrder: 3 },
    { name: 'Junior Women', displayOrder: 4 },
    { name: 'Youth Boys', displayOrder: 5 },
    { name: 'Youth Girls', displayOrder: 6 },
  ];

  const batch = db.batch();
  for (const cat of categories) {
    const ref = db.collection('achievementCategories').doc();
    batch.set(ref, {
      name: cat.name,
      slug: slugify(cat.name),
      description: '',
      displayOrder: cat.displayOrder,
      isActive: true,
    });
  }
  await batch.commit();

  console.log(`  ✅ ${categories.length} achievement categories created`);
}

async function seedAchievementLevels() {
  console.log('📊 Seeding achievement levels...');

  const levels = [
    { name: 'District', displayOrder: 1 },
    { name: 'Zonal', displayOrder: 2 },
    { name: 'State', displayOrder: 3 },
    { name: 'National', displayOrder: 4 },
    { name: 'International', displayOrder: 5 },
  ];

  const batch = db.batch();
  for (const level of levels) {
    const ref = db.collection('achievementLevels').doc();
    batch.set(ref, {
      name: level.name,
      slug: slugify(level.name),
      displayOrder: level.displayOrder,
      isActive: true,
    });
  }
  await batch.commit();

  console.log(`  ✅ ${levels.length} achievement levels created`);
}

async function seedWeightDivisions() {
  console.log('⚖️ Seeding weight divisions...');

  const divisions = [
    { name: 'Senior & Junior Men', displayOrder: 1 },
    { name: 'Senior & Junior Women', displayOrder: 2 },
    { name: 'Youth Boys', displayOrder: 3 },
    { name: 'Youth Girls', displayOrder: 4 },
  ];

  const divisionRefs: Record<string, string> = {};
  const batch = db.batch();

  for (const div of divisions) {
    const ref = db.collection('weightDivisions').doc();
    divisionRefs[div.name] = ref.id;
    batch.set(ref, {
      name: div.name,
      slug: slugify(div.name),
      displayOrder: div.displayOrder,
      isActive: true,
    });
  }
  await batch.commit();

  console.log(`  ✅ ${divisions.length} weight divisions created`);
  return divisionRefs;
}

async function seedWeightClasses(divisionRefs: Record<string, string>) {
  console.log('🏋️‍♂️ Seeding weight classes...');

  const weightClassData: {
    division: string;
    classes: { value: number | null; minimumWeight?: number; displayValue: string }[];
  }[] = [
    {
      division: 'Senior & Junior Men',
      classes: [
        { value: 55, displayValue: '55 kg' },
        { value: 61, displayValue: '61 kg' },
        { value: 67, displayValue: '67 kg' },
        { value: 73, displayValue: '73 kg' },
        { value: 81, displayValue: '81 kg' },
        { value: 89, displayValue: '89 kg' },
        { value: 96, displayValue: '96 kg' },
        { value: 102, displayValue: '102 kg' },
        { value: 109, displayValue: '109 kg' },
        { value: null, minimumWeight: 109, displayValue: '+109 kg' },
      ],
    },
    {
      division: 'Senior & Junior Women',
      classes: [
        { value: 45, displayValue: '45 kg' },
        { value: 49, displayValue: '49 kg' },
        { value: 55, displayValue: '55 kg' },
        { value: 59, displayValue: '59 kg' },
        { value: 64, displayValue: '64 kg' },
        { value: 71, displayValue: '71 kg' },
        { value: 76, displayValue: '76 kg' },
        { value: 81, displayValue: '81 kg' },
        { value: 87, displayValue: '87 kg' },
        { value: null, minimumWeight: 87, displayValue: '+87 kg' },
      ],
    },
    {
      division: 'Youth Boys',
      classes: [
        { value: 49, displayValue: '49 kg' },
        { value: 55, displayValue: '55 kg' },
        { value: 61, displayValue: '61 kg' },
        { value: 67, displayValue: '67 kg' },
        { value: 73, displayValue: '73 kg' },
        { value: 81, displayValue: '81 kg' },
        { value: 89, displayValue: '89 kg' },
        { value: null, minimumWeight: 89, displayValue: '+89 kg' },
      ],
    },
    {
      division: 'Youth Girls',
      classes: [
        { value: 40, displayValue: '40 kg' },
        { value: 45, displayValue: '45 kg' },
        { value: 49, displayValue: '49 kg' },
        { value: 55, displayValue: '55 kg' },
        { value: 59, displayValue: '59 kg' },
        { value: 64, displayValue: '64 kg' },
        { value: 71, displayValue: '71 kg' },
        { value: null, minimumWeight: 71, displayValue: '+71 kg' },
      ],
    },
  ];

  let totalCount = 0;

  for (const divData of weightClassData) {
    const divisionId = divisionRefs[divData.division];
    if (!divisionId) {
      console.warn(`  ⚠️ Division "${divData.division}" not found, skipping`);
      continue;
    }

    const batch = db.batch();
    divData.classes.forEach((wc, index) => {
      const ref = db.collection('weightClasses').doc();
      const data: Record<string, unknown> = {
        divisionId,
        value: wc.value,
        displayValue: wc.displayValue,
        displayOrder: index + 1,
        isActive: true,
      };
      if (wc.minimumWeight !== undefined) {
        data.minimumWeight = wc.minimumWeight;
      }
      batch.set(ref, data);
    });
    await batch.commit();
    totalCount += divData.classes.length;
  }

  console.log(`  ✅ ${totalCount} weight classes created across ${weightClassData.length} divisions`);
}

async function seedAffiliatedCentres() {
  console.log('🏢 Seeding verified affiliated centres...');

  const centres: {
    name: string;
    centreType: string;
    contactPerson: string;
    phone: string;
  }[] = [
    {
      name: 'ISHA GYM WEIGHTLIFTING SPORTS ACADEMY',
      centreType: 'Weightlifting Academy',
      contactPerson: 'S. SHANMUGAM',
      phone: '9944301212',
    },
    {
      name: 'Isha Elite Weightlifting Academy',
      centreType: 'Weightlifting Academy',
      contactPerson: 'S. SHANMUGAM',
      phone: '9944301212',
    },
    {
      name: 'Jai Maruti Gym',
      centreType: 'Gym',
      contactPerson: 'V. Ponnusamy',
      phone: '9789759372',
    },
    {
      name: 'Raavanan Weightlifting Academy',
      centreType: 'Weightlifting Academy',
      contactPerson: 'S. VijayaRaghavan',
      phone: '7871547563',
    },
    {
      name: 'Shivam Fitness',
      centreType: 'Fitness Centre',
      contactPerson: 'G. Thilagam',
      phone: '+91 9566673133',
    },
    {
      name: 'Preethi Fitness',
      centreType: 'Fitness Centre',
      contactPerson: 'Preeti',
      phone: '6379616391',
    },
    {
      name: 'Veerapandi South Union GYM',
      centreType: 'Gym',
      contactPerson: 'T. Gunasekaran',
      phone: '9043363527',
    },
    {
      name: 'Vivekananda GYM',
      centreType: 'Gym',
      contactPerson: 'L. R. Marconi',
      phone: '9842772090',
    },
    {
      name: 'Anjaneya Sports Academy',
      centreType: 'Sports Academy',
      contactPerson: 'S. Gnanavel',
      phone: '6381519954',
    },
    {
      name: 'Kanjamalai Gym',
      centreType: 'Gym',
      contactPerson: 'K. Selvaraj',
      phone: '9524361421',
    },
    {
      name: 'Sri Maruti Power Gym',
      centreType: 'Gym',
      contactPerson: 'S. Sakthivel',
      phone: '6380937459',
    },
    {
      name: 'Success Fitness',
      centreType: 'Fitness Centre',
      contactPerson: 'S. Vijay Raghavan',
      phone: '7871547563',
    },
    {
      name: 'Shri PSG Arts College',
      centreType: 'Educational Institution',
      contactPerson: 'K. Thenmozhi',
      phone: '8056728891',
    },
    {
      name: 'PAAVAI Engineering College',
      centreType: 'Educational Institution',
      contactPerson: 'V. Swaminathan',
      phone: '7338962235',
    },
    {
      name: 'Trinity Arts College',
      centreType: 'Educational Institution',
      contactPerson: 'V. Archana',
      phone: '7339088845',
    },
  ];

  const batch = db.batch();
  centres.forEach((centre, index) => {
    const ref = db.collection('affiliatedInstitutions').doc();
    batch.set(ref, {
      name: centre.name,
      slug: slugify(centre.name),
      centreType: centre.centreType,
      contactPerson: centre.contactPerson,
      phone: centre.phone,
      secondaryPhone: '',
      description: '',
      address: '',
      email: '',
      coachName: centre.contactPerson,
      organizationType: centre.centreType,
      logoUrl: '',
      coverImageUrl: '',
      googleMapsUrl: '',
      websiteUrl: '',
      socialLinks: {
        instagram: '',
        facebook: '',
      },
      displayOrder: index + 1,
      isFeatured: false,
      isPublished: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });
  await batch.commit();

  console.log(`  ✅ ${centres.length} verified affiliated centres created`);
}

async function seedAdminUser() {
  console.log('👤 Checking for admin user...');

  // Check if an admin user already exists
  const adminSnapshot = await db.collection('adminUsers').limit(1).get();
  if (!adminSnapshot.empty) {
    console.log('  ℹ️ Admin user already exists, skipping');
    return;
  }

  // Create a default admin user in Firebase Auth
  // The admin should change this password immediately
  const defaultEmail = 'admin@sdwa.in';
  const defaultPassword = 'SDWA@Admin2026!';

  try {
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(defaultEmail);
      console.log('  ℹ️ Firebase Auth user already exists');
    } catch {
      userRecord = await auth.createUser({
        email: defaultEmail,
        password: defaultPassword,
        displayName: 'SDWA Admin',
      });
      console.log('  ✅ Firebase Auth user created');
    }

    // Create admin record in Firestore
    await db.collection('adminUsers').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: defaultEmail,
      displayName: 'SDWA Admin',
      role: 'SUPER_ADMIN',
      createdAt: new Date(),
      lastLoginAt: new Date(),
    });

    console.log('  ✅ Admin user record created');
    console.log('');
    console.log('  ┌─────────────────────────────────────────┐');
    console.log('  │  DEFAULT ADMIN CREDENTIALS               │');
    console.log('  │                                          │');
    console.log(`  │  Email:    ${defaultEmail}          │`);
    console.log(`  │  Password: ${defaultPassword}      │`);
    console.log('  │                                          │');
    console.log('  │  ⚠️  CHANGE THIS PASSWORD IMMEDIATELY    │');
    console.log('  └─────────────────────────────────────────┘');
  } catch (error) {
    console.error('  ❌ Failed to create admin user:', error);
  }
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('');
  console.log('╔═══════════════════════════════════════════╗');
  console.log('║   SDWA Database Seed Script               ║');
  console.log('║   Salem District Weightlifting Association ║');
  console.log('╚═══════════════════════════════════════════╝');
  console.log('');

  try {
    await seedAssociationSettings();
    await seedCommitteeMembers();
    await seedAchievementCategories();
    await seedAchievementLevels();
    const divisionRefs = await seedWeightDivisions();
    await seedWeightClasses(divisionRefs);
    await seedAffiliatedCentres();
    await seedAdminUser();

    console.log('');
    console.log('✅ All seed data created successfully!');
    console.log('');
  } catch (error) {
    console.error('❌ Seed script failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

main();
