const expect =require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Movie} = require('./../models/movie');
const {Comment} = require('./../models/comment');
const {movies, populateMovies, populateComments} = require('./seed/seed');

beforeEach(populateMovies);
beforeEach(populateComments);

describe('POST /movies', () =>  {
    it('should fetch movie data and save it in db', (done) => {
        let movieTitle = "Predator";
        request(app)
            .post('/movies')
            .send({"title": movieTitle})
            .expect(200)
            .expect((res) => {
                expect(res.body.body.Title).toBe(movieTitle);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Movie.find({"body.Title": movieTitle}).then((movies) => {
                    expect(movies.length).toBe(1);
                    expect(movies[0].body.Title).toBe(movieTitle);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should reject if title is wrong', (done) => {
        let movieTitle = 'asdfg123';
        request(app)
            .post('/movies')
            .send({"title": movieTitle})
            .expect(404)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Movie.find().then((movies) => {
                    expect(movies.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            })
    });
});

describe('POST /comments', () => {
    it('should save comment in a database', (done) => {
        let text = "Test";

        request(app)
            .post('/comments')
            .send({text, _movieId: movies[0]._id})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
                expect(res.body.movieTitle).toBe(movies[0].body.Title);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Comment.find({text}).then((comments) => {
                    expect(comments.length).toBe(1);
                    expect(comments[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            })
    });

    it('Should reject wrong movie id', (done) => {
        request(app)
            .post('/comments')
            .send({text: 'Fail', _movieId: '123'})
            .expect(404)
            .expect((res) => {
                expect(res.text).toBe('Invalid movie id');
            })
            .end(done);
    });
});

describe('GET /movies', () => {
    it('should get all movies from database', (done) => {
        request(app)
            .get('/movies')
            .expect(200)
            .expect((res) => {
                expect(res.body.movies.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /movies/:filter', () => {
    it('should get movies filtered properly', (done) => {
        let filter = 'year+desc';
        request(app)
            .get(`/movies/${filter}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.movies[0].body.Year).toBe(2);
            })
            .end(done);
    });

    it('should not pass an invalid filter', (done) => {
        let filter = 'inva+lid';
        request(app)
            .get(`/movies/${filter}`)
            .expect(404)
            .end(done);
    });
});

describe('GET /comments', () => {
    it('Should get all comments', (done) => {
        request(app)
            .get('/comments')
            .expect(200)
            .expect((res) => {
                expect(res.body.comments.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /comments/:id', () => {
    it('Should get all comments related to a specified movie', (done) => {
        request(app)
            .get(`/comments/${movies[0]._id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.length).toBe(1);
            })
            .end(done);
    });

    it('Should fail if id is invalid or movie does not exist', (done) => {
        request(app)
            .get('/comments/fakeid')
            .expect(404)
            .end(done);
    });
});
