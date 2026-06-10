import { Pool } from 'pg';

async function createDatabase() {
  // Connection to default postgres database
  const pool = new Pool({
    user: 'user',
    password: 'password',
    host: 'localhost',
    port: 5432,
    database: 'postgres', // Default database
  });

  try {
    console.log('Checking if database "proconnect" exists...');
    
    // Check if database exists
    const result = await pool.query(
      `SELECT datname FROM pg_catalog.pg_database WHERE datname = 'proconnect'`
    );

    if (result.rows.length === 0) {
      console.log('Creating database "proconnect"...');
      await pool.query('CREATE DATABASE proconnect');
      console.log('✓ Database "proconnect" created successfully');
    } else {
      console.log('✓ Database "proconnect" already exists');
    }
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run database creation
createDatabase().catch((err) => {
  console.error('Failed to create database:', err);
  process.exit(1);
});
