const jwt = require('jsonwebtoken');
const FeedSchema = require('../models/feed');
const config = require('../../config/common');

const getPostsList = (req, res, next) => {
  FeedSchema.find({}, {}, (err, posts) => {
    if (err || !posts) {
      res.status(401).send({
        message: 'Unauthorized',
      });
      next(err);
    } else
      res.json({
        status: 'success',
        posts,
      });
  });
};

const saveNewPost = (req, res) => {
  const bearer = 'Bearer';
  const authorizationToken = req.headers.authorization.split(' ');

  if (authorizationToken[0] !== bearer)
    return res.status(401).send({
      error: 'Token not complete',
    });

  jwt.verify(authorizationToken[1], config.TOKEN_SECRET_JWT, (err, payload) => {
    if (err)
      return res.status(401).send({
        error: 'Token invalid',
      });

    FeedSchema.create(
      {
        user: payload.sub,
        content: req.body.content,
      },
      (err) => {
        if (err)
          res.status(500).send({
            error: 'Cannot save post',
          });
        else
          res.json({
            message: 'Post created',
          });
      },
    );
  });
};

module.exports = {
  getPostsList,
  saveNewPost,
};
