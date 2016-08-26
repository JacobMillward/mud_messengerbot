'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const parse = require('./parse')
const app = express();

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
        //If it's a text message we process it and respond
        if (event.message && event.message.text) {
            let text = event.message.text;
            let tokens = parse.tokenise(text);
            //Returns the proc function we need to call (or a default)
            let proc = parse.getCommandProc(tokens[0].toLowerCase());
            let responseText = proc(tokens);
            //Send the response to the sender
            sendTextMessage(sender, responseText);
        }
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
