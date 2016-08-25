'use strict'

var commands = [
  {
    name: "help",
    description: "Show this list of all possible commands",
    proc: function(args){
      let output = "";
      var arrayLength = commands.length;
      for(var i = 0; i < arrayLength; i++) {
        output += commands[i].name + " - " + commands[i].description + "\n";
      }
      return output;
    }
  },
  {
    name: "test-printargs",
    description: "Prints out a list of all passed in arguments",
    proc: function(args) {
      let output = "";
      var arrayLength = args.length;
      for (var i = 0; i < arrayLength; i++) {
          output += String(args[i]) + "\n";
      }
      return output;
    }
  }
];


module.exports = commands;
