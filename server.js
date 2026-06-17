require('dotenv').config();

const express = require('express');
const cors = require('cors');

const db = require('./models');
const profileRoutes = require('./routes/profileRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date(),
    database: db.sequelize.authenticate() ? 'CONNECTED' : 'DISCONNECTED'
  });
});

app.use('/api', profileRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.originalUrl}`
  });
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✔ Connection to MySQL Database has been established successfully.');

    await db.sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✔ Database models synchronized successfully.');

    app.listen(PORT, () => {
      console.log(`✔ Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      console.log(`✔ Health check available at: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database or start server:', error);
    process.exit(1);
  }
};

startServer();
