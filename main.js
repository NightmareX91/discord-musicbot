try {
    var discord = require("discord.js");
}
catch (e) {
    console.log("Please run npm install and ensure it passes with no errors!");
    process.exit();
}

try {
    var id3js = require("id3js");
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
var fs = require("fs");
var path = require("path");
var ext = [".mp3"];
var songArray = [];
var connected = false;

bot.on("ready", function() {
    console.log("Ready to begin playing slick beats!");
    //bot.setPlayingGame("some slick beats!");
    bot.joinVoiceChannel(serverDetails.voicechannel, function(err) {
        connected = true
    });
    
    fs.readdir("./songs", function(err, dirContents) {
        for (var i = 0; i < dirContents.length; i++) {
            for (var o = 0; o < ext.length; o++) {
                if (path.extname(dirContents[i]) === ext[o]) {
                    songArray.push(dirContents[i]);
                    console.log("Adding " + dirContents[i]);
                }
            }
        }
    });

    setInterval(function() {
         if (bot.voiceConnection.playing === false) {
            console.log("Playing is false");

            var random = Math.floor(Math.random() * ((songArray.length - 1 + 1) - 1));
            console.log("Random number is " + random);

            var connection = bot.voiceConnection;

            //connection.stopPlaying();
            connection.playFile("./songs/" + random + ".mp3", {"volume": 1});
                
            id3js({file: "./songs/" + random + ".mp3", type: id3js.OPEN_LOCAL}, function(err, tags) {
                bot.setPlayingGame(tags.title);
                console.log("Playing " + tags.title);
            });
        }
    }, 500)
});

bot.on("message", function(msg) {
    //while(bot.voiceConnection) {
       
    //}
});

bot.login(authDetails.username, authDetails.password);
