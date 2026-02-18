![Screenshot](https://github.com/Deekshap16/Instaclone/blob/4112d4ec059ef0a057c705648c5a3f485c73aa18/Screenshot%202026-02-18%20194158.png)
# 📸 Instaclone — MERN Instagram-like App

A full-stack Instagram-inspired social media application built with the MERN stack.

## ✨ Features

- **Auth**: Register, Login, Logout with JWT
- **Posts**: Create (image + caption), Feed, Like/Unlike, Comment, Delete
- **Follow System**: Follow/Unfollow, Profile pages, Followers/Following counts
- **Explore**: Posts grid, Search users by username
- **Chat**: Real-time 1-on-1 messaging via Socket.io

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + TailwindCSS + React Router v6 |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (7-day expiry) |
| File Upload | Multer (stored in `/backend/uploads/`) |
| Real-time | Socket.io |

---

## 📁 Project Structure

```
instagram-app/
├── backend/
│   ├── server.js
│   ├── seed.js               # Seed dummy data
│   ├── .env
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── postRoutes.js
│   │   └── chatRoutes.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── postController.js
│   │   └── chatController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   └── uploads/              # Auto-created, stores uploaded images
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── api/axios.js
        ├── context/
        │   ├── AuthContext.jsx
        │   └── SocketContext.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── PostCard.jsx
        │   └── UserCard.jsx
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Feed.jsx
        │   ├── Explore.jsx
        │   ├── Profile.jsx
        │   ├── CreatePost.jsx
        │   └── Chat.jsx
        └── utils/
            └── time.js
```

---

## 🚀 Setup & Run

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

---

### 1. Clone or extract the project

```bash
cd instagram-app
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

**Configure environment:**

Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/instagram_clone
JWT_SECRET=your_super_secret_jwt_key_change_this
CLIENT_URL=http://localhost:5173
```

> For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

**Seed dummy data (optional but recommended):**
```bash
npm run seed
```

This creates 3 demo users with posts, follows, and messages.

**Start backend:**
```bash
npm run dev
# or: npm start
```

Backend runs at: `http://localhost:5000`

---

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 👤 Demo Accounts (after seeding)

All accounts use password: **`password`**

| Username | Email |
|----------|-------|
| alice | alice@example.com |
| bob | bob@example.com |
| charlie | charlie@example.com |

---

## 🔌 API Reference

### Auth
```
POST   /api/auth/register        Register new user
POST   /api/auth/login           Login
```

### Users
```
GET    /api/users/:id            Get user by ID
PUT    /api/users/update         Update profile (multipart/form-data)
POST   /api/users/follow/:id     Follow user
POST   /api/users/unfollow/:id   Unfollow user
GET    /api/users/search?query=  Search users
```

### Posts
```
POST   /api/posts/create         Create post (multipart/form-data)
GET    /api/posts/feed           Get feed (followed users + own posts)
GET    /api/posts/explore        Get all posts
GET    /api/posts/user/:id       Get user's posts
POST   /api/posts/like/:id       Like/unlike post
POST   /api/posts/comment/:id    Add comment
DELETE /api/posts/:id            Delete post (owner only)
```

### Chat
```
POST   /api/chat/send            Send message
GET    /api/chat/conversations   Get all conversations
GET    /api/chat/:userId         Get messages with a user
```

---

## 🔧 Common Issues

**Port already in use:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

**MongoDB connection error:**
- Make sure MongoDB is running: `brew services start mongodb-community` (Mac) or `sudo systemctl start mongod` (Linux)
- Or use MongoDB Atlas and update `MONGO_URI` in `.env`

**Images not loading:**
- Seeded posts use `picsum.photos` placeholder images (requires internet)
- Uploaded images served from `backend/uploads/` via `/uploads/` static route

**CORS errors:**
- Ensure `CLIENT_URL` in `.env` matches your frontend URL exactly
- Default is `http://localhost:5173`

---

## 📦 Production Notes

For production deployment:
- Set strong `JWT_SECRET`
- Use MongoDB Atlas instead of local MongoDB
- Consider using Cloudinary for image storage instead of local `/uploads`
- Build frontend: `cd frontend && npm run build`
- Serve built frontend with Express or a CDN
