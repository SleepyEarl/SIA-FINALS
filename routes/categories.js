/**
 * Category Routes
 * Microservice for category management
 * Handles all category CRUD operations
 */

const express = require('express');
const router = express.Router();
const { CategoryService } = require('../config/database');
const { validateCategory, validateId } = require('../middleware/validation');

/**
 * GET /api/categories
 * Retrieve all categories with task counts
 */
router.get('/', (req, res) => {
    try {
        const categories = CategoryService.getAllCategories();

        res.status(200).json({
            success: true,
            message: 'Categories retrieved successfully',
            count: categories.length,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * GET /api/categories/:id
 * Retrieve a specific category by ID
 */
router.get('/:id', validateId, (req, res) => {
    try {
        const category = CategoryService.getCategoryById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Category retrieved successfully',
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * POST /api/categories
 * Create a new category
 * Body: { name }
 */
router.post('/', validateCategory, (req, res) => {
    try {
        const newCategory = CategoryService.createCategory(req.body.name);

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: newCategory
        });
    } catch (error) {
        const statusCode = error.message.includes('already exists') ? 409 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * PUT /api/categories/:id
 * Update a category
 * Body: { name }
 */
router.put('/:id', validateId, validateCategory, (req, res) => {
    try {
        const category = CategoryService.getCategoryById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        const updatedCategory = CategoryService.updateCategory(req.params.id, req.body.name);

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: updatedCategory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * DELETE /api/categories/:id
 * Delete a category
 */
router.delete('/:id', validateId, (req, res) => {
    try {
        const category = CategoryService.getCategoryById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        CategoryService.deleteCategory(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
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
