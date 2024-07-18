const express = require('express');
require('express-async-errors');
const dotenv = require('dotenv');
const colors = require('colors');
const cors = require('cors');
const morgan = require('morgan');
// Security packages
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
// File imports
const connectDB = require('./config/db.js');
// Routes import
const testRoutes = require('./routes/testRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const errroMiddelware = require('./middlewares/errroMiddleware.js');
const jobsRoutes = require('./routes/jobsRoute.js');
const userRoutes = require('./routes/userRoutes.js');

// For Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

// Dot ENV config
dotenv.config();

// MongoDB connection
connectDB();

// Create Express app
const app = express();

// Middleware setup
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routes setup
app.use('/api/v1/test', testRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/job', jobsRoutes);

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error handling middleware
app.use(errroMiddelware);

// Port configuration
const PORT = process.env.PORT || 8080;

// Start
app.listen(PORT, () => {
  // console.log(
  //   `Node Server Running In ${process.env.DEV_MODE} Mode on port no ${PORT}`
  //     .bgCyan.white
  // );
});
