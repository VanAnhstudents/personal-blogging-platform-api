const { json } = require('express');
const validator = require('validator');

// Middleware validate article data
const validateArticle = (req, res, next) => {
    const { title, content, tags } = req.body;
    const errors = [];

    // Validate title
    if (!title || validator.isEmpty(title.trim())) {
        errors.push('Title is required');
    } else if (!validator.isLength(title, { max: 200 })) {
        errors.push('Title cannot exceed 200 characters')
    }

    // Validate content
    if (!content || validator.isEmpty(content.trim())) {
        errors.push('Content is require');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors,
        });
    }

    next();
};

module.exports = {
    validateArticle,
};