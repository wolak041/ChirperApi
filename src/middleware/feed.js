const FeedSchema = require('../models/feed');
const mongoose = require('mongoose');

const stringToObjectId = string => mongoose.Types.ObjectId(string);

const createAggregate = async (match, limit = 1, loggedUserId) =>
  await FeedSchema.aggregate()
    .match(match)
    .sort({ date: 'desc' })
    .limit(parseInt(limit, 10))
    .lookup({
      from: 'users',
      localField: 'user',
      foreignField: '_id',
      as: 'user',
    })
    .project({
      _id: '$_id',
      user: {
        $let: {
          vars: {
            firstUser: { $arrayElemAt: ['$user', 0] },
          },
          in: {
            _id: '$$firstUser._id',
            nickname: '$$firstUser.nickname',
          },
        },
      },
      content: '$content',
      date: '$date',
      likesNumber: { $size: '$likes' },
      isLiked: { $in: [loggedUserId, '$likes'] },
    });

const getMainFeed = async (req, res) => {
  try {
    const limit = parseInt(req.body.limit, 10);
    const lastPostDate = new Date(req.body.lastPostDate);
    const lastPostsIds = req.body.lastPostsIds.map(id => stringToObjectId(id));
    const loggedUserId = stringToObjectId(req.session.user.id);

    const feed = await createAggregate(
      {
        date: { $lte: lastPostDate },
        _id: { $nin: lastPostsIds },
      },
      limit,
      loggedUserId,
    );

    res.send({ message: 'Successful getting posts', feed });
  } catch (err) {
    res.status(500).send({ error: 'Cannot get posts' });
  }
};

const getUserFeed = async (req, res) => {
  try {
    const limit = parseInt(req.body.limit, 10);
    const lastPostDate = new Date(req.body.lastPostDate);
    const lastPostsIds = req.body.lastPostsIds.map(id => stringToObjectId(id));
    const userId = stringToObjectId(req.body.userId);
    const loggedUserId = stringToObjectId(req.session.user.id);

    const feed = await createAggregate(
      {
        user: userId,
        date: { $lt: lastPostDate },
        _id: { $nin: lastPostsIds },
      },
      limit,
      loggedUserId,
    );

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
    const createdPost = (await createAggregate({ _id: stringToObjectId(post._id) }))[0];

    res.send({ message: 'Post created', newPost: createdPost });
  } catch (err) {
    res.status(500).send({ error: 'Cannot save post' });
  }
};

const likePost = async (req, res) => {
  const loggedUserId = req.session.user.id;
  const postId = req.body.postId;

  try {
    const updatedPostId = await FeedSchema.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: loggedUserId } },
      { new: true },
    ).select('_id');

    res.send({ message: 'Post liked', post: updatedPostId });
  } catch (err) {
    res.status(500).send({ error: 'Cannot like post' });
  }
};

const dislikePost = async (req, res) => {
  const loggedUserId = req.session.user.id;
  const postId = req.body.postId;

  try {
    const updatedPostId = await FeedSchema.findByIdAndUpdate(
      postId,
      { $pull: { likes: loggedUserId } },
      { new: true },
    ).select('_id');

    res.send({ message: 'Post disliked', post: updatedPostId });
  } catch (err) {
    res.status(500).send({ error: 'Cannot dislike post' });
  }
};

module.exports = {
  getMainFeed,
  saveNewPost,
  getUserFeed,
  likePost,
  dislikePost,
};
