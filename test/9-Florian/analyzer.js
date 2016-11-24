var fs = require('fs');
var path = require('path');
var content = "1479134652.2156,startScenarioBlock,stdCE-37693#\
1479134654.401183,viewUpdate,Critical,Andreas,CEList#\
1479134659.618824,segue,ParticipantOverview,,DetailView,Andreas,OverviewTable#\
1479134659.684228,segue,unknown,,DetailView,current,Navigation#\
1479134664.980276,retreat,Andreas#\
1479134664.999433,viewUpdate,Retreat,Andreas,CEList#\
1479134667.253171,segue,unknown,,ParticipantOverview,,Navigation#\
1479134678.21493,startScenarioBlock,stdWarning-33261#\
1479134680.61079,viewUpdate,Warning,Simon,CEList#\
1479134683.21723,endScenarioBlock,stdCE-37693#\
1479134689.931963,segue,ParticipantOverview,,DetailView,Simon,OverviewTable#\
1479134689.956243,segue,unknown,,DetailView,current,Navigation#\
1479134709.2161,endScenarioBlock,stdWarning-33261#\
1479134712.491806,segue,unknown,,ParticipantOverview,,Navigation#\
1479134714.21803,startScenarioBlock,stdWarning-39727#\
1479134716.31852,viewUpdate,Warning,SÃ¶nke,CEList#\
1479134734.003526,segue,ParticipantOverview,,DetailView,SÃ¶nke,OverviewTable#\
1479134734.038929,segue,unknown,,DetailView,current,Navigation#\
1479134745.21929,endScenarioBlock,stdWarning-39727#\
1479134750.21859,startScenarioBlock,stdCE-32631#\
1479134752.339621,viewUpdate,Critical,Thorben,CEList#\
1479134754.248146,segue,unknown,,ParticipantOverview,,Navigation#\
1479134776.21967,startScenarioBlock,coreTempPeak-87748#\
1479134778.376531,viewUpdate,Critical,Martin,CEList#\
1479134781.22047,endScenarioBlock,stdCE-32631#\
1479134798.371393,segue,ParticipantOverview,current,DetailView,Martin,CEList#\
1479134798.401687,segue,unknown,,DetailView,current,Navigation#\
1479134807.096127,segue,DetailView,current,DetailView,Thorben,CEList#\
1479134809.2212,endScenarioBlock,coreTempPeak-87748#\
1479134814.21998,startScenarioBlock,stdWarning-2862#\
1479134814.85909,segue,unknown,,ParticipantOverview,,Navigation#\
1479134816.408389,viewUpdate,Warning,Martin,CEList#\
1479134838.141705,segue,ParticipantOverview,,DetailView,Martin,OverviewTable#\
1479134838.186481,segue,unknown,,DetailView,current,Navigation#\
1479134845.22094,endScenarioBlock,stdWarning-2862#\
1479134849.82604,segue,DetailView,current,DetailView,Martin,CEList#\
1479134850.21952,startScenarioBlock,importantVsUnimportant-34270#\
1479134851.210598,segue,DetailView,current,DetailView,Martin,CEList#\
1479134852.625563,viewUpdate,Critical,SÃ¶nke,CEList#\
1479134853.365996,viewUpdate,Warning,SÃ¶nke,CEList#\
1479134855.931142,segue,HeartRateGraph,Martin,HumidityGraph,Martin,Button#\
1479134856.352332,viewUpdate,Critical,Martin,CEList#\
1479134860.885117,segue,unknown,,ParticipantOverview,,Navigation#\
1479134864.807927,segue,ParticipantOverview,,DetailView,Martin,OverviewTable#\
1479134864.842343,segue,unknown,,DetailView,current,Navigation#\
1479134867.503427,retreat,Martin#\
1479134867.530636,viewUpdate,Retreat,Martin,CEList#\
1479134870.083753,segue,unknown,,ParticipantOverview,,Navigation#\
1479134885.22088,endScenarioBlock,importantVsUnimportant-34270#\
1479134890.22188,startScenarioBlock,stdWarning-17809#\
1479134892.459691,viewUpdate,Warning,Johannes,CEList#\
1479134899.053065,segue,ParticipantOverview,,DetailView,Johannes,OverviewTable#\
1479134899.092306,segue,unknown,,DetailView,current,Navigation#\
1479134914.545359,segue,DetailView,current,DetailView,SÃ¶nke,CEList#\
1479134921.22281,endScenarioBlock,stdWarning-17809#\
1479134922.086324,segue,DetailView,current,DetailView,Martin,CEList#\
1479134925.039551,segue,unknown,,ParticipantOverview,,Navigation#\
1479134926.22014,startScenarioBlock,noConnection-10014#\
1479134928.503561,viewUpdate,Critical,Simon,CEList#\
1479134928.555136,viewUpdate,Critical,Simon,CEList#\
1479134928.599298,viewUpdate,Critical,Simon,CEList#\
1479134928.635244,viewUpdate,Critical,Simon,CEList#\
1479134928.670201,viewUpdate,Critical,Simon,CEList#\
1479134935.66731,segue,ParticipantOverview,,DetailView,Simon,OverviewTable#\
1479134935.720155,segue,unknown,,DetailView,current,Navigation#\
1479134946.772087,retreat,Simon#\
1479134946.779707,viewUpdate,Retreat,Simon,CEList#\
1479134957.22314,endScenarioBlock,noConnection-10014#\
1479134973.25899,segue,unknown,,ParticipantOverview,,Navigation"

var mapper = function(toBeMapped) {
  switch(toBeMapped) {
    case 'Warning':
      return 'stdWarning';
    case 'Cricital':
      return 'stdCE';
    default:
      return undefined;
  }
}

var analyzeComponentTest = function(content) {
  var logs = content.split('#');
  
  /* WHAT IS RECORDED FOR EACH SCENARIO BLOCK?
  stdCE - id - person - start - onDetailView - retreat
  stdWarning - nichts, evtl. +1 bei retreat fehler
  coreTempPeak - person - start - onDetailView - onGraph - retreat
  noConnection - person - start - onDetailView - retreat
  importantVsUnimportant - unimportanPerson - importantPerson - start - onDetailViewUnimportant - onDetailViewImportant - retreatUnimportant - retreatImportant
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


  // helper for assigning view updates to scenario blocks
  var viewUpdateQueue = [];
  logs.forEach(function(logString) {
    log = logString.split(',');
    var timestamp = log[0];
    switch(log[1]) {
      case 'startScenarioBlock':
        var type = log[2].split('-')[0];
        if(type == 'stdWarning') break;
        var id = log[2].split('-')[1];
        scenarioBlockData.push({'type': type, 'id': id, 'active': true});
        viewUpdateQueue.push(id);
        // importantVsUnimportant awaits 3 viewUpdates
        if(type == 'importantVsUnimportant') {
          viewUpdateQueue.push(id);
          viewUpdateQueue.push(id);
        }  
        break;
      case 'endScenarioBlock':
        var id = log[2].split('-')[1];
        scenarioBlockData.forEach(function(blockData) {
          if(blockData['id'] == id) {
            blockData['active'] = false;
          }
        });
        break;
      case 'viewUpdate':
        var forEvent = log[2];
        if (forEvent == 'Retreat' || forEvent == 'Warning') break;
        var forPerson = log[3];
        var forId = viewUpdateQueue.shift();
        scenarioBlockData.forEach(function(blockData) {
          if(blockData['active'] == true && blockData['id'] == forId) {
            if(blockData['type'] == 'importantVsUnimportant') {
              if(blockData.hasOwnProperty('unimportanPerson')) {
                blockData['importantPerson'] = forPerson;
              } else {
                blockData['unimportanPerson'] = forPerson;
                blockData['start'] = timestamp;
              }
            } else {
              blockData['person'] = forPerson;
              blockData['start'] = timestamp;
            }
          }
        });
        break;
      case 'segue':
        var toPerson = log[5];
        var via = log[6];
        if(log[4] == 'DetailView') {
          scenarioBlockData.forEach(function(blockData) {
            // check if this is a reaction to a critical event
            if(blockData['type'] == 'importantVsUnimportant') {
              if(!blockData.hasOwnProperty('onDetailViewUnimportant') && 
                blockData.hasOwnProperty('unimportanPerson') && 
                blockData['unimportanPerson'] == toPerson) {
                blockData['onDetailViewUnimportant'] = timestamp;
              } else if(!blockData.hasOwnProperty('onDetailViewImportant') && 
                blockData.hasOwnProperty('importantPerson') && 
                blockData['importantPerson'] == toPerson) {
                blockData['onDetailViewImportant'] = timestamp;
              }
            } else if(blockData.hasOwnProperty('person') &&
              blockData['person'] == toPerson &&
              !blockData.hasOwnProperty('onDetailView')) {
              blockData['onDetailView'] = timestamp;
            }
          });
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
        break;
      case 'retreat':
        var person = log[2];
        var wasRight = false;
        scenarioBlockData.forEach(function(scenarioBlock) {
          if(scenarioBlock['active'] == true) {
            if(scenarioBlock['type'] == 'importantVsUnimportant') {
              if(scenarioBlock.hasOwnProperty('onDetailViewImportant') && 
                scenarioBlock['importantPerson'] == person && 
                !scenarioBlock.hasOwnProperty('retreatImportant')) {
                scenarioBlock['retreatImportant'] = timestamp;
                wasRight = true;
              } else if (scenarioBlock.hasOwnProperty('onDetailViewUnimportant') && 
                scenarioBlock['unimportantPerson'] == person && 
                !scenarioBlock.hasOwnProperty('retreatUnimportant')) {
                scenarioBlock['retreatUnimportant'] = timestamp;
                wasRight = true;
              }
            } else if((scenarioBlock['type'] == 'stdCE' || scenarioBlock['type'] == 'noConnection' || scenarioBlock['type'] == 'coreTempPeak') &&
              scenarioBlock.hasOwnProperty('onDetailView') && 
              scenarioBlock['person'] == person &&
              !scenarioBlock.hasOwnProperty('retreat')) {
              scenarioBlock['retreat'] = timestamp;
              wasRight = true;
            }
          }   
        });
        wasRight ? rightRetreats++ : wrongRetreats++;
        break;
      default:
        break;
    }
  });
  scenarioBlockData.push({'numbers': [rightRetreats, wrongRetreats, clicksOnCEList, clicksOnStatusWidget, clicksOnTableViewCell]});
  console.log(scenarioBlockData);
  return scenarioBlockData;
}

analyzeComponentTest(content);
