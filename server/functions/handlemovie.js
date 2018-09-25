const {Movie} = require('./../models/movie');
const {ObjectID} = require('mongodb');

let handleMovieFilter = (filter, callback) => {
    let filterOrder;
    let filterTypeArray = ['title', 'year', 'genre'];
    let filterOrderArray = ['desc', 'asc'];
    let filters = filter.split('+');
    if(filterTypeArray.indexOf(filters[0]) === -1 || filterOrderArray.indexOf(filters[1]) === -1) {
        callback('No such filter', false);
    } else {
        let filterType = filters[0].charAt(0).toUpperCase() + filters[0].slice(1);
        filterType = "body." + filterType;
        filters[1] === 'asc' ? filterOrder = 1 : filterOrder = -1;
        let finalFilter = {};
        finalFilter[filterType] = filterOrder;
        callback(undefined, finalFilter);
    }
};

let getMovieTitle = (_id, callback) => {
    if(!ObjectID.isValid(_id)) {
        callback('Invalid movie id', false);
    } else {
        Movie.findOne({
            _id: _id
        }).then((movie) => {
            if(!movie) {
                callback('Movie not found', false);
            } else {
                let movieTitle = movie.body.Title;
                callback(undefined, movieTitle);
            }

        });
    }
};

let doesMovieExist = (_movieId) => {
    Movie.findOne({_movieId}).then((movie) => {
        if(!movie) {
            console.log('luj');
            return Promise.reject();
        } else {
            console.log('luj2');
            return Promise.resolve();
        }
    })
};

module.exports = {handleMovieFilter, getMovieTitle, doesMovieExist};