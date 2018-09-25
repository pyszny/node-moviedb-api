require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {ObjectID} = require('mongodb');
const {Comment} = require('./models/comment');
const {Movie} = require('./models/movie');

const moviereq = require('./requests/moviereq');
const {handleMovieFilter, getMovieTitle, doesMovieExist} = require('./functions/handlemovie');


let app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/movies', (req, res) => {
    if(!req.body.title) {
        return res.status(404).send('Please provide valid movie title');
    } else {
        let body = _.pick(req.body, ['title']);
        let title = body.title;
        moviereq.movieReq(title, (errorMessage, results) => {
            if(errorMessage) {
                return res.status(404).send(errorMessage);
            } else {
                let movie = new Movie({
                    body: results.body
                });
                movie.save().then((doc) => {
                    res.send(doc);
                }, (e) => {
                    res.status(400).send(e);
                });
            }
        });
    }
});

app.post('/comments', (req, res) => {
    let comment = new Comment({
        text: req.body.text,
        _movieId: req.body._movieId
    });
    getMovieTitle(req.body._movieId, (errorMessage, result) => {
        if(errorMessage) {
            return res.status(404).send(errorMessage);
        } else {
            comment.save().then((doc) => {
                let resBody = {
                    text: doc.text,
                    movieTitle: result
                };
                res.status(200).send(resBody);
            }).catch((e) => {
                res.status(400).send(e);
            });
        }
    });
});

app.get('/movies', (req, res) => {
    Movie.find().then((movies) => {
        res.send({movies});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/movies/:filter', (req, res) => {
    let filter = req.params.filter;
    handleMovieFilter(filter, (errorMessage, result) => {
        if(errorMessage) {
            return res.status(404).send(errorMessage);
        } else {
            Movie.find().sort(result).then((movies) => {
                res.send({movies});
            }, (e) => {
                res.status(400).send(e);
            });
        }
    });
});

app.get('/comments', (req, res) => {
    Comment.find().then((comments) => {
        res.send({comments});
    }, (e) => {
        res.status(400).send(e);
    })
});

app.get('/comments/:id', (req, res) => {
    let _movieId = req.params.id;
    if (!ObjectID.isValid(_movieId)) {
        res.status(404).send('Invalid movie id');
    } else {
        Movie.checkMovieById(_movieId).then((_movieId) =>
            Comment.find({_movieId}).then((doc) => {
                if (doc.length === 0) {
                    res.status(400).send('No comments releated to this movie');
                } else {
                    res.send(doc);
                }
            }).catch((e) => {
                res.status(400).send(e);
            })
        ).catch((e) => {
            res.status(404).send('Movie does not exist');
        })
    }

});







app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});


module.exports = {app};

