# 🎓 Learning Management System (LMS) Platform

[![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Frontend-React_%2B_Vite-646CFF.svg)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_%2B_Express-339933.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248.svg)](https://www.mongodb.com/)
[![Razorpay](https://img.shields.io/badge/Payments-Razorpay-02042B.svg)](https://razorpay.com/)
[![Cloudinary](https://img.shields.io/badge/Media-Cloudinary-3448C5.svg)](https://cloudinary.com/)

A modern, full-stack **Learning Management System (LMS)** built with the **MERN** stack (MongoDB, Express.js, React + Vite, Node.js). The platform provides online course hosting, video lecture streaming, subscription monetization via Razorpay, role-based access control (RBAC), and an interactive Admin analytics dashboard.

---

## 🌟 Key Features

### 👤 Student / User Experience
- **Authentication & Security**: Secure registration, login, logout, and profile management with HTTP-Only cookie-based JWT authentication and `bcrypt` password hashing.
- **Password Recovery**: Secure password reset flow using tokenized email links via Nodemailer.
- **Course Discovery**: Browse and search full course catalogs with course descriptions, categories, thumbnails, and total lecture counts.
- **Subscription Engine**: Integrated Razorpay subscription gateway allowing users to purchase monthly/annual passes to access course content.
- **Interactive Video Player**: Custom streaming video player with lecture selection, progress navigation, and access control.

### 👑 Admin / Instructor Features
- **Course Management**: Full CRUD operations for courses (Create, Read, Update, Delete).
- **Lecture Upload Pipeline**: Upload high-definition video lectures using chunked streaming directly to Cloudinary CDN (`upload_large` up to multi-GB support).
- **Admin Analytics Dashboard**: Real-time business metrics powered by **Chart.js**:
  - **User Distribution**: Pie chart visualizing total registered vs. active subscribed users.
  - **Revenue Analytics**: Bar chart displaying monthly payment and subscription records.

### 🛡️ Backend Security & Performance
- **Role-Based Access Control (RBAC)**: Route middleware restricting admin functions to `ADMIN` role.
- **Subscription Access Verification**: Custom middleware verifying active Razorpay subscription status before serving lecture videos.
- **Rate Limiting**: IP-based request throttling using `express-rate-limit` on sensitive authentication endpoints to block brute-force attacks.
- **File Upload Cleanup**: Multer disk storage handling with automatic local file deletion (`fs.rm`) post Cloudinary upload.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **State Management**: Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS + DaisyUI
- **Data Visualization**: Chart.js (`chart.js`, `react-chartjs-2`)
- **HTTP Client**: Axios (with `withCredentials: true`)
- **Notifications**: React Hot Toast
- **Icons**: React Icons (`react-icons`)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database & ORM**: MongoDB & Mongoose
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), `cookie-parser`, `bcrypt`
- **Security & Utilities**: `express-rate-limit`, `cors`, `crypto`, `morgan`
- **File Uploads**: `multer`, `cloudinary`
- **Payment Gateway**: `razorpay` API
- **Email Service**: `nodemailer`

---

## 📁 Repository & Project Structure

```
LMS-E/
├── LMS(frontend)/                # React + Vite Frontend Application
│   ├── public/                   # Static public assets
│   ├── src/
│   │   ├── Assets/               # UI Images and graphic assets
│   │   ├── Components/           # Reusable UI components & Auth wrappers
│   │   │   ├── Auth/             # RequireAuth role & sub guards
│   │   │   ├── CourseCard.jsx    # Individual course display card
│   │   │   ├── ErrorBoundary.jsx # Global React Error Boundary
│   │   │   └── Footer.jsx        # Footer component
│   │   ├── Helpers/              # Axios instance & custom regex helpers
│   │   ├── Layouts/              # Home & Page layouts
│   │   ├── Pages/                # Application views (Auth, Course, Dashboard, Payment)
│   │   ├── Redux/                # Redux store & state slices
│   │   │   ├── Slices/           # AuthSlice, CourseSlice, LectureSlice, RazorpaySlice, StatSlice
│   │   │   └── Store.js          # Centralized Redux store
│   │   ├── App.jsx               # Application routes & Suspense code-splitting
│   │   └── main.jsx              # React entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── server/                       # Node.js + Express Backend API
    ├── config/                   # MongoDB connection logic
    ├── controllers/              # Request handlers (user, course, payment, misc)
    ├── middlewares/              # Express middlewares (auth, error, multer)
    ├── models/                   # Mongoose database schemas (User, Course, Payment)
    ├── routes/                   # REST API endpoint definitions
    ├── utils/                    # Helper functions (error handling, email sending)
    ├── app.js                    # Express app configuration & middleware setup
    ├── server.js                 # Server initialization, Cloudinary & Razorpay configs
    └── package.json
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server Config
PORT=8080
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database Config
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/lms?retryWrites=true&w=majority

# JWT Authentication Config
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRY=7d

# Cloudinary Config
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay Payment Config
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret
RAZORPAY_PLAN_ID=plan_your_plan_id
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# SMTP Email Config (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM_EMAIL=your_email@gmail.com
```

---

## 🚀 Getting Started & Installation

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas URI
- **Cloudinary Account**: For media asset storage
- **Razorpay Account**: For payment integration

### Step 1: Clone the Repository
```bash
git clone https://github.com/Nasir499/Learning-Management-System-LMS-.git
cd Learning-Management-System-LMS-
```

### Step 2: Backend Setup
```bash
cd server
npm install
# Configure your .env file as shown above
npm run dev
```
The server will start listening at `http://localhost:8080`.

### Step 3: Frontend Setup
Open a new terminal window:
```bash
cd LMS(frontend)
npm install
npm run dev
```
The frontend Vite development server will start at `http://localhost:5173`.

---

## 📡 REST API Reference

### 🔐 User & Authentication Routes (`/api/v1/user`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Public | Register new user with optional profile avatar |
| `POST` | `/login` | Public | Authenticate user & set HTTP-Only JWT cookie |
| `GET` | `/logout` | Authenticated | Clear authentication cookie |
| `GET` | `/me` | Authenticated | Fetch authenticated user profile |
| `POST` | `/forgot` | Public | Request password reset token via email |
| `POST` | `/reset/:resetId` | Public | Reset password using email token |
| `POST` | `/change-password`| Authenticated | Change account password |
| `PUT` | `/update/:id` | Authenticated | Update user profile details / avatar |

### 📚 Course Routes (`/api/v1/course`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Public | Fetch all courses (without lecture content) |
| `POST` | `/` | Admin | Create a new course with thumbnail upload |
| `GET` | `/:id` | Subscriber / Admin | Fetch lectures of a specific course |
| `PUT` | `/:id` | Admin | Update course details |
| `DELETE`| `/:id` | Admin | Delete a course |
| `POST` | `/:id` | Admin | Add a lecture video to a course |
| `DELETE`| `/:id/lectures/:lectureId` | Admin | Delete a lecture from a course |

### 💳 Payment Routes (`/api/v1/payments`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/razorpay-key` | Authenticated | Fetch Razorpay Key ID |
| `POST` | `/subscribe` | User | Create a Razorpay subscription |
| `POST` | `/verify` | User | Verify payment signature & activate subscription |
| `POST` | `/unsubscribe` | User | Cancel active subscription |
| `GET` | `/` | Admin | Fetch subscription analytics & monthly revenue stats |
| `POST` | `/webhook` | Public (Razorpay) | Handle Razorpay automated billing webhooks |

---

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AwesomeFeature`)
3. Commit your Changes (`git commit -m 'Add some AwesomeFeature'`)
4. Push to the Branch (`git push origin feature/AwesomeFeature`)
5. Open a Pull Request
