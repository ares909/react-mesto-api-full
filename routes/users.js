const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserById, createUser, updateUser, updateAvatar, login,
} = require('../controllers/users');
const { validatePassword, validateUrl } = require('../utils/validation');

router.get('/', getUsers);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUserById);
// router.post('/', createUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi
      .string()
      .trim(true)
      .required()
      .min(2)
      .max(30),
    about: Joi
      .string()
      .trim(true)
      .required()
      .min(2)
      .max(30),
  }),
}), updateUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().trim(true).custom(validateUrl, 'custom validation'),
  }),
}), updateAvatar);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(validatePassword, 'custom validation'),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().required().trim(true),
    email: Joi.string().required().email().trim(true),
    password: Joi.string().required().min(8).trim(true)
      .custom(validatePassword, 'custom validation'),
  }),
}), createUser);

module.exports = router;
