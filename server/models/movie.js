const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    body: {
        type: JSON,
        required: true
    }
});

MovieSchema.statics.checkMovieById = function (_movieId) {
    let Movie = this;

    return Movie.findOne({_id: _movieId}).then((movie) => {
        if(!movie) {
            return Promise.reject();
        } else {
            return Promise.resolve(movie._id);
        }
    })
};

const Movie = mongoose.model('Movie', MovieSchema);

module.exports = {Movie};