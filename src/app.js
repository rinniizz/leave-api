const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swaggerConfig');
const handleDatabaseConnection = require('./middleware/dbMiddleware');
const logger = require('./logger');
const morgan = require('morgan');
const authenticateToken = require('./middleware/authMiddleware');
const security = require('./security');

const authRoutes = require('./routes/authRoutes')
const selectionRoutes = require('./routes/selectionRoutes');
const usersRoutes = require('./routes/usersRoutes');
const requestRoutes = require('./routes/requestRoutes');



const app = express();


app.use(cors({
    origin: "*",
    exposedHeaders: ["Authorization"] // Expose Authorization header
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(handleDatabaseConnection);

app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Public Routes
app.use('/api/auth', authRoutes);
app.use('/api/select', selectionRoutes);
app.use('/api/user', usersRoutes);
app.use('/api/request', requestRoutes);

app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
    logger.error('Error processing request', { error: err.message, stack: err.stack });
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).send({ error: { fatal: true } });
});

module.exports = app;