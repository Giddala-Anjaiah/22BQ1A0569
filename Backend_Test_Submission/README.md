# Backend API Submission

## Overview
A comprehensive RESTful API built with Node.js and Express.js, featuring custom logging middleware, user management, post management, and advanced features like pagination, search, and statistics.

## Features

### ✅ Core Functionality
- **User Management:** CRUD operations for users
- **Post Management:** CRUD operations for posts with user relationships
- **Custom Logging:** Comprehensive request/response logging
- **Data Validation:** Input validation and error handling
- **Pagination:** Built-in pagination for all list endpoints
- **Search:** Search functionality for users
- **Statistics:** Analytics and reporting endpoints

### ✅ Technical Features
- **RESTful Design:** Standard HTTP methods and status codes
- **Error Handling:** Comprehensive error responses
- **CORS Support:** Cross-origin resource sharing enabled
- **Health Monitoring:** Server health check endpoint
- **Log Management:** View and manage application logs
- **Performance Tracking:** Response time monitoring

## API Endpoints

### Health Check
```
GET /health
```
Returns server status and uptime information.

### Users API

#### Get All Users
```
GET /api/users?page=1&limit=10&search=john
```
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `search` (optional): Search by name or email

#### Get User by ID
```
GET /api/users/:id
```

#### Create User
```
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}
```

#### Update User
```
PUT /api/users/:id
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "age": 31
}
```

#### Delete User
```
DELETE /api/users/:id
```

### Posts API

#### Get All Posts
```
GET /api/posts?page=1&limit=10&userId=1
```
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `userId` (optional): Filter by user ID

#### Get Post by ID
```
GET /api/posts/:id
```

#### Create Post
```
POST /api/posts
Content-Type: application/json

{
  "title": "My First Post",
  "content": "This is the content of my first post",
  "userId": 1
}
```

#### Update Post
```
PUT /api/posts/:id
Content-Type: application/json

{
  "title": "Updated Post Title",
  "content": "Updated post content",
  "userId": 1
}
```

#### Delete Post
```
DELETE /api/posts/:id
```

### Logs API

#### Get Logs
```
GET /api/logs?date=2024-01-15
```
- **Query Parameters:**
  - `date` (optional): Date in YYYY-MM-DD format (default: today)

#### Clear Old Logs
```
POST /api/logs/clear
Content-Type: application/json

{
  "daysToKeep": 7
}
```

### Statistics API

#### Get Statistics
```
GET /api/stats
```
Returns comprehensive statistics about users, posts, and server status.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd 22BQ1A0569
   ```

2. **Navigate to backend directory**
   ```bash
   cd Backend_Test_Submission
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the server**
   ```bash
   npm start
   ```

   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

### Environment Variables
Create a `.env` file in the Backend_Test_Submission directory:
```env
PORT=3000
NODE_ENV=development
```

## Testing the API

### Using Postman/Insomnia

1. **Health Check**
   ```
   GET http://localhost:3000/health
   ```

2. **Create a User**
   ```
   POST http://localhost:3000/api/users
   Content-Type: application/json
   
   {
     "name": "Test User",
     "email": "test@example.com",
     "age": 25
   }
   ```

3. **Get All Users**
   ```
   GET http://localhost:3000/api/users
   ```

4. **Create a Post**
   ```
   POST http://localhost:3000/api/posts
   Content-Type: application/json
   
   {
     "title": "Test Post",
     "content": "This is a test post content",
     "userId": 1
   }
   ```

5. **Get Posts with User Info**
   ```
   GET http://localhost:3000/api/posts
   ```

6. **View Logs**
   ```
   GET http://localhost:3000/api/logs
   ```

7. **Get Statistics**
   ```
   GET http://localhost:3000/api/stats
   ```

### Using cURL

```bash
# Health check
curl http://localhost:3000/health

# Create user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","age":30}'

# Get users
curl http://localhost:3000/api/users

# Create post
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"My Post","content":"Post content","userId":1}'

# Get posts
curl http://localhost:3000/api/posts
```

## Response Formats

### Success Response
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### Error Response
```json
{
  "error": "User not found"
}
```

### Pagination Response
```json
{
  "users": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

## Data Validation

### User Validation Rules
- **Name:** Minimum 2 characters
- **Email:** Must be valid email format
- **Age:** Between 0 and 150

### Post Validation Rules
- **Title:** Required, minimum 1 character
- **Content:** Required, minimum 10 characters
- **UserId:** Must reference existing user

## Logging Features

### Request Logging
- HTTP method and URL
- Request headers and body
- Query parameters
- Client IP and user agent
- Timestamp

### Response Logging
- HTTP status code
- Response headers and body
- Response time calculation
- Completion timestamp

### Log Files
- Daily log files: `app-YYYY-MM-DD.log`
- JSON formatted entries
- Automatic log rotation
- Configurable retention period

## Error Handling

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (duplicate email)
- `500` - Internal Server Error

### Error Response Format
```json
{
  "error": "Error message",
  "message": "Detailed error information"
}
```

## Performance Features

### Response Time Tracking
- Automatic response time calculation
- Performance monitoring
- Log-based analytics

### Pagination
- Efficient data retrieval
- Configurable page sizes
- Metadata for navigation

### Search Optimization
- Case-insensitive search
- Multiple field search
- Efficient filtering

## Security Considerations

### Input Validation
- Comprehensive data validation
- SQL injection prevention
- XSS protection

### CORS Configuration
- Cross-origin requests enabled
- Configurable origins
- Secure headers

### Log Security
- Sensitive data logging
- Log file access control
- Regular log rotation

## Production Deployment

### Environment Setup
```bash
NODE_ENV=production
PORT=3000
```

### Performance Optimization
- Enable compression
- Implement caching
- Database optimization
- Load balancing

### Monitoring
- Health check endpoints
- Log aggregation
- Performance metrics
- Error tracking

## Screenshots Required

Please include screenshots of:

1. **Postman/Insomnia Testing:**
   - Request body examples
   - Response examples
   - Response time measurements

2. **API Endpoints:**
   - Health check response
   - User creation/retrieval
   - Post creation/retrieval
   - Error handling examples

3. **Logging:**
   - Log file contents
   - Log API responses
   - Console output

## File Structure

```
Backend_Test_Submission/
├── app.js                 # Main application file
├── package.json           # Dependencies and scripts
├── README.md              # This documentation
├── screenshots/           # API testing screenshots
│   ├── health-check.png
│   ├── user-api.png
│   ├── post-api.png
│   └── logs-api.png
└── logs/                  # Generated log files
    └── app-2024-01-15.log
```

## Dependencies

```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5"
}
```

## Scripts

```json
{
  "start": "node app.js",
  "dev": "nodemon app.js"
}
```

## Support

For any questions or issues, please refer to the main repository README or check the logs endpoint for debugging information. 