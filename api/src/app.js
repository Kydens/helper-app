const compression = require('compression');
const express = require('express');
const constants = require('./config/constants');
const pool = require('./config/database');
const sequelize = require('./config/sequelize');
const bodyParser = require('body-parser');
const cors = require('cors');
const { default: helmet } = require('helmet');

const app = express();
const routes = require('./routes');

// Menyiapkan izin akses dengan cors
const corsOption = {
  origin: [constants.URL_WEB],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Disposition'],
  credetials: true,
};

/*
 *  Menggunakan Middleware compression, body-parser, cors, dan helmet
 */

// Gunakan compression
app.use(compression());

// Gunakan body-parser untuk menangani JSON dan URL encode data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Gunakan cors
app.use(cors(corsOption));

// Gunakan helmet
app.use(helmet());

// Mengambil routes
app.use(routes);

// Middleware Global untuk memastikan cors dan cache-control
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  next();
});

app.get('/', (req, res) => {
  res.json({
    message: "Welcome to 'Helper-App' API!",
    status: 'success',
    version: '1.0.0',
  });
});

require('./modules/auth/v1/models/s_user_roles');
require('./modules/auth/v1/models/s_user_cookies');
require('./modules/auth/v1/models/s_user_logs');
require('./modules/auth/v1/models/s_users');
require('./modules/features/v1/models/f_wallets');
require('./modules/features/v1/models/f_todolist');
require('./modules/master/v1/models/s_roles');

const syncDatabase = async () => {
  try {
    await sequelize.sync();
    console.log('Database Synchronized!');
  } catch (error) {
    console.log('Error Sync Database: ', error);
  }
};

syncDatabase();

// Middleware untuk menangani error
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isDev = constants.MODE === 'development';

  console.error(`Error: ${err.message}`);
  if (isDev) console.error(err.stack);

  res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || 'Something went wrong!',
    stack: isDev ? err.stack : undefined,
  });
});

const PORT = constants.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
