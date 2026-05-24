const validateTask = (req, res, next) => {
    const { text, category_id, priority } = req.body;

    const errors = [];

    if (!text || text.trim().length === 0) {
        errors.push('Task text is required and cannot be empty');
    }

    if (text && text.length > 500) {
        errors.push('Task text cannot exceed 500 characters');
    }

    if (!category_id || category_id.trim().length === 0) {
        errors.push('Category ID is required');
    }

    if (priority && !['Low', 'Medium', 'High'].includes(priority)) {
        errors.push('Priority must be Low, Medium, or High');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            details: errors
        });
    }

    next();
};

const validateCategory = (req, res, next) => {
    const { name } = req.body;

    const errors = [];

    if (!name || name.trim().length === 0) {
        errors.push('Category name is required');
    }

    if (name && name.length > 100) {
        errors.push('Category name cannot exceed 100 characters');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            details: errors
        });
    }

    next();
};

const validateId = (req, res, next) => {
    const { id } = req.params;

    if (!id || id.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID parameter'
        });
    }

    next();
};

module.exports = {
    validateTask,
    validateCategory,
    validateId
};
