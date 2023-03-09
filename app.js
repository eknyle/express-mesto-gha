const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

const PAGE_NOT_FOUND_MESSAGE = 'Страница по указанному маршруту не найдена';

mongoose
  .connect('mongodb://localhost:27017/mestodb')
  .then(console.log('Connected to the server'))
  .catch((err) => console.log(err));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64062c6370b57a8878da3de7',
  };

  next();
});

app.use('/cards', require('./routes/cards'));

app.use('/users', require('./routes/users'));

app.use((req, res) => { res.status(404).send({ message: PAGE_NOT_FOUND_MESSAGE }); });

app.listen(PORT, () => { console.log('now listening  on http://localhost:3000/'); });
