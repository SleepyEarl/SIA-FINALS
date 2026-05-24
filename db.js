const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Create database directory if it doesn't exist
const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'tasks.db');
const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

function initializeDatabase() {
    try {
        db.exec(`
            CREATE TABLE IF NOT EXISTS categories (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        db.exec(`
            CREATE TABLE IF NOT EXISTS tasks (
                id TEXT PRIMARY KEY,
                text TEXT NOT NULL,
                category_id TEXT NOT NULL,
                priority TEXT NOT NULL DEFAULT 'Medium',
                completed BOOLEAN DEFAULT 0,
                original_time INTEGER DEFAULT 0,
                remaining_time INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(id)
            )
        `);

        const defaultCategories = ['Personal', 'Work', 'Urgent'];
        defaultCategories.forEach(cat => {
            try {
                db.prepare(`INSERT INTO categories (id, name) VALUES (?, ?)`).run(
                    `cat_${Date.now()}_${Math.random()}`,
                    cat
                );
            } catch (error) {
            }
        });

        console.log('✓ Database initialized successfully');
        return db;
    } catch (error) {
        console.error('✗ Database initialization failed:', error);
        throw error;
    }
}

module.exports = {
    db,
    initializeDatabase
};
