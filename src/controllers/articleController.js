const Article = require('../models/Article');

// Get all article with filter (by tag, publishedData)
const getArticle = async (req, res, next) => {
    try {
        // Build query object based on query parameters
        const { tags, publishedDate, isPublished, author } = req.query;
        let query = {};

        if (tags) {
            query.tags = { $in: tags.split(',') };
        }

        if (publishedDate) {
            const date = new Date(publishedDate);
            query.publishedDate = { $gte: date };
        }

        if (isPublished !== undefined) {
            query.isPublished = isPublished === 'true';
        }

        if (author) {
            query.author = new RegExp(author, 'i');
        }

        const article = await Article.find(query).sort({ publishedData: -1 });

        res.status(200).json({
            success: true,
            count: article.length,
            data: article,
        });
    } catch (error) {
        next(error);
    }
};

// Get one article bt ID
const getArticleById = async (req, res, next) => {
    try {
        const article = await Article.findById(req.params.id);
        
        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found',
            });
        }

        res.status(200).json({
            success: true,
            date: article,
        });
    } catch (error) {
        next(error);
    }
};

// Create a new article
const createArticle = async (req, res, next) => {
    try {
        const article = await Article.create(req.body);

        res.status(201).json({
            success: true,
            data: article,
        });
    } catch (error) {
        next(error);
    }
};

// Update article by ID
const updatedArticleByID = async (req, res, next) => {
    try {
        const article = await Article.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found',
            });
        }
        
        res.status(200).json({
            success: true,
            data: article,
        });
    } catch (error) {
        next(error);
    }
};

// Delete article by ID
const deleteArticleByID = async (req, res, next) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found',
            });
        }

        res.status(200).json({
            success: true,
            data: article,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getArticle,
    getArticleById,
    createArticle,
    updatedArticleByID,
    deleteArticleByID,
};