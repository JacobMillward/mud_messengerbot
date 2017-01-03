'use strict'

var commands = [
  {
    name: "help",
    usage: "help",
    description: "Show this list of all possible commands",
    proc: function(player, targets){
      let output = "";
      var arrayLength = commands.length;
      for(var i = 0; i < arrayLength; i++) {
        output +=`${commands[i].name} - ${commands[i].description}\nUsage: ${commands[i].usage}\n\n`;
      }
      return output.trim();
    }
  },
  {
    name: "test",
    usage: "test param_1 ... param_n",
    description: "Prints out a list of all passed in arguments",
    proc: function(player, targets) {
      let response = "";
      for (var i=0; i < targets.length; i++) {
        response += targets[i] + "\n";
      }
      return response;
    }
  }
];


module.exports = commands;
