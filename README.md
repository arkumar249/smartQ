# 🏥 smartQ — Smart Token Queue System

A **full-stack Smart Token Queue System** for medical stores that lets users book queue tokens online, upload prescriptions, receive live token updates, and helps store admins manage the queue in real time.

**Built with:** Node.js, Express, EJS, MongoDB, Cloudinary, and Socket.IO

---

## ✨ Features

### 👤 User

* Book tokens by selecting a store or scanning a store QR code
* Upload prescription images
* See live token position and estimated wait time
* Receive notifications when token status changes

### 🏪 Admin (Store)

* Register a store and manage a dashboard
* Update out-of-stock medicines
* Manage token statuses (**used / cancelled**)
* Receive real-time store queue updates and notify users

### ⚡ Real-time

* **Socket.IO rooms per-user and per-store** for efficient streaming of relevant updates

---

## 📚 Table of Contents

* Requirements
* Environment variables
* Installation & run
* Architecture & flow
* Data models (User, Store, Token)
* REST endpoints (Auth, User, Admin, API)
* WebSocket events & client examples
* File uploads (Cloudinary)
* Security & production notes
* Troubleshooting
* Contributing & license

---

## 🛠 Requirements

* Node.js (**v18+ recommended**)
* npm
* MongoDB (local or hosted)
* Cloudinary account (for prescription uploads)
* *(Optional)* ngrok or similar for exposing local server when testing sockets from remote devices

---

## 🔐 Environment Variables

Create a `.env` file in the project root. The app reads:

| Variable           | Description                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------------- |
| `MONGO_URI`        | MongoDB connection string (defaults to `mongodb://localhost:27017/project_q` if not provided) |
| `JWT_SECRET`       | Secret used to sign authentication tokens (cookie `"token"`)                                  |
| `CLOUD_NAME`       | Cloudinary cloud name                                                                         |
| `CLOUD_API_KEY`    | Cloudinary API key                                                                            |
| `CLOUD_API_SECRET` | Cloudinary API secret                                                                         |
| `PORT`             | Optional port (default **5500**)                                                              |

### Example `.env`

```env
MONGO_URI=mongodb://localhost:27017/project_q
JWT_SECRET=change_this_to_a_secure_secret
CLOUD_NAME=your-cloud-name
CLOUD_API_KEY=your-api-key
CLOUD_API_SECRET=your-api-secret
PORT=5500
```

---

## 🚀 Installation & Run

```bash
git clone https://github.com/arkumar249/smartQ.git
cd smartQ
npm install
npm start
```

The start script uses **nodemon** (auto-reloads on changes).

Visit 👉 **[http://localhost:5500](http://localhost:5500)**

---

## 🧠 Architecture & Flow (High Level)

**index.js**
App entry — sets up Express, mounts routes, and initializes Socket.IO.

**connection.js**
Connects to MongoDB using mongoose.

**socket.js**
Initializes a singleton Socket.IO server. Supports:

* `join-user` (socket joins a per-user room)
* `join-store` (socket joins a per-store room)

Server emits events to rooms:

* `storeQueueUpdate`
* `queuePositionUpdate`
* `userTokenStatusChanged`

### 🔑 Authentication

* JWT cookie (`"token"`) set on signup/signin and used by middlewares to protect routes (`reqauth`)
* Passwords hashed with **bcrypt** via a pre-save hook on the User model

### 🎟 Token Lifecycle

* Token documents created with `tokenNumber` based on `Store.tokenCounter`
* Default status: `"active"`
* Admin can update token status to `"used"` or `"cancelled"`
* When token status changes, the app emits updates to the affected user and store participants

### ☁️ File Uploads

* Uses **multer + multer-storage-cloudinary**
* Uploaded file URL saved in `Token.prescription.imageUrl`

---

## 🗃 Data Models (Summary)

### 👤 User

* `name, phone, email, password`
* `role`: `'user' | 'admin' | 'superadmin'`
* `ActiveToken` (bool)
* `tokensRequested: [Token]`

### 🏪 Store

* `name, address, contact, isOpen`
* `tokenCounter`
* `averageWaitTime`
* `admin` (ref to User)
* `outOfStock: [String]`
* `allTokens: [Token]`

### 🎟 Token

* `user` (ref to User)
* `store` (ref to Store)
* `status`: `"active" | "used" | "cancelled"`
* `tokenNumber`
* `tokenPosition`
* `prescription: { uploaded: Boolean, imageUrl: String }`

---

## 🌐 REST Endpoints

### 🔐 Auth Routes

| Method | Endpoint       | Description                                                                              |
| ------ | -------------- | ---------------------------------------------------------------------------------------- |
| GET    | `/auth/signin` | Sign-in page (EJS)                                                                       |
| GET    | `/auth/signup` | Sign-up page (EJS)                                                                       |
| POST   | `/auth/signup` | Body: `{ name, email, password, role }` → Creates user, sets cookie `"token"`, redirects |
| POST   | `/auth/signin` | Body: `{ email, password }` → Sets cookie and redirects                                  |
| GET    | `/auth/logout` | Clears cookie and redirects to home                                                      |

---

### 👤 User Routes (Protected — role "user")

| Method | Endpoint                             | Description               |
| ------ | ------------------------------------ | ------------------------- |
| GET    | `/user/`                             | Renders user dashboard    |
| GET    | `/user/token`                        | Token generation page     |
| POST   | `/user/generate-token`               | Create token for store    |
| POST   | `/user/token-delete`                 | Cancel active token       |
| GET    | `/user/token-history`                | View token history        |
| POST   | `/user/upload-prescription/:tokenId` | Upload prescription image |

**Upload field name:** `prescription`

---

### 🏪 Admin Routes (Protected — role "admin")

| Method | Endpoint                   | Description                  |
| ------ | -------------------------- | ---------------------------- |
| GET    | `/admin/`                  | Admin dashboard              |
| POST   | `/admin/add-store`         | Create store                 |
| POST   | `/admin/update-outofstock` | Update out-of-stock list     |
| POST   | `/admin/update-token/:id`  | Mark token as used/cancelled |

---

### 📡 Public API Routes

| Method | Endpoint                     | Description                |
| ------ | ---------------------------- | -------------------------- |
| GET    | `/api/token-status/:tokenId` | Returns token queue status |
| GET    | `/api/store/:storeId`        | Get store details          |
| GET    | `/api/tokens/:userId`        | Get all tokens of a user   |

---

## 🔌 WebSocket Events

### Rooms

* `join-user` → user joins personal room
* `join-store` → admin joins store room

### Server Emits

* `storeQueueUpdate`
* `queuePositionUpdate`
* `userTokenStatusChanged`

---

## ☁️ File Uploads (Cloudinary)

* Uses `CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_API_SECRET`
* Field name must be **prescription**
* URL saved in `Token.prescription.imageUrl`

---


## 📁 Project Structure

```
index.js        — server setup & socket init  
socket.js       — socket server singleton  
connection.js   — MongoDB connection  
config/         — cloudinary & upload config  
models/         — user, store, token schemas  
routes/         — auth, user, admin, api routes  
utils/          — queueUpdate.js, util.js  
views/          — EJS templates  
public/         — static assets  
```

---
