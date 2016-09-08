'use strict'

var commands = require('./commands');

exports.tokenise = function(string) {
  return string.toLowerCase().match(/\S+/g);
}

exports.getCommandProc = function(commandName) {
  var cmdArray = commands.filter(function(obj) {
    return obj.name == commandName;
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
