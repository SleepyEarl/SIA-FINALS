const express = require('express');
const router = express.Router();
const { TaskService, CategoryService } = require('../config/database');

// GET /api/stats
router.get('/', (req, res) => {
    try {
        const allTasks = TaskService.getAllTasks();
        const completedTasks = allTasks.filter(t => t.completed);
        const pendingTasks = allTasks.filter(t => !t.completed);
        const categories = CategoryService.getAllCategories();

        // Calculate priority distribution
        const priorityDistribution = {
            Low: allTasks.filter(t => t.priority === 'Low').length,
            Medium: allTasks.filter(t => t.priority === 'Medium').length,
            High: allTasks.filter(t => t.priority === 'High').length
        };

        // Calculate completion rate
        const completionRate = allTasks.length > 0 
            ? ((completedTasks.length / allTasks.length) * 100).toFixed(2) 
            : 0;

        const stats = {
            totalTasks: allTasks.length,
            completedTasks: completedTasks.length,
            pendingTasks: pendingTasks.length,
            completionRate: parseFloat(completionRate),
            totalCategories: categories.length,
            priorityDistribution,
            categoryDistribution: categories.reduce((acc, cat) => {
                acc[cat.name] = cat.task_count;
                return acc;
            }, {})
        };

        res.status(200).json({
            success: true,
            message: 'Statistics retrieved successfully',
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

//GET /api/stats/export
router.get('/export/json', (req, res) => {
    try {
        const tasks = TaskService.getAllTasks();
        const categories = CategoryService.getAllCategories();

        const exportData = {
            exportDate: new Date().toISOString(),
            tasks,
            categories
        };

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="tasks-export.json"');
        res.json(exportData);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
