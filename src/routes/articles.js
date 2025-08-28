const express = require('express');
const {
    getArticle,
    getArticleById,
    createArticle,
    updatedArticleByID,
    deleteArticleByID,
} = require('../controllers/articleController');

// Import validation middleware
const { validateArticle } = require('../middleware/validation');
const router = express.Router();

// Define routes
router.route('/')
    .get(getArticle)
    .post(validateArticle, createArticle);

router.route('/:id')
    .get(getArticleById)
    .put(validateArticle, updatedArticleByID)
    .delete(deleteArticleByID);

module.exports = router;