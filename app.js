const express = require('express');
const mongoose = require('mongoose');
const app = express();
mongoose.connect('mongodb://127.0.0.1/mestodb');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { PORT = 3000 } = process.env;
app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '649d8bf3faf805a03fa9c8d1',
  };

  next();
});
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res, next) => {
  res.status(404).send({ message: 'Запрошен несуществующий роут' });
  next();
});
app.listen(PORT, () => {
  console.log(`Сервер запущен! Порт: ${PORT}`);
});
