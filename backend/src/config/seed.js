const pool = require('./db');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    console.log('🌱 Generating secure bcrypt password hashes...');
    const adminPassword = await bcrypt.hash('Admin@12345', 10);
    const ownerPassword = await bcrypt.hash('Owner@12345', 10);

    // 1. Insert or Update System Administrator
    await pool.query(
      `INSERT INTO users (name, email, password, address, role)
       VALUES (?, ?, ?, ?, 'ADMIN')
       ON DUPLICATE KEY UPDATE password = VALUES(password), role = 'ADMIN'`,
      [
        'System Administrator Master',
        'admin@storerating.com',
        adminPassword,
        'Central Administration Headquarters, Tech Park, Pune'
      ]
    );
    console.log('✅ Admin user created/updated: admin@storerating.com / Admin@12345');

    // 2. Insert or Update Store Owner
    await pool.query(
      `INSERT INTO users (name, email, password, address, role)
       VALUES (?, ?, ?, ?, 'OWNER')
       ON DUPLICATE KEY UPDATE password = VALUES(password), role = 'OWNER'`,
      [
        'Default Store Owner Account',
        'owner@storerating.com',
        ownerPassword,
        'Plot 45, Commercial Plaza, Pune'
      ]
    );
    console.log('✅ Store owner created/updated: owner@storerating.com / Owner@12345');

    // 3. Insert Sample Store for Owner
    const [owners] = await pool.query('SELECT id FROM users WHERE email = ?', ['owner@storerating.com']);
    if (owners.length > 0) {
      const ownerId = owners[0].id;
      const [existingStore] = await pool.query('SELECT id FROM stores WHERE owner_id = ?', [ownerId]);
      
      if (existingStore.length === 0) {
        await pool.query(
          `INSERT INTO stores (name, email, address, owner_id)
           VALUES (?, ?, ?, ?)`,
          [
            'Apex Supermarket & Groceries',
            'contact@apexmarket.com',
            'Plot 45, Commercial Plaza, Pune',
            ownerId
          ]
        );
        console.log('✅ Sample store created for the owner.');
      }
    }

    console.log('\n🚀 Database seeding complete! You can now log in.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedDatabase();