// server/seed_users.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '12', 10);

const users = [
  { username: 'alice.employee', name: 'Alice Employee', role: 'employee', password: 'EmpP@ssw0rd1' },
  { username: 'bob.manager', name: 'Bob Manager', role: 'manager', password: 'MngP@ssw0rd1' }
];

async function seed() {
  try {
    for (const u of users) {
      const hash = await bcrypt.hash(u.password, SALT_ROUNDS);
      // Upsert safely (parameterized)
      await pool.query(
        `INSERT INTO users (username, name, role, password_hash, created_at)
         VALUES ($1, $2, $3, $4, now())
         ON CONFLICT (username) DO UPDATE SET name=EXCLUDED.name, role=EXCLUDED.role, password_hash=EXCLUDED.password_hash`,
        [u.username, u.name, u.role, hash]
      );
      console.log('Upserted', u.username);
    }
    console.log('Seeding complete.');
  } catch (err) {
    console.error('Seed error', err);
  } finally {
    pool.end();
  }
}

seed();
