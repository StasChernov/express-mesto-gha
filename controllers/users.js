const { constants } = require('http2');
const User = require('../models/user');

const responseBadRequestError = (res) => res
  .status(constants.HTTP_STATUS_BAD_REQUEST)
  .send({ message: 'Некорректный запрос пользователя. ' });

const responseValidationError = (res) => res
  .status(constants.HTTP_STATUS_BAD_REQUEST)
  .send({ message: 'Некорректные данные для пользователя. ' });

const responseServerError = (res) => res
  .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
  .send({ message: 'На сервере произошла ошибка. ' });

const responseNotFoundError = (res) => res
  .status(constants.HTTP_STATUS_NOT_FOUND)
  .send({ message: 'Пользователь не найден. ' });

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      responseServerError(res);
    });
};

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
  } = req.body;

  User.create({
    name,
    about,
    avatar,
  })
    .then((user) => res.status(constants.HTTP_STATUS_CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') responseValidationError(res);
      else responseServerError(res);
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        responseNotFoundError(res);
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') responseBadRequestError(res);
      else responseServerError(res);
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(owner, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        responseNotFoundError(res);
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') responseBadRequestError(res);
      else
      if (err.name === 'ValidationError') responseValidationError(res);
      else responseServerError(res);
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        responseNotFoundError(res);
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') responseBadRequestError(res);
      else
      if (err.name === 'ValidationError') responseValidationError(res);
      else responseServerError(res);
    });
};
