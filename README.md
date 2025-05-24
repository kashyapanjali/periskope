# Periskope Chat Application

## Assignment Overview

This project was developed as part of the Periskope recruitment process. It demonstrates the implementation of a modern, real-time chat application using Next.js and Supabase.

## Application Features

### Core Functionality
- User authentication with email
- Real-time chat rooms
- Message history
- User profiles
- Search functionality
- Responsive design

### Technical Implementation
- Next.js 14 with App Router
- Supabase for backend services
- Tailwind CSS for styling
- Real-time updates
- Row Level Security

## API Endpoints

### Authentication
```
POST /auth/signup
POST /auth/login
POST /auth/logout
GET /auth/user
```

### Users
```
GET /users
GET /users/:id
PUT /users/:id
GET /users/search?query=:query
```

### Chats
```
GET /chats
POST /chats
GET /chats/:id
PUT /chats/:id
DELETE /chats/:id
GET /chats/:id/participants
POST /chats/:id/participants
DELETE /chats/:id/participants/:userId
```

### Messages
```
GET /chats/:id/messages
POST /chats/:id/messages
PUT /messages/:id
DELETE /messages/:id
```

## How to Run

1. **Setup Environment**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access Application**
   Open [http://localhost:3000](http://localhost:3000)

## Database Setup

1. Create a Supabase project
2. Run the SQL commands in the Supabase SQL editor
3. Enable Row Level Security policies

## Project Structure

```
periskope/
├── app/                    # Next.js app directory
│   ├── chat/              # Chat functionality
│   ├── auth/              # Authentication
│   └── layout.tsx         # Root layout
├── components/            # UI components
├── lib/                   # Utilities
└── styles/               # Global styles
```

## Implementation Details

### Authentication
- Email-based authentication
- Automatic profile creation
- Protected routes

### Chat System
- Real-time messaging
- Multiple chat rooms
- Participant management
- Message history

### Security
- Row Level Security
- Protected API routes
- Secure authentication



