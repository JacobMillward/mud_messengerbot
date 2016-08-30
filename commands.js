'use strict'

var commands = [
  {
    name: "help",
    description: "Show this list of all possible commands",
    proc: function(player, target){
      let output = "";
      var arrayLength = commands.length;
      for(var i = 0; i < arrayLength; i++) {
        output += commands[i].name + " - " + commands[i].description + "\n";
      }
      return output;
    }
  },
  {
    name: "test-cmd",
    description: "Prints out a list of all passed in arguments",
    proc: function(player, target) {
      return JSON.stringify(player) + "\n" + JSON.stringify(target);
    }
  }
];


module.exports = commands;
