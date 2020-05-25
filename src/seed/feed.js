const FeedSchema = require('../models/feed');
const UserSchema = require('../models/users');
require('colors');

const countPosts = async () => await FeedSchema.find().countDocuments().exec();

const getTestUser = async () =>
  await UserSchema.findOne({ email: 'test@test.com' }).select('_id').exec();

const initializeFeed = async () => {
  const testUser = await getTestUser();
  const postsNumber = await countPosts();

  if (!postsNumber && testUser && testUser.id) {
    const post = new FeedSchema({
      user: testUser.id,
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    });

    post.save((err) =>
      err
        ? console.log('\n🚨🚨🚨 Could not create post 🚨🚨🚨\n', err.toString().brightRed)
        : console.log('\n📝📝📝 Post initialized 📝📝📝\n'),
    );
  }
};

module.exports = initializeFeed;
