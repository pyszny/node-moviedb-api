const request = require('request');

let movieReq = (title, callback) => {
   request({
       url: `http://www.omdbapi.com/?apikey=24d42685&t=${title}`,
       json: true
   }, (error, response, body) => {
       if (body.Response === "False") {
           callback('Unable to find movie', false);
       } else if(!error && response.statusCode === 200) {
           callback(undefined, {
               body
           });
       } else {
           callback('Unable to fetch movie', false);
       }
   });
};

module.exports.movieReq = movieReq;