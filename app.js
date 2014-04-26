var express = require('express'),
    routes = require('./routes'),
    path = require('path'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Types.ObjectId;

mongoose.connect('mongodb://localhost:27017/slacker');

var VotersSchema = new Schema({
			name: String,
			ip: String,
			voted_for: Number	
})

var ChoicesSchema = new Schema({
			text: String,
			votes: Number,
			voters: [VotersSchema]
		});

var	PollSchema = new Schema({
			question: String,
			choices: [ChoicesSchema],
			created: Date,
			expires: Date
		});

var Poll = mongoose.model('Poll', PollSchema);

var app = express();
app.directory = __dirname;

require('./config/environments')(app);
require('./routes')(app);

app.get('/polls', routes.polls);

app.get('/polls/:pollID', routes.poll);

app.post('/polls/new', routes.create);

app.put('/polls/vote', routes.vote)

module.exports = app;

