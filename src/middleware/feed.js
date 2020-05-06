const FeedSchema = require('../models/feed');

const getPostsList = (req, res) => {
  FeedSchema.find({}, {}, (err, posts) => {
    err
      ? res.status(401).send({ error: 'Unauthorized' })
      : res.json({ message: 'Successful getting posts', posts });
  });
};

const saveNewPost = (req, res) => {
  FeedSchema.create(
    {
      user: req.session.user.id,
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
};

module.exports = {
  getPostsList,
  saveNewPost,
};
