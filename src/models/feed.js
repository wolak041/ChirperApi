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
  date: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: [{ type: mongose.Schema.Types.ObjectId, ref: 'User' }],
  },
});

module.exports = mongose.model('Feed', FeedSchema);
