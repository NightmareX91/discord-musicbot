try {
    var discord = require("discord.js");
}
catch (e) {
    console.log("Please run npm install and ensure it passes with no errors!");
    process.exit();
}

try {
    var authDetails = require("./auth.json");
}
catch (e) {
    console.log("Please create an auth.json file using the auth.json.example file from the github repository!");
    process.exit();
}

try {
    var serverDetails = require("./server.json");
}
catch (e) {
    console.log("Please create a server.json file using the server.json.example file from the github repository!");
    process.exit();
}

var bot = new discord.Client();

bot.on("ready", function() {
    console.log("Ready to begin playing slick beats!");
})

bot.login(authDetails.username, authDetails.password);
