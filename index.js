import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import errorHandler from './src/middleware/errorHandler.js';

dotenv.config();

const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security Middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(helmet());

// Welcome Route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Express API with JWT & Cloudinary',
        endpoints: {
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login'
            },
            users: {
                profile: 'GET /api/users/profile',
                update: 'PUT /api/users/profile/:id',
                deletePicture: 'DELETE /api/users/profile/:id/picture'
            }
        }
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Error Handler (harus di akhir)
app.use(errorHandler);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint tidak ditemukan'
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
