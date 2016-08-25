'use strict'

commands = require('./commands');

exports.tokenise = function(string) {
  return string.match(/\S+/g);
}

exports.getCommandFunction = function(string) {
  return commands[string]['func'];
}
