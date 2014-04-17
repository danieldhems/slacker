module.exports = function (app) {
    app.get('/', function (req, res, next) {
        res.render('index');
    });

    this.polls = function(req, res){
			Poll.find()
				.sort({"created": -1})
				.exec( function(err, data){
					if(err) console.log(new Error(err));

					res.send(data);
			})
		}

		this.poll = function(req, res){

			var pollID = req.params.pollID !== undefined ? new ObjectId(req.params.pollID) : "";

			Poll.findOne({"_id": pollID})
				.sort({"created": -1})
				.exec( function(err, data){
					if(err) console.log(new Error(err));

					res.send(data);
			})
		}

		this.create = function(req, res){
			Poll.create(req.body, function(err){
				if(err) console.log(new Error(err));
				res.send("Done");
			})
		}

		this.vote = function(req, res){

			var pollID = req.body.pollID,
					choiceID = req.body.choiceID,
					IP = req.ip;

			// Collect vote info for insertion
			var voter = {
				"ip": IP,
				"voted_for": choiceID
			}

			Poll.findOneAndUpdate(
				{"_id": pollID, "choices._id": choiceID}
			, { 
					$inc: { 'choices.$.votes': 1 }, 
					$push: { 'choices.$.voters': voter } 
				}, function(err, data){
				
				if(err) console.log(new Error(err));
				
				res.json(data);
			})
		}
};
