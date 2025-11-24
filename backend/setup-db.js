const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
    try {
        // Create connection without database selected
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            ssl: {
                rejectUnauthorized: false
            }
        });

        console.log('✅ Connected to MySQL');

        // Create database if it doesn't exist
        const dbName = process.env.DB_NAME || 'aquanova';
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        console.log(`✅ Database ${dbName} checked/created`);

        // Use the database
        await connection.query(`USE \`${dbName}\``);

        // Read and execute schema
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        const statements = schema.split(';').filter(stmt => stmt.trim());

        for (const statement of statements) {
            if (statement.trim()) {
                await connection.query(statement);
            }
        }

        console.log('✅ Database tables created successfully');

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Database setup error:', error.message);
        process.exit(1);
    }
}

setupDatabase();
