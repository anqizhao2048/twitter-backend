const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tweetSchema = new Schema({
    id: String,
    username: String,
    text: String,
    createdAt: Date,
    updatedAt: Date,
});

const Tweet = mongoose.model('tweet', tweetSchema);

module.exports = {Tweet};