# AquaNova Backend API

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and update with your MySQL credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=aquanova
JWT_SECRET=your_secret_key
PORT=5000
```

### 3. Setup Database
Run the schema.sql file in your MySQL database:
```bash
mysql -u root -p aquanova < schema.sql
```

### 4. Start Server
```bash
# Development
npm run dev

# Production
npm start
```

## API Documentation

### Authentication

#### Signup
```
POST /api/auth/signup
Body: { name, email, password }
Response: { token, user: { id, name, email } }
```

#### Login
```
POST /api/auth/login
Body: { email, password }
Response: { token, user: { id, name, email } }
```

#### Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer <token>
Response: { id, name, email, created_at, last_login }
```

### Chat History

#### Get All Conversations
```
GET /api/chat/history
Headers: Authorization: Bearer <token>
Response: [{ id, title, created_at, updated_at }]
```

#### Get Conversation
```
GET /api/chat/history/:id
Headers: Authorization: Bearer <token>
Response: { id, title, messages, created_at, updated_at }
```

#### Create Conversation
```
POST /api/chat/history
Headers: Authorization: Bearer <token>
Body: { title, messages }
Response: { id, title, messages, created_at, updated_at }
```

#### Update Conversation
```
PUT /api/chat/history/:id
Headers: Authorization: Bearer <token>
Body: { title, messages }
Response: { message: "Conversation updated successfully" }
```

#### Delete Conversation
```
DELETE /api/chat/history/:id
Headers: Authorization: Bearer <token>
Response: { message: "Conversation deleted successfully" }
```

## Tech Stack
- Express.js
- MySQL2
- JWT (jsonwebtoken)
- bcryptjs
- express-validator
