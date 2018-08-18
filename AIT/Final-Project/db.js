/*db.js*/
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// MAKE SCHEMAS HERE

const UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	reviews: Array,
	highScore: Number
});

const ReviewSchema = new mongoose.Schema({
	description: String,
	value: Number
});

const ScoreSchema = new mongoose.Schema({
	userID: String,
	mode: String,
	score: Number
});


//plug-in for passport
UserSchema.plugin(passportLocalMongoose);

//register models

mongoose.model('User', UserSchema);
mongoose.model('Review', ReviewSchema);
mongoose.model('Score', ScoreSchema);


// is the environment variable, NODE_ENV, set to PRODUCTION? 
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/sep445';
}

mongoose.connect(dbconf);
