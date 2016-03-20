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
var radioArray = [];
var playCount = 8;
var nextVote = 0;
var songName;
var songArtist;

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

bot.on("ready", function() {
    console.log("Ready to begin playing slick beats!");
    //bot.setPlayingGame("some slick beats!");
    bot.joinVoiceChannel(serverDetails.voicechannel);
    
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

    fs.readdir("./songs/radio", function(err, dirContents) {
        for (var i = 0; i < dirContents.length; i++) {
            for (var o = 0; o < ext.length; o++) {
                if (path.extname(dirContents[i]) === ext[o]) {
                    radioArray.push(dirContents[i]);
                    console.log("Adding radio " + dirContents[i]);
                }
            }
        }
    });

    setInterval(function() {
         if (bot.voiceConnection.playing === false) {
            if (playCount === 8) {
                console.log("Play count is 8, play radio track");

                var random = randInt(1, radioArray.length);
                var connection = bot.voiceConnection;
                
                console.log("Playing radio track " + random);

                connection.playFile("./songs/radio/" + random + ".mp3", {"volume": 1});

                bot.setPlayingGame("some slick beats!");

                songTitle = "SlickBeats";
                songArtist = "SlickBeats";

                playCount = 0;
            }
            else {
                console.log("Playing is false");

                var random = randInt(1, songArray.length);
                console.log("Random number is " + random);

                var connection = bot.voiceConnection;

                //connection.stopPlaying();
                connection.playFile("./songs/" + random + ".mp3", {"volume": 1});
                
                id3js({file: "./songs/" + random + ".mp3", type: id3js.OPEN_LOCAL}, function(err, tags) {
                    songTitle = tags.title;
                    songArtist = tags.artist;
                    bot.setPlayingGame(tags.title);
                    console.log("Playing " + tags.title);
                });

                playCount++;
            }
        }
    }, 500)
});

bot.on("message", function(msg) {
    if (msg.sender != bot.sender && bot.voiceConnection.playing === true) {
        if (msg.content == ">>>next") {
            if (msg.sender.voiceChannel === bot.voiceConnection.voiceChannel) {
                var voiceUsers = bot.voiceConnection.voiceChannel.members.length;
                if (nextVote >= Math.floor(voiceUsers / 2)) {
                    bot.sendMessage(msg.channel, "Skipping this song!");
                    bot.voiceConnection.stopPlaying();
                    nextVote = 0;
                }
                else {
                    nextVote++;
                    if (nextVote >= Math.floor(voiceUsers / 2)) {
                        bot.sendMessage(msg.channel, "Skipping this song!");
                        bot.voiceConnection.stopPlaying();
                        nextVote = 0;
                    }
                    else {
                        bot.sendMessage(msg.channel, "Voted to skip! " + nextVote + "/" + Math.floor(voiceUsers / 2) + " votes so far!");
                    }
                }
            }
            else {
                bot.sendMessage(msg.channel, "You must be in my voice channel to vote to skip!");
            }
        }
        else if (msg.content == ">>>status") {
            bot.sendMessage(msg.channel, "I am currently playing " + songArtist + " - " + songTitle + "!");
        }
    }
    else {
        bot.sendMessage(msg.channel, "You can't use commands if I'm not playing anything!");
    }
});

bot.login(authDetails.username, authDetails.password);
