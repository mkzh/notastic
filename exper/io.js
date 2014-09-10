var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('OHAI> ');
rl.prompt();

rl.on('line', function(line) {
  switch(line.trim()) {
    case "Hello":
          console.log('World!');
          break;
    default:
          console.log("Say what? I might ahve heard '" + line.trim() + "'");
          break;
  }

  rl.prompt();
}).on('close', function() {
  console.log("I expect an A+");
  process.exit(0);
});
