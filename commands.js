'use strict'

commands = {
  help: [
    "description" : "Show this list of all commands",
    "func"        : function(){
      var output;
      for (var key in commands) {
        if (commands.hasOwnProperty(key)) {
          output += String(key) + " - " + commands[key].description + "\n";
        }
      }
      return output;
    }],
};

module.exports = commands;
