import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        service: 'airspace-watch-api',
        timestamp: new Date().toISOString()
    });
});

app.get('/db-test', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT NOW() AS current_time'
        );

        res.status(200).json({
            status: 'success',
            message: 'Database connection established',
            databaseTime: result.rows[0].current_time
        });

    } catch (error) {
        console.error('Database connection failed:', error.message);

        res.status(500).json({
            status: 'error',
            message: 'Database connection failed'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Airspace Watch API running on port ${PORT}`);
});