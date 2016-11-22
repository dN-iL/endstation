var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://192.168.0.2:1883');
var fs = require('fs');
var path;
var writeStream;
var name = process.argv[2];

var currentScreen = "";
var currentId = "";
var lastTimestamp = "";

client.on('connect', function() {
  console.log('connected');
  client.subscribe('logs');
  console.log('subscribed to topic logs');
  var timestamp = Math.floor(Date.now() / 1000);
  path = 'logfiles/log-' + name + '.txt';
  writeStream = fs.createWriteStream(path);
  console.log('writing to ' + path);
});

client.on('message', function(topic, message) {
  var jsonMessage = JSON.parse(message);
  var output = buildDescriptionObj(jsonMessage.description, jsonMessage.event, jsonMessage.timestamp);
  console.log(output);
  console.log('\n');
  var inFile = "";
  for(var prop in output) {
    if(output.hasOwnProperty(prop)) {
      inFile += output[prop] + ',';
    }
  }
  writeToLog(inFile.slice(0,-1)+'\n');
});

var buildDescriptionObj = function(description, event, timestamp) {
  var titles = [];
  var content = description.split("##");
  switch(event) {
    case "retreat":
      titles = ["ParticipantID"];
      break;
    case "segue":
      titles = ["From", "FromID", "To", "ToID", "Via"];
      break;
    case "viewUpdate":
      titles = ["Change", "ForID", "Widget"];
      break;
    case "startScenarioBlock":
    case "endScenarioBlock":
      titles = ["ScenarioBlock"]
      break;
  }
  var returnObj = {"Timestamp": timestamp, "Event": event};
  if(titles.length !== content.length) {
    console.log("SOMETHING WENT WRONG WHEN BUILDING THE MESSAGE!");
    return
  }
  for(var i=0; i<titles.length; i++) {
    returnObj[titles[i]] = content[i];
  }
  return returnObj;
}


var writeToLog = function(text) {
  writeStream.write(text);
}

var endLog = function(text) {
  writeStream.end(text);
}
