const express = require('express');
const mongoose = require('mongoose');
const { NOT_FOUND_ERROR } = require('./errors/errors');

const { PORT = 3000 } = process.env;

const app = express();

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
  });

app.use((req, res, next) => {
  req.user = {
    _id: '6453078b71ce196165834003',
  };
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: 'Page not found' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
