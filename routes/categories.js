// routes/categories.js
const express = require('express');
const router = express.Router();
const { CategoryService } = require('../taskService');

// Get all categories
router.get('/', async (req, res, next) => {
    try {
        const categories = await CategoryService.getAllCategories();
        res.json(categories);
    } catch (error) {
        next(error);
    }
});

// Create category
router.post('/', async (req, res, next) => {
    try {
        const newCategory = await CategoryService.createCategory(req.body.name);
        res.status(201).json(newCategory);
    } catch (error) {
        next(error);
    }
});

// CRITICAL: Make sure to export the router instance!
module.exports = router;