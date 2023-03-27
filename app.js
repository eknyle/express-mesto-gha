const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./errors/error-handler');
const routes = require('./routes');

const { PORT = 3000 } = process.env;
const app = express();

const PAGE_NOT_FOUND_MESSAGE = 'Страница по указанному маршруту не найдена';

mongoose
  .connect('mongodb://localhost:27017/mestodb')
  .then(console.log('Connected to the server'))
  .catch((err) => console.log(err));

app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.use((req, res) => { res.status(404).send({ message: PAGE_NOT_FOUND_MESSAGE }); });
app.use(errorHandler);

app.listen(PORT, () => { console.log('now listening  on http://localhost:3000/'); });
