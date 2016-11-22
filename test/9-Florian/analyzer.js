var fs = require('fs');

var analyzeComponentTest = function(content) {
  var logs = content.split('\n');
  //define helper variables here
  
  /* WHAT IS RECORDED FOR EACH SCENARIO BLOCK?
  stdCE - id - person - start - onDetailView - retreat
  stdWarning - nichts, evtl. +1 bei retreat fehler
  coreTempPeak - person - start - onDetailView - onGraph - retreat
  noConnection - person - start - onDetailView - retreat
  */

  /* WHAT IS RECORDED OVERALL
  # wrong retreats
  # right retreats
  # clicks while task open
  # clicks on ce list
  # clicks on status widget
  # clicks on tableview cell
  # changes to another graph
  # clicks on history button
  # clicks on medical card
  */

  var scenarioBlockData = [];
  var wrongRetreats = 0;
  var rightRetreats = 0;
  var clicksWhileTaskOpen = 0;
  var clicksOnCEList = 0;
  var clicksOnStatusWidget = 0;
  var clicksOnTableViewCell = 0;
  var changesToAnotherGraph = 0;
  var clicksOnHistoryButton = 0;
  var clicksOnMedicalCard = 0;

  logs.forEach(function(log) {
    log = log.split(',');
    switch(log[1]) {
      case 'startScenarioBlock':
        var type = log[2].split('-')[0];
        var id = log[2].split('-')[1];
        scenarioBlockData.push({'type': type, 'id': id});
        break;
      case 'endScenarioBlock':
        break;
      case 'viewUpdate':
        scenarioBlockData.forEach(function(blockData) {
          //to do: extract in helper? check if CE or Warning?
          if(!blockData.hasOwnProperty('person')) {
            blockData['person'] = log[3];
            blockData['start'] = log[0];
            break;
          }
        }
        break;
      case 'segue':
        break;
      case 'retreat':
        break;
    }
  }
}

analyzeComponentTest("lalalala\ndasistein\ntest und so");
