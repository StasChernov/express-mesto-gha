const Card = require('../models/card');

const responseBadRequestError = (res, message) => res
  .status(400)
  .send({
    message: `Некорректные данные для карточки. ${message}`,
  });

const responseServerError = (res, message) => res
  .status(500)
  .send({
    message: `На сервере произошла ошибка. ${message}`,
  });

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => responseServerError(res, err.message));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      res.send(card);
    })
    .catch((err) => responseBadRequestError(res, err.message));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => responseBadRequestError(res, err.message));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена.' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => responseBadRequestError(res, err.message));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      res.send(card);
    })
    .catch((err) => responseBadRequestError(res, err.message));
};
