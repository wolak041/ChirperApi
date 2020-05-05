const mongose = require('mongoose');

const Schema = mongose.Schema;

const FeedSchema = new Schema({
  user: {
    type: mongose.Schema.Types.ObjectId,
    ref: 'User'
  },
  content: {
    type: String,
    trim: true,
    required: true
  }
});

module.exports = mongose.model('Feed', FeedSchema);
