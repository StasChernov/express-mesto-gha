const { constants } = require('http2');
const Card = require('../models/card');

const responseBadRequestError = (res) => res
  .status(constants.HTTP_STATUS_BAD_REQUEST)
  .send({ message: 'Некорректный запрос карточки. ' });

const responseServerError = (res) => res
  .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
  .send({ message: 'На сервере произошла ошибка. ' });

const responseValidationError = (res) => res
  .status(constants.HTTP_STATUS_BAD_REQUEST)
  .send({ message: 'Некорректные данные для карточки. ' });

const responseNotFoundError = (res) => res
  .status(constants.HTTP_STATUS_NOT_FOUND)
  .send({ message: 'Карточка не найдена. ' });

module.exports.getCards = (req, res) => {
  Card.find({}).populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      responseServerError(res);
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        responseNotFoundError(res);
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') responseBadRequestError(res);
      else responseServerError(res);
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(constants.HTTP_STATUS_CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') responseValidationError(res);
      else responseServerError(res);
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        responseNotFoundError(res);
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') responseBadRequestError(res);
      else responseServerError(res);
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        responseNotFoundError(res);
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') responseBadRequestError(res);
      else responseServerError(res);
    });
};
