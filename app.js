var express = require('express'),
    routes = require('./routes'),
    path = require('path'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Types.ObjectId;

mongoose.connect('mongodb://localhost:27017/slacker');

var app = express();
app.directory = __dirname;

require('./config/environments')(app);
require('./routes')(app);

app.use(express.static(__dirname + '/app'));




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

/***
*
*	Init server
*
***/
var server = require('http').createServer(app).listen(app.get('port'), function () {
    console.log('Express (' + app.get('env') + ') server listening on port ' + app.get('port'));
});

/***
*
*	Init Socket IO
*
***/
var io = require('socket.io').listen(server);


io.sockets.on('connection', function(socket){

	app.get('/polls', function(req, res){

		Poll.find()
			.sort({"created": -1})
			.exec( function(err, data){
				if(err) console.log(new Error(err));

				res.send(data);
		})
	})

	app.get('/polls/:pollID', function(req, res){

		var pollID = req.params.pollID !== undefined ? new ObjectId(req.params.pollID) : "";

		Poll.findOne({"_id": pollID})
			.sort({"created": -1})
			.exec( function(err, data){
				if(err) console.log(new Error(err));

				res.send(data);
		})
	})

	app.post('/polls/new', function(req, res){
		console.log(req.body);
		Poll.create(req.body, function(err){
			if(err) console.log(new Error(err));
			res.send("Done");
		})
	})

	app.put('/polls/vote', function(req, res){

		var pollID = req.body.pollID,
				choiceID = req.body.choiceID,
				IP = req.ip;

		var voter = {
			"ip": IP,
			"voted_for": choiceID
		};

		Poll.findOneAndUpdate(
			{"_id": pollID, "choices._id": choiceID}
		, { 
				$inc: { 'choices.$.votes': 1 }, 
				$push: { 'choices.$.voters': voter } 
			}, function(err, data){
			
			if(err) console.log(new Error(err));
			
			//res.json(data);
			socket.emit('vote', {result: data});
		})
	})
})
//module.exports = app;

