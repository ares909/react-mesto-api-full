const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const { celebrate, Joi } = require('celebrate');
const cors = require('cors');
const users = require('./routes/users');
const cards = require('./routes/cards');
const auth = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const {
  createUser, login, logout,
} = require('./controllers/users');
const { validatePassword, validateUrl } = require('./utils/validation');

const { PORT = 3005 } = process.env;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
const app = express();
const NotFoundError = require('./errors/notfound');

// app.options('*', cors())
const originList = [
  'https://khomyakov.nomoredomains.icu', 'http://khomyakov.nomoredomains.icu', 'http://localhost:3000', 'https://localhost:3000',
];
app.use(cors({
  origin: originList,
  credentials: true,
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb2', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(requestLogger);
app.use(limiter);
app.use('/users', auth, users);
app.use('/cards', auth, cards);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(validatePassword, 'custom validation'),
  }),
}), login);
app.use('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateUrl, 'custom validation'),
    email: Joi.string().required().email().trim(true),
    password: Joi.string().required().min(8).trim(true)
      .custom(validatePassword, 'custom validation'),
  }),
}), createUser);
app.use('/logout', logout);
app.use(() => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

//
