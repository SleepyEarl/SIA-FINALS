const express = require('express');
const router = express.Router();
const { TaskService } = require('../config/database');
const { validateTask, validateId } = require('../middleware/validation');

router.get('/', (req, res) => {
    try {
        const { category_id, priority, search } = req.query;

        let tasks;

        if (search) {
            tasks = TaskService.searchTasks(search);
        } else if (category_id) {
            tasks = TaskService.getTasksByCategory(category_id);
        } else if (priority) {
            tasks = TaskService.getTasksByPriority(priority);
        } else {
            tasks = TaskService.getAllTasks();
        }

        res.status(200).json({
            success: true,
            message: 'Tasks retrieved successfully',
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// GET /api/tasks/:id 
router.get('/:id', validateId, (req, res) => {
    try {
        const task = TaskService.getTaskById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Task retrieved successfully',
            data: task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// POST /api/tasks - Create a new task
router.post('/', validateTask, (req, res) => {
    try {
        const newTask = TaskService.createTask(req.body);

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: newTask
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * PUT /api/tasks/:id
 * Update a task
 * Body: { text, priority, completed, remaining_time, etc. }
 */
router.put('/:id', validateId, (req, res) => {
    try {
        const task = TaskService.getTaskById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        const updatedTask = TaskService.updateTask(req.params.id, req.body);

        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: updatedTask
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * PATCH /api/tasks/:id/toggle
 * Toggle task completion status
 */
router.patch('/:id/toggle', validateId, (req, res) => {
    try {
        const task = TaskService.getTaskById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        const updatedTask = TaskService.updateTask(req.params.id, {
            completed: !task.completed,
            remaining_time: 0
        });

        res.status(200).json({
            success: true,
            message: `Task marked as ${updatedTask.completed ? 'completed' : 'pending'}`,
            data: updatedTask
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * PATCH /api/tasks/:id/timer
 * Update task timer
 * Body: { remaining_time }
 */
router.patch('/:id/timer', validateId, (req, res) => {
    try {
        const { remaining_time } = req.body;

        if (remaining_time === undefined) {
            return res.status(400).json({
                success: false,
                message: 'remaining_time is required'
            });
        }

        const task = TaskService.getTaskById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        const updatedTask = TaskService.updateTask(req.params.id, {
            remaining_time
        });

        res.status(200).json({
            success: true,
            message: 'Task timer updated',
            data: updatedTask
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * DELETE /api/tasks/:id
 * Delete a task
 */
router.delete('/:id', validateId, (req, res) => {
    try {
        const task = TaskService.getTaskById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        TaskService.deleteTask(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully',
            data: { id: req.params.id }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
