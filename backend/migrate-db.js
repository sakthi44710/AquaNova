const db = require('./config/db');

async function migrate() {
    try {
        console.log('Checking database schema...');

        // Check if email_verified column exists in users table
        const [columns] = await db.query('SHOW COLUMNS FROM users LIKE "email_verified"');

        if (columns.length === 0) {
            console.log('Adding email_verified column to users table...');
            await db.query('ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE');
            console.log('✅ email_verified column added.');
        } else {
            console.log('✓ email_verified column already exists.');
        }

        // Check if otp_verifications table exists
        const [tables] = await db.query('SHOW TABLES LIKE "otp_verifications"');

        if (tables.length === 0) {
            console.log('Creating otp_verifications table...');
            await db.query(`
        CREATE TABLE IF NOT EXISTS otp_verifications (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          otp VARCHAR(6) NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          verified BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_email (email),
          INDEX idx_expires_at (expires_at)
        )
      `);
            console.log('✅ otp_verifications table created.');
        } else {
            console.log('✓ otp_verifications table already exists.');
        }

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
