// Require our dependencies
const express = require("express");
const twitter = require('twitter'),
const axios = require('axios')
// Create an express instance and set a port variable
const app = express();
const port = process.env.PORT || 8080;
const bodyParser = require("body-parser");
var cors = require("cors");

const twitterCredentials = {
    access_token_key: process.env.REACT_APP_TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.REACT_APP_TWITTER_ACCESS_TOKEN_SECRET,
    consumer_key: process.env.REACT_APP_TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.REACT_APP_TWITTER_CONSUMER_SECRET,
  }

// Create a new ntwitter instance
var twitterClient = new twitter(twitterCredentials);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors)
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  app.get("/get_likes", async (req, res) => {
    let likingUsersIDs = [];
    const policy_data = await axios.post("https://api.twitter.com/2/tweets/:"+req.query.tweetID+"/liking_users");
    var users = response.data;
    for(let i = 0; i<users.length; i++) {
      likingUsersIDs.push(users[i].id);
    }
    var likesJson = JSON.stringify(likingUsersIDs);

    res.json(likesJson)
  })

  app.listen(3000, function () {
    console.log("listening on 3000");
  });