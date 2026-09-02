const bcrypt = require('bcryptjs');
const pool = require('./db');

async function seedDatabase() {
  try {
    console.log('🌱 Checking seed records...');

    // 1. Check if Admin already exists
    const [adminRows] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      ['admin@storerating.com']
    );

    if (adminRows.length === 0) {
      const hashedAdminPassword = await bcrypt.hash('Admin@12345', 10);
      await pool.query(
        `INSERT INTO users (name, email, password, address, role)
         VALUES (?, ?, ?, ?, ?)`,
        [
          'System Administrator Master',
          'admin@storerating.com',
          hashedAdminPassword,
          'Central Administration Headquarters, Tech Park, Pune',
          'ADMIN'
        ]
      );
      console.log('✅ Admin user created.');
    } else {
      console.log('ℹ️ Admin user already exists. Skipped.');
    }

    // 2. Check if Store Owner already exists
    const [ownerRows] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      ['owner@storerating.com']
    );

    let ownerId;
    if (ownerRows.length === 0) {
      const hashedOwnerPassword = await bcrypt.hash('Owner@12345', 10);
      const [result] = await pool.query(
        `INSERT INTO users (name, email, password, address, role)
         VALUES (?, ?, ?, ?, ?)`,
        [
          'Default Store Owner Account',
          'owner@storerating.com',
          hashedOwnerPassword,
          'Plot 45, Commercial Plaza, Pune',
          'OWNER'
        ]
      );
      ownerId = result.insertId;
      console.log('✅ Store owner created.');
    } else {
      ownerId = ownerRows[0].id;
      console.log('ℹ️ Store owner already exists. Skipped.');
    }

    // 3. Check if Sample Store already exists
    const [storeRows] = await pool.query(
      'SELECT id FROM stores WHERE owner_id = ?',
      [ownerId]
    );

    if (storeRows.length === 0) {
      await pool.query(
        `INSERT INTO stores (name, email, address, owner_id)
         VALUES (?, ?, ?, ?)`,
        [
          'Apex Electronics & Gadgets Store',
          'contact@apexelectronics.com',
          'Shop 12, Phoenix Marketcity, Viman Nagar, Pune',
          ownerId
        ]
      );
      console.log('✅ Sample store created.');
    } else {
      console.log('ℹ️ Sample store already exists. Skipped.');
    }

    console.log('🚀 Seed check complete. No existing user or rating data was modified.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedDatabase();