# Snake: The Game

## Overview

Need a break from work? Well....ssslither into Snake: The Game for a fun, relaxed, and ridiculuously easy-to-learn game fit
for all ages. Whether you're an experienced gamer or brand new, we offer three modes of difficulty fit to your abilities.

With Snake: The Game you can feel free to play independently or to compete with others through our high stakes leaderboards.
Have any recommendations? Snake welcomes all questions/reviews/comments you have to offer through our Reviews board. Peruse high scores,
interact with fellow gamers, or play for hours on end all at Snake: The Game!

## Data Model

The application will store Users, Scores, and Reviews

* Users can post however many reviews as they want
* Reviews are made up of a text description and a numerical score from 1-5 of the site
* A Reviews array is embedded in the User schema
* Scores are numerical and store the level of difficulty played on, as well as a User ID
* Scores are related to Users through the store of a UserID

An Example User:

```javascript
{
  username: "SnakeMan4",
  password: // a password hash,
  reviews: // an array of all Reviews posted by the User,
  highScore: 95 // numerical value of highest score
}
```

An Example Review:

```javascript
{
  description: "I spent waaaaayyyy too long on this game",
  value: 4
}
```

An Example Score:

```javascript
{
  userID: //user objectID,
  mode: easy,
  score: 95
}
```

## [Link to Commented First Draft Schema](src/db.js) 

## Wireframes

/ - Home page where actual game is rendered (when not logged in)

![Home page](documentation/home_logged_out.jpg)

/ - Home page when logged in - can vary difficulty using form

![Home page - logged in](documentation/home_logged_in.jpg)

/reviews - Page that shows all reviews of site - can filter by rating value

![reviews](documentation/reviews.jpg)

/reviews/add - Page to add a review (if logged in only)

![add a review](documentation/add-review.jpg)

/login - Page to login

![login](documentation/login.jpg)

/register - Page to register

![login](documentation/register.jpg)

## Site map

Note: Whether logged-in, or not, the actual game can be played. If a User is not logged in, however,
their score data will be not be recorded in the "High Scores" table (or anywhere else, for that matter).
Additionally, they will not be allowed to add a review of the site, only view other Users' reviews.

![Snake: The Game site map](documentation/site-map.jpg)

## User Stories or Use Cases

1. as a non-registered user, I can register for an account
2. as a non-registered user, I can view all reviews of the site
3. as a non-registered user, I can play the game, but not record my score in the leaderboards
4. as a non-registered user, I can view the high scores of all registered users
5. as a registered user, I can add a review of the site
6. as a registered user, I can log into the site
7. as a registered user, I can play the game
8. as a registered user, I can record my high score in the leaderboards
9. as a registered user, I can also view all other reviews of the site
10. as a registered user, I can view the high scores of all other users

## Research Topics

* (3 points) Integrate user authentification
    * I'm going to incorporate Passport.js for implementation
    * Passport.js: easy-to-incorporate middleware that can be dropped into my express app
    * Will improve the security of my site, ensuring access to some areas for logged-in users
* (5 points) Incorporate automated functional testing for all of my routes
    * I'm going to use Headless Chrome and Puppeteer for headless broswer testing
    * Headless browser testing - running broswer UI tests without any UI or GUI of any sort
    * Tests will validate legimitimacy of site map
    * Great for quick and automated testing when I don't need an actual UI shell
    * Passing of tests will be validated by Mocha Tests
* (3 points) Integrate unit testing
    * Testing smallest parts of application for functionality / effectiveness
    * Ensures methods for the Snake game will work correctly in all cases
    * Will use Mocha to create tests

11 points total out of 8 required points


## [Link to Initial Main Project File](src/app.js) 

Note: Each possible route will render a webpage, but the game itself has not yet been coded, as well as the authentification using Passport.

## Annotations / References Used

1. [passport.js authentication docs](https://blog.risingstack.com/node-hero-node-js-authentication-passport-js/)
2. [using puppeter with chrome and mocha](https://medium.com/@ankit_m/ui-testing-with-puppeteer-and-mocha-part-1-getting-started-b141b2f9e21)
3. [coding a game with canvas tutorial](http://www.competa.com/blog/how-to-build-a-snake-game-using-javascript-and-html5-canvas/)