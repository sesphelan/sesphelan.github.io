const express = require('express');
const mongoose = require('mongoose');
require('./db');
const session = require('express-session');
const path = require('path');

const User = mongoose.model("User");
const Review = mongoose.model("Review");
const Score = mongoose.model("Score");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express(); //create APP

app.set('view engine', 'hbs'); //enable hbs

//basic configurations
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'add session secret here!',
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) =>{
	if(req.session.difficulty === undefined){ //DEFAULT DIFFICULTY EASY
		res.locals.difficulty = "Easy";
	}
	else{
		res.locals.difficulty = req.session.difficulty; //OTHERWISE SET BASED ON PREFERENCE
	}
	next();
});

app.use((req, res, next) => { // SET LOCALS USER
	res.locals.user = req.session.user;
	next();
});


//Home page
app.get('/', (req, res) => {
	const a = {};
	if(req.query.difficulty !== undefined && req.query.difficulty !== ""){
		a.mode = req.query.difficulty;
	}
	Score.find(a, function(err, data){

		// BASIC BUBBLE SORT TO SORT SCORES FROM GREATEST TO LEAST
			// INFLUENCED BY TUTORIAL AT BENOITVALLON.COM
		if(data.length > 1){
			for(let i = 0; i < data.length; i++) {
				for(let j = 1; j < data.length; j++) {
					if(data[j - 1].score < data[j].score) {
						const tmp = data[j-1];
						data[j-1] = data[j];
						data[j] = tmp;
					}
				}
			}
		}
		if(req.session.difficulty !== undefined){
			res.render('index', {difficulty: req.session.difficulty, scores: data});
		}
		else{
			res.render('index', {difficulty: "Easy", scores: data});
		}
	});
});

app.get('/register', (req, res) => {
	res.render('register');
});

//help of tutorial site passportjs.orgs
app.post('/register', (req, res) => {
	User.register(new User({ username: req.body.username, highScore: 0 }), req.body.password, function(err, user){
		if(err){
			res.render('register', {message: 'ERROR IN CREATING ACCOUNT'});
		}
		else{
			passport.authenticate('local')(req, res, function() {
				req.session.regenerate((err) => {
					if(!err){
						req.session.user = user;
						res.redirect('/');
					}
				});
			});
		}
	});
});

app.get('/login', (req, res) => {
	res.render('login');
});

//help of tutorial site: djamware.com
app.post('/login', function(req, res, next){ 
	passport.authenticate('local', function(err, user){
		if(!user){
			res.render('login', {message: "Error processing Login request"});
		}
		else{
			req.session.regenerate((err) => {
				if(!err){
					req.session.user = user;
					res.redirect('/');
				}
			});
		}
	})(req, res, next);
});

app.get('/reviews', (req, res) => {
	const a = {};
	if(req.query.dropdown !== "" && req.query.dropdown !== undefined){
		a.value = parseInt(req.query.dropdown);
	}
	Review.find(a, function(err, data){
		if(data === null){
			res.send('404 CANNOT RETRIEVE');
		}
		else{
			res.render('reviews', {reviews: data});
		}
	});
});

app.get('/reviews/add', (req, res) => {
	if(req.session.user){
		res.render('review-add');
	}
	else{
		res.redirect('/login');
	}
});

app.post('/reviews/add', (req, res) => {
	new Review({
		description: req.body.description,
		value: req.body.dropdown
	}).save(function(err, review){
		if(err){
			res.render('review-add', {message: "ERROR UPLOADING REVIEW"});
		}
		else{
			const a = {username: req.session.user.username};
			User.findOne(a, function(err, user){
				user.reviews.push(review);
				user.save(function(){
					res.redirect('/reviews');
				});
			});
		}
	});
});

app.get('/logout', (req, res) => {
	req.session.destroy();
	res.redirect('/');
});

app.post('/send', (req, res) => {
	if(req.session.user){ // ONLY SAVE SCORE IF LOGGED IN
		User.findOne({'username': req.session.user.username}, function(err, data){
			if(data.highScore < parseInt(req.body.score)){ // IF NEW HIGH SCOREE
				data.highScore = parseInt(req.body.score);
				data.save(function(){
					Score.findOne({'userID': req.session.user.username}, function(error, score){
						if(score){
							score.mode = req.body.mode;
							score.score = parseInt(req.body.score);
							score.save(function(){
								res.redirect('/');
							});
						}
						else{
							new Score({
								userID: req.session.user.username,
								mode: req.body.mode,
								score: parseInt(req.body.score)
							}).save(function(){
								res.redirect('/');
							});
						}
					});
				});
			}
		});
	}
});

// HANDLE 404 PAGE
app.use((req, res) => {
	res.render('error');
});

app.listen(process.env.PORT || 3000); //listen on port 3000