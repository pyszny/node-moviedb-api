const {ObjectID} = require('mongodb');

const {Movie} = require('./../../models/movie');
const {Comment} = require('./../../models/comment');

const movieOneId = new ObjectID();
const movieTwoId = new ObjectID();

const movies = [{
    _id: movieOneId,
    body: {
        Title: "Test1",
        Year: 1
    }
}, {
    _id: movieTwoId,
    body: {
        Title: "Test2",
        Year: 2
    }
}];

const comments = [{
    _id: new ObjectID(),
    text: "Test comment 1",
    _movieId: movieOneId
}, {
    _id: new ObjectID(),
    text: "Test comment 2",
    _movieId: movieTwoId
}];

const populateMovies = (done) => {
    Movie.remove({}).then(() => {
        return Movie.insertMany(movies);
    }).then(() => done());
};

const populateComments = (done) => {
    Comment.remove({}).then(() => {
        return Comment.insertMany(comments);
    }).then(() => done());
};

module.exports = {movies, populateMovies, populateComments};