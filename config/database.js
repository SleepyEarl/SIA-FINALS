// config/database.js
const initSqlJs = require('sql.js');

let dbInstance = null;
let initializationPromise = null;

// This matches what your server.js is looking for!
async function initializeDatabase() {
    if (dbInstance) return dbInstance;
    
    if (!initializationPromise) {
        initializationPromise = (async () => {
            const SQL = await initSqlJs();
            dbInstance = new SQL.Database();
            
            // Build the tables on startup
            dbInstance.run(`
                CREATE TABLE IF NOT EXISTS categories (
                    id TEXT PRIMARY KEY,
                    name TEXT UNIQUE NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                );
            `);

            dbInstance.run(`
                CREATE TABLE IF NOT EXISTS tasks (
                    id TEXT PRIMARY KEY,
                    text TEXT NOT NULL,
                    category_id TEXT,
                    priority TEXT DEFAULT 'Medium',
                    original_time INTEGER DEFAULT 0,
                    remaining_time INTEGER DEFAULT 0,
                    completed INTEGER DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL
                );
            `);
            
            console.log("SQL.js WebAssembly Database initialized successfully!");
            return dbInstance;
        })();
    }
    return initializationPromise;
}

// Helper methods so your queries don't break
const dbWrapper = {
    run: async (sql, params = []) => {
        const instance = await initializeDatabase();
        const stmt = instance.prepare(sql);
        stmt.run(params);
        stmt.free();
        return { success: true };
    },
    get: async (sql, params = []) => {
        const instance = await initializeDatabase();
        const stmt = instance.prepare(sql);
        stmt.bind(params);
        let row = null;
        if (stmt.step()) {
            row = stmt.getAsObject();
        }
        stmt.free();
        return row && Object.keys(row).length > 0 ? row : null;
    },
    all: async (sql, params = []) => {
        const instance = await initializeDatabase();
        const stmt = instance.prepare(sql);
        stmt.bind(params);
        const rows = [];
        while (stmt.step()) {
            rows.push(stmt.getAsObject());
        }
        stmt.free();
        return rows;
    }
};

// Export BOTH the init function for server.js AND the queries for services/routes
module.exports = {
    initializeDatabase,
    db: dbWrapper
};