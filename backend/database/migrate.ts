import { query } from '../src/db';

async function migrate() {
  try {
    console.log('Starting database migrations...');

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(500),
        bio TEXT,
        role VARCHAR(50) NOT NULL DEFAULT 'client',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Created users table');

    // Create professionals table
    await query(`
      CREATE TABLE IF NOT EXISTS professionals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE,
        title VARCHAR(255) NOT NULL,
        bio TEXT,
        categories VARCHAR(255)[] DEFAULT '{}',
        hourly_rate DECIMAL(10, 2),
        location VARCHAR(255),
        is_verified BOOLEAN DEFAULT FALSE,
        is_available BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log('✓ Created professionals table');

    // Create portfolio table
    await query(`
      CREATE TABLE IF NOT EXISTS portfolio (
        id SERIAL PRIMARY KEY,
        professional_id INTEGER NOT NULL,
        photo_url VARCHAR(500) NOT NULL,
        title VARCHAR(255),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (professional_id) REFERENCES professionals(id) ON DELETE CASCADE
      );
    `);
    console.log('✓ Created portfolio table');

    // Create reviews table
    await query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        professional_id INTEGER NOT NULL,
        client_id INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (professional_id) REFERENCES professionals(id) ON DELETE CASCADE,
        FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log('✓ Created reviews table');

    // Create messages table
    await query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER NOT NULL,
        receiver_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        read_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log('✓ Created messages table');

    // Create indexes for performance
    await query(`CREATE INDEX IF NOT EXISTS idx_professionals_user_id ON professionals(user_id);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_portfolio_professional_id ON portfolio(professional_id);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_reviews_professional_id ON reviews(professional_id);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_reviews_client_id ON reviews(client_id);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);`);
    console.log('✓ Created indexes');

    console.log('Database migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
