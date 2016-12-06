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
      return 'componentTest'
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

// looks in all participant folder for all log files, analyses them and returns the whole analysis in an array
var summarizeLogs = function() {
  var summary = [];
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
    summary.push(participantSummary);
  });
  return summary;
}

var findIndexForBlock = function(blockName, test) {
  var index;
  switch (blockName) {
    case 'stdCE':
      index = 1;
      break;
    case 'coreTempPeak':
      index = 2;
      break;
    case 'importantVsUnimportant':
      index = 3;
      break;
    case 'noConnection':
      index = 4;
      break;
    default:
      index = -1;
  }
  return index;
}

// transforms one test of one person to csvJson
var transformOneTestToCsvJson = function(testName, personNumber, personSummary) {
  var person = 'person-' + personNumber;
  var test = personSummary[testName];
  var forCsv = [];
  var skippedBlocks = test[test.length-1]['skipped'];
  var blocksSkipped = skippedBlocks > 0;
  if(blocksSkipped) {
    skippedBlocks.forEach(function(skippedBlock) {
      var additionToTest = {'type': skippedBlock, 'skipped': true};
      test.splice(findIndexForBlock(skippedBlock), 0, additionToTest);
    });
  }
  var boundary = test.length - 3;
  for(var i=0; i<test.length; i++) {
    if(i<boundary) {
      var scenarioBlock = test[i];
      scenarioBlock['person'] = person;
      scenarioBlock['test'] = testName;
      forCsv.push(scenarioBlock);
    } else if(i==boundary) {
      var testRetreats = test[i]['retreats'];
      var rightRetreats = testRetreats[0];
      var wrongRetreats = testRetreats[1];
      var duplicateRetreats = testRetreats[2];
      forCsv.push({'person': person, 'test': testName, 'type': 'retreatCounts', 'rightRetreats': rightRetreats, 'wrongRetreats': wrongRetreats, 'duplicateRetreats': duplicateRetreats});
    } else if(i==boundary+1) {
      var testClicks = test[i]['clicks'];
      var clicksOnTableView = testClicks[0];
      var clicksOnCeList = testClicks[1];
      var clicksOnStatusWidget = testClicks[2];
      var clicksOnAnotherGraph = testClicks[3];
      var clicksOverall = testClicks[4];
      forCsv.push({'person': person, 'test': testName, 'type': 'segueCounts', 'clicksOnTableView': clicksOnTableView, 'clicksOnCeList': clicksOnCeList, 'clicksOnStatusWidget': clicksOnStatusWidget, 'clicksOnAnotherGraph': clicksOnAnotherGraph, 'clicksOverall': clicksOverall});
    }
    // to do: handle skipped!
  }
  return forCsv;
}

// transforms the analysis in a csv compatible json object that can easily be converted
var transformToCsvJson = function() {
  var csv = [];
  var summary = summarizeLogs();
  var forCsv = [];
  summary.forEach(function(personSummary, index) {
    forCsv.push(transformOneTestToCsvJson('componentTest', index, personSummary));
    forCsv.push(transformOneTestToCsvJson('speedTest-1', index, personSummary));
    forCsv.push(transformOneTestToCsvJson('speedTest-2', index, personSummary));
    forCsv.push(transformOneTestToCsvJson('speedTest-3', index, personSummary));
  });
  forCsv.forEach(function(testData) {
    testData.forEach(function(scenarioBlockData) {
      csv.push(scenarioBlockData);
    });
  })
  return csv;
}

module.exports = transformToCsvJson();