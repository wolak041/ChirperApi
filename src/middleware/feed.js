const FeedSchema = require('../models/feed');

const getPostsList = async (req, res) => {
  try {
    const feed = await FeedSchema.find();

    res.send({ message: 'Successful getting posts', feed });
  } catch (err) {
    res.status(401).send({ error: 'Unauthorized' });
  }
};

const saveNewPost = async (req, res) => {
  const newPost = {
    user: req.session.user.id,
    content: req.body.content,
  };

  try {
    await FeedSchema.create(newPost);

    res.send({ message: 'Post created' });
  } catch (err) {
    res.status(500).send({ error: 'Cannot save post' });
  }
};

module.exports = {
  getPostsList,
  saveNewPost,
};
