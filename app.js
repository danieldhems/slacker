var express = require('express'),
    routes = require('./routes/index'),
    path = require('path'),
    mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/slacker');

var app = express();

app.directory = __dirname;

app.use(express.logger('dev'));
app.use(express.static(path.join(__dirname, 'app')));
app.use(app.router);

require('./config/environments')(app);

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
}

app.get('/polls', routes.polls);

app.get('/polls/:pollID', routes.poll);

app.post('/polls/new', routes.create);

app.put('/polls/vote', routes.vote)

app.get('/', function (req, res, next) {
    res.sendfile('app/index.html');
});

module.exports = app;

