// routes/tasks.js
const express = require('express');
const router = express.Router();
const { TaskService } = require('../taskService');

// Get all tasks
router.get('/', async (req, res, next) => {
    try {
        const tasks = await TaskService.getAllTasks();
        res.json(tasks);
    } catch (error) {
        next(error);
    }
});

// Get task by ID
router.get('/:id', async (req, res, next) => {
    try {
        const task = await TaskService.getTaskById(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (error) {
        next(error);
    }
});

// Create task
router.post('/', async (req, res, next) => {
    try {
        const newTask = await TaskService.createTask(req.body);
        res.status(201).json(newTask);
    } catch (error) {
        next(error);
    }
});

// Update task
router.put('/:id', async (req, res, next) => {
    try {
        const updatedTask = await TaskService.updateTask(req.params.id, req.body);
        res.json(updatedTask);
    } catch (error) {
        next(error);
    }
});

// Delete task
router.delete('/:id', async (req, res, next) => {
    try {
        const result = await TaskService.deleteTask(req.params.id);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

// CRITICAL: Make sure to export the router instance!
module.exports = router;