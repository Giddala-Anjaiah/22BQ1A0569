/**
 * Backend API Application
 * Express.js server with comprehensive logging and API endpoints
 */

const express = require('express');
const cors = require('cors');
const { logger, getLogs, clearOldLogs } = require('../logger');
const { Log } = require('../Logging_Middleware/logging');

// Access token for external logging API
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHV1YXRpb24tc2VydmljZSIsImVtYWlsIjoiYW5qYWlhaGdoaWRkYWxhQGdtYWlsLmNvbSIsImV4cCI6MTc1NDAyOTQzMCwiaWF0IjoxNzU0MDI4NTMwLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiYjkxMGJlN2MtNjQwYy00M2VmLTkxMjAtYWViZjRhZGNjZjMwIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiZ2lkZGFsYSBhbmphaWFoIiwic3ViIjoiM2RiZDc5M2MtYTQ5ZC00ZjcxLWJlMTItYzYzMWQ0NDg3NjU1In0sImVtYWlsIjoiYW5qYWlhaGdoaWRkYWxhQGdtYWlsLmNvbSIsIm5hbWUiOiJnaWRkYWxhIGFuamFpYWgiLCJyb2xsTm8iOiIyMmJxMWEwNTY5IiwiYWNjZXNzQ29kZSI6IlBuVkJGViIsImNsaWVudElEIjoiM2RiZDc5M2MtYTQ5ZC00ZjcxLWJlMTItYzYzMWQ0NDg3NjU1IiwiY2xpZW50U2VjcmV0IjoiRG5reERycVFiSHhKcnl3VCJ9.kEz723V7DuELe46bRHpptzLEV-ASs1mCSHC741NBZQw";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply custom logging middleware
app.use(logger);

// In-memory data store (for demonstration)
let users = [
    { id: 1, name: 'GIDDALA ANJAIAH', email: 'anjaiahgiddala@gmail.com', age: 25 }
];

let posts = [
    { id: 1, userId: 1, title: 'Technical Assessment Post', content: 'This is my submission for the backend technical assessment', createdAt: new Date() }
];

// Utility functions
const generateId = (array) => Math.max(...array.map(item => item.id), 0) + 1;

const validateUser = (user) => {
    const errors = [];
    if (!user.name || user.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    if (!user.email || !user.email.includes('@')) {
        errors.push('Valid email is required');
    }
    if (!user.age || user.age < 0 || user.age > 150) {
        errors.push('Age must be between 0 and 150');
    }
    return errors;
};

const validatePost = (post) => {
    const errors = [];
    if (!post.title || post.title.trim().length < 1) {
        errors.push('Title is required');
    }
    if (!post.content || post.content.trim().length < 10) {
        errors.push('Content must be at least 10 characters long');
    }
    if (!post.userId || !users.find(u => u.id === post.userId)) {
        errors.push('Valid user ID is required');
    }
    return errors;
};

// API Routes

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        // Log health check request
        await Log("backend", "info", "route", "Health check endpoint accessed", ACCESS_TOKEN);
        
        res.json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development'
        });
    } catch (error) {
        await Log("backend", "error", "route", "Health check failed: " + error.message, ACCESS_TOKEN);
        res.status(500).json({ error: 'Health check failed' });
    }
});

// Users API
app.get('/api/users', (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        let filteredUsers = [...users];

        // Search functionality
        if (search) {
            filteredUsers = filteredUsers.filter(user =>
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

        res.json({
            users: paginatedUsers,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(filteredUsers.length / limit),
                totalItems: filteredUsers.length,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});

app.get('/api/users/:id', (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const user = users.find(u => u.id === userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});

app.post('/api/users', (req, res) => {
    try {
        const userData = req.body;
        const errors = validateUser(userData);

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        // Check if email already exists
        if (users.find(u => u.email === userData.email)) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        const newUser = {
            id: generateId(users),
            ...userData,
            createdAt: new Date()
        };

        users.push(newUser);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});

app.put('/api/users/:id', (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userData = req.body;
        const errors = validateUser(userData);

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        // Check if email already exists (excluding current user)
        const existingUser = users.find(u => u.email === userData.email && u.id !== userId);
        if (existingUser) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        users[userIndex] = {
            ...users[userIndex],
            ...userData,
            updatedAt: new Date()
        };

        res.json(users[userIndex]);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});

app.delete('/api/users/:id', (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Remove user's posts
        posts = posts.filter(p => p.userId !== userId);
        
        // Remove user
        const deletedUser = users.splice(userIndex, 1)[0];

        res.json({ message: 'User deleted successfully', user: deletedUser });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});

// Posts API
app.get('/api/posts', (req, res) => {
    try {
        const { page = 1, limit = 10, userId } = req.query;
        let filteredPosts = [...posts];

        // Filter by user ID if provided
        if (userId) {
            filteredPosts = filteredPosts.filter(post => post.userId === parseInt(userId));
        }

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

        // Add user information to posts
        const postsWithUsers = paginatedPosts.map(post => ({
            ...post,
            user: users.find(u => u.id === post.userId)
        }));

        res.json({
            posts: postsWithUsers,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(filteredPosts.length / limit),
                totalItems: filteredPosts.length,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});

app.get('/api/posts/:id', (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const post = posts.find(p => p.id === postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const postWithUser = {
            ...post,
            user: users.find(u => u.id === post.userId)
        };

        res.json(postWithUser);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});

app.post('/api/posts', (req, res) => {
    try {
        const postData = req.body;
        const errors = validatePost(postData);

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const newPost = {
            id: generateId(posts),
            ...postData,
            createdAt: new Date()
        };

        posts.push(newPost);
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});

app.put('/api/posts/:id', (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const postIndex = posts.findIndex(p => p.id === postId);

        if (postIndex === -1) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const postData = req.body;
        const errors = validatePost(postData);

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        posts[postIndex] = {
            ...posts[postIndex],
            ...postData,
            updatedAt: new Date()
        };

        res.json(posts[postIndex]);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});

app.delete('/api/posts/:id', (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const postIndex = posts.findIndex(p => p.id === postId);

        if (postIndex === -1) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const deletedPost = posts.splice(postIndex, 1)[0];
        res.json({ message: 'Post deleted successfully', post: deletedPost });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});

// Logs API (for viewing application logs)
app.get('/api/logs', (req, res) => {
    try {
        const date = req.query.date || new Date().toISOString().split('T')[0];
        const logs = getLogs(date);
        
        res.json({
            date,
            logs,
            count: logs.length,
            message: `Retrieved ${logs.length} log entries for ${date}`
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});

app.post('/api/logs/clear', (req, res) => {
    try {
        const daysToKeep = req.body.daysToKeep || 7;
        clearOldLogs(daysToKeep);
        
        res.json({
            message: 'Old logs cleared successfully',
            daysKept: daysToKeep
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});

// API Documentation endpoint
app.get('/api', (req, res) => {
    res.json({
        message: 'Backend API Documentation',
        version: '1.0.0',
        endpoints: {
            health: {
                method: 'GET',
                url: '/health',
                description: 'Server health check'
            },
            users: {
                method: 'GET',
                url: '/api/users',
                description: 'Get all users with pagination and search'
            },
            createUser: {
                method: 'POST',
                url: '/api/users',
                description: 'Create a new user'
            },
            getUser: {
                method: 'GET',
                url: '/api/users/:id',
                description: 'Get user by ID'
            },
            updateUser: {
                method: 'PUT',
                url: '/api/users/:id',
                description: 'Update user by ID'
            },
            deleteUser: {
                method: 'DELETE',
                url: '/api/users/:id',
                description: 'Delete user by ID'
            },
            posts: {
                method: 'GET',
                url: '/api/posts',
                description: 'Get all posts with pagination'
            },
            createPost: {
                method: 'POST',
                url: '/api/posts',
                description: 'Create a new post'
            },
            getPost: {
                method: 'GET',
                url: '/api/posts/:id',
                description: 'Get post by ID'
            },
            updatePost: {
                method: 'PUT',
                url: '/api/posts/:id',
                description: 'Update post by ID'
            },
            deletePost: {
                method: 'DELETE',
                url: '/api/posts/:id',
                description: 'Delete post by ID'
            },
            logs: {
                method: 'GET',
                url: '/api/logs',
                description: 'View application logs'
            },
            clearLogs: {
                method: 'POST',
                url: '/api/logs/clear',
                description: 'Clear old log files'
            },
            stats: {
                method: 'GET',
                url: '/api/stats',
                description: 'Get application statistics'
            }
        },
        documentation: 'See README.md for detailed API documentation'
    });
});

// Statistics endpoint
app.get('/api/stats', (req, res) => {
    try {
        const stats = {
            users: {
                total: users.length,
                byAge: {
                    '18-25': users.filter(u => u.age >= 18 && u.age <= 25).length,
                    '26-35': users.filter(u => u.age >= 26 && u.age <= 35).length,
                    '36-50': users.filter(u => u.age >= 36 && u.age <= 50).length,
                    '50+': users.filter(u => u.age > 50).length
                }
            },
            posts: {
                total: posts.length,
                byUser: users.map(user => ({
                    userId: user.id,
                    userName: user.name,
                    postCount: posts.filter(p => p.userId === user.id).length
                }))
            },
            server: {
                uptime: process.uptime(),
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV || 'development'
            }
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});

// Error handling middleware
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📝 API Documentation: http://localhost:${PORT}/api`);
    console.log(`📋 Logs endpoint: http://localhost:${PORT}/api/logs`);
});

module.exports = app;
