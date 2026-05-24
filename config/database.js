// Database Confi
const { db } = require('../db');
const { v4: uuidv4 } = require('uuid');


const TaskService = {
    createTask: (taskData) => {
        try {
            const id = uuidv4();
            const stmt = db.prepare(`
                INSERT INTO tasks (id, text, category_id, priority, original_time, remaining_time)
                VALUES (?, ?, ?, ?, ?, ?)
            `);
            
            stmt.run(
                id,
                taskData.text,
                taskData.category_id,
                taskData.priority || 'Medium',
                taskData.original_time || 0,
                taskData.remaining_time || 0
            );
            
            return { id, ...taskData, completed: false };
        } catch (error) {
            throw new Error(`Failed to create task: ${error.message}`);
        }
    },

    // Get all tasks
    getAllTasks: () => {
        try {
            return db.prepare(`
                SELECT t.*, c.name as category 
                FROM tasks t
                LEFT JOIN categories c ON t.category_id = c.id
                ORDER BY t.created_at DESC
            `).all();
        } catch (error) {
            throw new Error(`Failed to retrieve tasks: ${error.message}`);
        }
    },

    // Get task by ID
    getTaskById: (id) => {
        try {
            return db.prepare(`
                SELECT t.*, c.name as category 
                FROM tasks t
                LEFT JOIN categories c ON t.category_id = c.id
                WHERE t.id = ?
            `).get(id);
        } catch (error) {
            throw new Error(`Failed to retrieve task: ${error.message}`);
        }
    },

    // Update task
    updateTask: (id, updates) => {
        try {
            const fields = [];
            const values = [];
            
            for (const [key, value] of Object.entries(updates)) {
                if (key !== 'id' && key !== 'created_at') {
                    fields.push(`${key} = ?`);
                    values.push(value);
                }
            }
            
            fields.push('updated_at = CURRENT_TIMESTAMP');
            values.push(id);

            const stmt = db.prepare(`
                UPDATE tasks 
                SET ${fields.join(', ')}
                WHERE id = ?
            `);
            
            stmt.run(...values);
            return TaskService.getTaskById(id);
        } catch (error) {
            throw new Error(`Failed to update task: ${error.message}`);
        }
    },

    // Delete task
    deleteTask: (id) => {
        try {
            db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
            return { success: true, message: 'Task deleted successfully' };
        } catch (error) {
            throw new Error(`Failed to delete task: ${error.message}`);
        }
    },

    // Get tasks by category
    getTasksByCategory: (categoryId) => {
        try {
            return db.prepare(`
                SELECT t.*, c.name as category 
                FROM tasks t
                LEFT JOIN categories c ON t.category_id = c.id
                WHERE t.category_id = ?
                ORDER BY t.created_at DESC
            `).all(categoryId);
        } catch (error) {
            throw new Error(`Failed to retrieve tasks by category: ${error.message}`);
        }
    },

    // Search tasks
    searchTasks: (query) => {
        try {
            return db.prepare(`
                SELECT t.*, c.name as category 
                FROM tasks t
                LEFT JOIN categories c ON t.category_id = c.id
                WHERE t.text LIKE ? OR c.name LIKE ?
                ORDER BY t.created_at DESC
            `).all(`%${query}%`, `%${query}%`);
        } catch (error) {
            throw new Error(`Failed to search tasks: ${error.message}`);
        }
    },

    // Get tasks by priority
    getTasksByPriority: (priority) => {
        try {
            return db.prepare(`
                SELECT t.*, c.name as category 
                FROM tasks t
                LEFT JOIN categories c ON t.category_id = c.id
                WHERE t.priority = ?
                ORDER BY t.created_at DESC
            `).all(priority);
        } catch (error) {
            throw new Error(`Failed to retrieve tasks by priority: ${error.message}`);
        }
    }
};


const CategoryService = {
    createCategory: (name) => {
        try {
            const id = uuidv4();
            db.prepare('INSERT INTO categories (id, name) VALUES (?, ?)').run(id, name);
            return { id, name };
        } catch (error) {
            if (error.message.includes('UNIQUE')) {
                throw new Error('Category already exists');
            }
            throw new Error(`Failed to create category: ${error.message}`);
        }
    },

    // Get all categories
    getAllCategories: () => {
        try {
            return db.prepare(`
                SELECT c.*, COUNT(t.id) as task_count 
                FROM categories c
                LEFT JOIN tasks t ON c.id = t.category_id
                GROUP BY c.id
                ORDER BY c.name
            `).all();
        } catch (error) {
            throw new Error(`Failed to retrieve categories: ${error.message}`);
        }
    },

    // Get category by ID
    getCategoryById: (id) => {
        try {
            return db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
        } catch (error) {
            throw new Error(`Failed to retrieve category: ${error.message}`);
        }
    },

    // Delete category
    deleteCategory: (id) => {
        try {
            db.prepare('DELETE FROM categories WHERE id = ?').run(id);
            return { success: true, message: 'Category deleted successfully' };
        } catch (error) {
            throw new Error(`Failed to delete category: ${error.message}`);
        }
    },

    // Update category
    updateCategory: (id, name) => {
        try {
            db.prepare('UPDATE categories SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(name, id);
            return CategoryService.getCategoryById(id);
        } catch (error) {
            throw new Error(`Failed to update category: ${error.message}`);
        }
    }
};

module.exports = {
    TaskService,
    CategoryService
};
