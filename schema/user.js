const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: String,
    displayName: String,
    username: String,
    password: String,
    desc: String,
    joinedAt: Date,
    follower: [],
    following: [],
});

const User = mongoose.model('user', userSchema);

module.exports = {User};