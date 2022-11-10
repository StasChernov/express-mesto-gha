const User = require('../models/user');

const responseBadRequestError = (res, message) => res
  .status(400)
  .send({
    message: `Некорректные данные для пользователя. ${message}`,
  });

const responseServerError = (res, message) => res
  .status(500)
  .send({
    message: `На сервере произошла ошибка. ${message}`,
  });

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => responseServerError(res, err.message));
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
    .then((user) => res.send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    }))
    .catch((err) => responseBadRequestError(res, err.message));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      console.log(user);
      if (!user) {
        throw new Error(404, `Not found`)
      } else {
        console.log(user);
        res.send({ data: user });

      }
    })
    //.catch((err) => responseBadRequestError(res, err.message));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(owner, { name, about }, { new: true })
    .then((user) => res.send({
      _id: user._id,
      name: user.name,
      about: user.about,
    }))
    .catch((err) => responseBadRequestError(res, err.message));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(owner, { avatar }, { new: true })
    .then((user) => res.send({
      _id: user._id,
      avatar: user.avatar,
    }))
    .catch((err) => responseBadRequestError(res, err.message));
};
