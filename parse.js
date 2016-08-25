'use strict'

var commands = require('./commands');

exports.tokenise = function(string) {
  return string.match(/\S+/g);
}

exports.getCommandProc = function(string) {
  var cmdArray = commands.filter(function(obj) {
    return obj.name == string;
  });
  if (cmdArray === undefined || cmdArray.length == 0) {
    var proc = function(args) {
      return args[0] + ": command does not exist"
    }
  }
  else {
    var proc = cmdArray[0]['proc'];
  }
  return proc;
}
