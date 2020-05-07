const mongose = require('mongoose');

const FeedSchema = new mongose.Schema({
  user: {
    type: mongose.Schema.Types.ObjectId,
    ref: 'User',
  },
  content: {
    type: String,
    trim: true,
    required: true,
  },
});

module.exports = mongose.model('Feed', FeedSchema);
