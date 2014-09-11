var readline = require('readline');
var util = require('util');
var async = require('async');
var MongoClient = require('mongo').MongoClient;

function exitError = function(err) {
  console.error("Process encountered error: " + err);
  process.exit(1);
}

var setupTasks = {
  database: function(callback) {
    var db = require('conf.json').db;
    MongoClient.connect(util.format("mongodb://%s:%s/%s"), 
                        db.host, db.port, db.database), function(err, database) {
      if (err) {
        return callback(err);
      }

      if (!database) {
        return callback(new Error("Database failed to initialize");
      }

      callback(null, database);
    });
  },
  lineReader: function(callback) {
    callback(null, readline.createInterface(process.stdin, process.stdout));
  }
};

function handleCommandsListState = function(line) {
    switch(line.trim().toLowerCase()) {
      case "read":
        var state = READ;
        break;
      case "write":
        var state = WRITE;
        break;
      default: 
        console.log("I did not recognize that command.");
        break;
    }
}

async.parallel(setupTasks, function(err, results) {
  if (err) {
    return exitError(err);
  }
  var promptStream = 
    ["What would you like to do?",
     "You can:",
     "1. Take notes (command: write)",
     "2. Review notes (command: read)",
     "NOTASTIC"]; 
  // State variable
  var COMMANDS_LIST = 0, WRITE = 1, READ = 2;

  // Initial state is ready to read lines
  var state = COMMANDS_LIST;

  var database = results.database;
  var rl = results.lineReader;
  rl.setPrompt(promptStream.join("\n"));

  rl.on('line', function(line) {
    var processedLine = line.trim().toLowerCase();
    rl.prompt();
    switch(state) {
      case COMMANDS_LIST:
        handleCommandsListState(processedLine);
        break;
      case WRITE:
        handleWriteState(processedLine);
        break;
      case READ:
        handleReadState(processedLine);
        break;
      default:
        return exitError(new Error("Unrecognized state"));
    }
  }
}).on('close', funtion() {
  console.log("I expect an A+");
  process.exit(0);
});