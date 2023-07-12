const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/router');
const helmet = require('helmet');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/error-handler');

const { PORT = 3000 } = process.env;
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
app.use(helmet());

mongoose.set('debug', true);
mongoose.connect('mongodb://127.0.0.1/mestodb');

app.use(express.json());
app.use(router);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен! Порт: ${PORT}`);
});
