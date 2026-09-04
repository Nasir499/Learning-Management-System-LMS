import { configDotenv } from "dotenv";
configDotenv();
import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import morgan from "morgan";
import userRoute from "./routes/user.routes.js"
import errorMiddleware   from "./middlewares/error.middleware.js";
import courseRoute from "./routes/course.routes.js"
import paymentRoute from "./routes/payment.routes.js"
import misRoutes from "./routes/miscellaneous.routes.js"
import rateLimit from "express-rate-limit";

const app = express();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 requests per 15 minutes
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((url) => url.trim().replace(/\/$/, ''))
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback to true to prevent blocking production cross-origin credentials during initial setup
    },
    credentials: true,
  })
)
app.use(cookieParser())

app.use(morgan("dev"))

// Rate limiting on sensitive auth endpoints
app.use('/api/v1/user/login', authLimiter);
app.use('/api/v1/user/register', authLimiter);
app.use('/api/v1/user/forgot', authLimiter);

//Routes
app.use('/api/v1/user',userRoute)
app.use('/api/v1/course',courseRoute)
app.use('/api/v1/payments',paymentRoute)
app.use('/api/v1', misRoutes);

app.use(errorMiddleware)



export default app;