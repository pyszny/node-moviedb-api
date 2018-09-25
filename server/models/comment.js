const mongoose = require('mongoose');
const {ObjectID} = require('mongodb');

const Comment = mongoose.model('Comment', {
    text: {
        type: String,
        required: true
    },
    _movieId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

module.exports = {Comment};