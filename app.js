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

/*var knownVoters = 
	{
		"name": "dan",
		"ip": "192.168.32.24"
	},
	{
		"name":"martin",
		"ip":"192.168.32.227"
	}
};
*/
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

	// Check if IP has already been pushed to poll's voter list
	/*/
	Poll.findOne({"_id": pollID, "choices.voters.ip": { $in: [IP] } },
		function(err, data){
			if(err) console.log(new Error(err));
			console.log(data);
		}
	);
	//*/

	// need a map of IPs to names, then can populate queries properly 

	var voter = {
		"name": "dan",
		"ip": IP,
		"voted_for": choiceID
	};

	Poll.findOneAndUpdate({"_id": pollID, "choices._id": choiceID}, { $inc: { 'choices.$.votes': 1 }, $push: { 'choices.$.voters': voter }}, function(err, data){
		
		if(err) console.log(new Error(err));
		
		res.send("Done");
	})
})

module.exports = app;

