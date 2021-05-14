// const BadRequestError = require('../errors/badrequest');

module.exports.validateUrl = (value, helpers) => {
  if (!/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.test(value)) {
    return helpers.message('Некорректная ссылка');
    // return new BadRequestError('Некорректная ссылка');
  }
  return value;
};

module.exports.validatePassword = (value, helpers) => {
  if (!/^[\d\w/.\S]{2,30}$/.test(value)) {
    return helpers.message('Некорректный пароль');
  }
  return value;
};
