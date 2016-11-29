var analyze = require("./logAnalyser.js");
var fs = require('fs');
var path = require('path');

var matchParticipantFolder = function(item) {
  return path.extname(item) == "" && /^[0-9]/.test(item);
}

var matchTxtFile = function(item) {
  return path.extname(item) == '.txt';
}

// returns all items in folder 'inFolder' that match 'matchFunction'
var allMatchingItems = function(inFolder, matchFunction) {
  var items = fs.readdirSync(inFolder)
  items = items.filter(matchFunction);
  return items;
}

var getTest = function(testNumber) {
  switch (testNumber) {
    case '2':
      return 'compontentTest'
      break;
    case '3':
      return 'speedTest-1'
      break;
    case '4':
      return 'speedTest-2'
      break;
    case '5':
      return 'speedTest-3'
      break;
    default:
      return undefined;
      break;
  }
}

var summarizeLogs = function() {
  var summary = {};
  var participantFolders = allMatchingItems('.', matchParticipantFolder);
  participantFolders.forEach(function(participantFolder) {
    var participant = participantFolder.split('-')[1];
    var participantSummary = {};
    var txtFiles = allMatchingItems(participantFolder, matchTxtFile);
    // first log was for qualitative analysis, therefore remove it
    txtFiles = txtFiles.filter(function(file) {
      return !/-1.txt$/.test(file);
    });
    txtFiles.forEach(function(txtFile) {
      var testKindOf = getTest(txtFile.split('-')[2].split('.')[0]);
      var fileContent = fs.readFileSync(path.join(participantFolder, txtFile), 'utf8');
      var logAnalysis = analyze(fileContent);
      participantSummary[testKindOf] = logAnalysis;
    });
    summary[participant] = participantSummary;
  });
  console.log(JSON.stringify(summary));
  return summary;
}

summarizeLogs();