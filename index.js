'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const MongoClient = require('mongodb').MongoClient;
const parse = require('./parse');
const app = express();

const mongo_uri = process.env.MONGODB_URI;
const fb_token = process.env.FB_PAGE_ACCESS_TOKEN;

app.set('port', (process.env.PORT || 5000));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// Process application/json
app.use(bodyParser.json());

// Index route
app.get('/', function (req, res) {
  res.send('Hello world, I am a chat bot');
});

// for Facebook verification
app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
    res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong token')
});

app.post('/webhook/', function (req, res) {
  let messaging_events = req.body.entry[0].messaging;

  //Sometimes messages are batched, so we handle each one individually
  for (let i = 0; i < messaging_events.length; i++) {
    let event = req.body.entry[0].messaging[i];
    let sender = event.sender.id;

    //Check if there exists a player for this person already, if not then ignore what they say and create a new one
    MongoClient.connect(mongo_uri, function(err, db) {
      if (err) {
        console.log('Could not connect to the database. Error: ' + err);
        return;
      }
      let playersCol = db.collection('players');

      //Try and find player
      playersCol.find({'fb_id': sender}).limit(1).next(function(err, player){
        //If there exists a player, we process their command
        if (player) {

          //Make sure it's a text message
          if (event.message && event.message.text) {
            let text = event.message.text;

            //Tokenise the input
            let tokens = parse.tokenise(text);

            //Map input to a command function
            let proc = parse.getCommandProc(tokens[0]);

            //Execute command proc with player and target passed in
            let responseText = proc(player, { name: tokens[1] }, db);

            //Send the response to the player
            sendTextMessage(sender, responseText);
            console.log("To %s: %s", sender, responseText);
          }
          db.close();
        }
        else {
          //TODO: Make a fancier player creation screen
          let player = {
            'fb_id': sender
          };
          playersCol.insert(player, function (err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log('Inserted new player %d into database', sender);
              sendTextMessage(sender, "You haven't played before, so a new character has been created! Try sending your command again");
            }
            db.close();
          });
        }
      });
    });
  }
  res.sendStatus(200);
});

function sendTextMessage(sender, text) {
  let messageData = { text:text };
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:fb_token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending messages: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

// Spin up the server
app.listen(app.get('port'), function() {
  console.log('running on port', app.get('port'));
});
