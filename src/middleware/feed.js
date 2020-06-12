const FeedSchema = require('../models/feed');

const getMainFeed = async (req, res) => {
  try {
    const limit = parseInt(req.body.limit, 10);
    const lastPostDate = new Date(req.body.lastPostDate);
    const lastPostsIds = req.body.lastPostsIds;

    const feed = await FeedSchema.find({
      date: { $lte: lastPostDate },
      _id: { $nin: lastPostsIds },
    })
      .sort({ date: 'desc' })
      .limit(parseInt(limit, 10))
      .populate('user');

    res.send({ message: 'Successful getting posts', feed });
  } catch (err) {
    res.status(500).send({ error: 'Cannot get posts' });
  }
};

const getUserFeed = async (req, res) => {
  try {
    const feed = await FeedSchema.find();

    res.send({ message: 'Successful getting posts', feed });
  } catch (err) {
    res.status(500).send({ error: 'Cannot get posts' });
  }
};

const saveNewPost = async (req, res) => {
  const newPost = {
    user: req.session.user.id,
    content: req.body.newPost,
  };

  try {
    const post = await FeedSchema.create(newPost);
    const postAndUser = await post.populate('user').execPopulate();

    res.send({ message: 'Post created', newPost: postAndUser });
  } catch (err) {
    res.status(500).send({ error: 'Cannot save post' });
  }
};

module.exports = {
  getMainFeed,
  saveNewPost,
  getUserFeed,
};
