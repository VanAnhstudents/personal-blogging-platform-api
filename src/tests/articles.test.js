// article.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./app');
const Article = require('./models/Article');

// Mock data for testing
const testArticle = {
  title: 'Test Article',
  content: 'This is a test article content',
  author: 'Test Author',
  tags: ['test', 'api', 'nodejs'],
  isPublished: true
};

let createdArticleId;

// Connect to a test database before running tests
beforeAll(async () => {
  // You might want to use a separate test database
  // For now, we'll use the same connection but clear the articles collection
  await Article.deleteMany({});
});

// Close database connection after tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Article API Endpoints', () => {
  // Test POST /api/articles - Create a new article
  test('Should create a new article', async () => {
    const response = await request(app)
      .post('/api/articles')
      .send(testArticle)
      .expect('Content-Type', /json/)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe(testArticle.title);
    expect(response.body.data.content).toBe(testArticle.content);
    
    // Save the ID for later tests
    createdArticleId = response.body.data._id;
  });

  // Test GET /api/articles - Get all articles
  test('Should get all articles', async () => {
    const response = await request(app)
      .get('/api/articles')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.count).toBeGreaterThan(0);
    expect(Array.isArray(response.body.data)).toBeTruthy();
  });

  // Test GET /api/articles/:id - Get article by ID
  test('Should get article by ID', async () => {
    const response = await request(app)
      .get(`/api/articles/${createdArticleId}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data._id).toBe(createdArticleId);
  });

  // Test PUT /api/articles/:id - Update article by ID
  test('Should update article by ID', async () => {
    const updatedData = {
      title: 'Updated Test Article',
      content: 'This is updated content',
      isPublished: false
    };

    const response = await request(app)
      .put(`/api/articles/${createdArticleId}`)
      .send(updatedData)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe(updatedData.title);
    expect(response.body.data.content).toBe(updatedData.content);
    expect(response.body.data.isPublished).toBe(updatedData.isPublished);
  });

  // Test DELETE /api/articles/:id - Delete article by ID
  test('Should delete article by ID', async () => {
    const response = await request(app)
      .delete(`/api/articles/${createdArticleId}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data._id).toBe(createdArticleId);
  });

  // Test GET /api/articles with filters
  test('Should filter articles by tags', async () => {
    // First create a couple of articles with different tags
    await Article.create({
      title: 'Node.js Article',
      content: 'Content about Node.js',
      tags: ['nodejs', 'backend'],
      isPublished: true
    });
    
    await Article.create({
      title: 'React Article',
      content: 'Content about React',
      tags: ['react', 'frontend'],
      isPublished: true
    });

    const response = await request(app)
      .get('/api/articles?tags=nodejs')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.success).toBe(true);
    // Should find at least one article with nodejs tag
    expect(response.body.data.some(article => 
      article.tags.includes('nodejs')
    )).toBeTruthy();
  });

  // Test validation - should fail with invalid data
  test('Should fail validation with empty title', async () => {
    const invalidArticle = {
      title: '',
      content: 'Some content'
    };

    const response = await request(app)
      .post('/api/articles')
      .send(invalidArticle)
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Validation failed');
  });
});