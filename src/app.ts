import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import { errorHandler } from './middlewares/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import recordRoutes from './modules/records/record.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import { setupSwagger } from './swagger';
import { globalLimiter } from './middlewares/rate.middleware';

const app = express();


app.use(cors());
app.use(express.json());

// Apply global rate limiting
app.use(globalLimiter);

// Main Routes
app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Setup Swagger
setupSwagger(app);


// Centralized error handling must be the last middleware
app.use(errorHandler);

export default app;
