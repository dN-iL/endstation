var fs = require('fs');

var mapper = function(toBeMapped) {
  switch(toBeMapped) {
    case 'Warning':
      return 'sdtWarning';
    case 'Cricital':
      return 'stdCE';
    default:
      return undefined;
  }
}

var analyzeComponentTest = function(content) {
  var logs = content.split('\n');
  
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
  var overallSegues = 0;

  logs.forEach(function(logString) {
    log = logString.split(',');
    var timestamp = log[0];
    switch(log[1]) {
      case 'startScenarioBlock':
        var type = log[2].split('-')[0];
        var id = log[2].split('-')[1];
        scenarioBlockData.push({'type': type, 'id': id, 'active': true});
        break;
      case 'endScenarioBlock':
        var type = log[2].split('-')[0];
        var id = log[2].split('-')[1];
        scenarioBlockData.forEach(function(blockData) {
          if(blockData['id'] == id) {
            blockData['active'] = false;
          }
        });
        break;
      case 'viewUpdate':
        var forEvent = log[2];
        var forPerson = log[3];
        scenarioBlockData.forEach(function(blockData) {
          if(blockData['active'] && 
            !blockData.hasOwnProperty('person') && 
            (mapper(forEvent) == blockData['type'] || 
              (forEvent == 'Critical' && 
                (blockData['type'] == 'importantVsUnimportant' || blockData['type'] == 'noConnection')))) {
            blockData['person'] = forPerson;
            blockData['start'] = timestamp;
            break;
          } 
        });
        break;
      case 'segue':
        var toPerson = log[5];
        var via = log[6];
        scenarioBlockData.forEach(function(blockData) {
          // check if this is a reaction to a critical event
          if(blockData['type'] == 'sdtCE' &&
            blockData.hasOwnProperty('person') &&
            blockData['person'] == toPerson &&
            !blockData.hasOwnProperty('onDetailView')) {
            blockData['onDetailView'] = timestamp;
          }
          // increment counters
          overallSegues++;
          switch(via) {
            case 'CEList':
              clicksOnCEList++;
              break;
            case 'StatusWidget':
              clicksOnStatusWidget++;
              break;
            case 'HistoryButton':
              clicksOnHistoryButton++;
              break;
            case 'MedicalCardButton':
              clicksOnMedicalCard++;
              break;
            case 'OverviewTable':
              clicksOnTableViewCell++;
              break;
            case 'HeartrateGraph':
            case 'StressLevelGraph':
            case 'CoreTempGraph':
            case 'AnkleTempGraph':
            case 'WristTempGraph':
            case 'HumidityGraph':
              changesToAnotherGraph++;
              break;
            default:
              break;
          }
        });
        break;
      case 'retreat':
        var person = log[2];
        var wasRight = false;
        scenarioBlockData.forEach(function(scenarioBlock) {
          if(scenarioBlock['active'] == true &&
            scenarioBlock['type'] == 'sdtCE' &&
            scenarioBlock['person'] == person) {
            wasRight = true;
            scenarioBlock['retreat'] = timestamp;
            scenarioBlock['active'] = false;
          }
        });
        wasRight ? rightRetreats++ : wrongRetreats++;
        break;
      default:
        break;
    }
  }
  console.log(scenarioBlockData);
  return scenarioBlockData;
}

analyzeComponentTest("lalalala\ndasistein\ntest und so");
