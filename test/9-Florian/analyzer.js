var fs = require('fs');
var path = require('path');
var content = "1479301434.16726,startScenarioBlock,stdCE-76696#\
1479301434.436052,viewUpdate,Critical,SÃ¶nke,CEList#\
1479301436.811988,segue,ParticipantOverview,current,DetailView,SÃ¶nke,CEList#\
1479301436.883465,segue,unknown,,DetailView,current,Navigation#\
1479301440.690075,retreat,SÃ¶nke#\
1479301440.704783,viewUpdate,Retreat,SÃ¶nke,CEList#\
1479301443.677289,segue,unknown,,ParticipantOverview,,Navigation#\
1479301460.16652,startScenarioBlock,stdWarning-57440#\
1479301460.567484,viewUpdate,Warning,Martin,CEList#\
1479301463.27318,segue,ParticipantOverview,,DetailView,Martin,OverviewTable#\
1479301463.315061,segue,unknown,,DetailView,current,Navigation#\
1479301465.16681,endScenarioBlock,stdCE-76696#\
1479301472.011855,segue,unknown,,ParticipantOverview,,Navigation#\
1479301479.665485,segue,ParticipantOverview,,DetailView,Martin,OverviewTable#\
1479301479.695957,segue,unknown,,DetailView,current,Navigation#\
1479301483.747699,segue,unknown,,ParticipantOverview,,Navigation#\
1479301491.16774,endScenarioBlock,stdWarning-57440#\
1479301496.16912,startScenarioBlock,stdWarning-88925#\
1479301496.481971,viewUpdate,Warning,Martin,CEList#\
1479301503.140997,segue,ParticipantOverview,,DetailView,Martin,OverviewTable#\
1479301503.168036,segue,unknown,,DetailView,current,Navigation#\
1479301521.803856,segue,unknown,,ParticipantOverview,,Navigation#\
1479301527.16782,endScenarioBlock,stdWarning-88925#\
1479301532.16737,startScenarioBlock,stdCE-8063#\
1479301532.759479,viewUpdate,Critical,Thorben,CEList#\
1479301535.067803,segue,ParticipantOverview,current,DetailView,Thorben,CEList#\
1479301535.102867,segue,unknown,,DetailView,current,Navigation#\
1479301538.002273,segue,HeartRateGraph,Thorben,HumidityGraph,Thorben,Button#\
1479301543.196862,retreat,Thorben#\
1479301543.312564,viewUpdate,Retreat,Thorben,CEList#\
1479301544.780173,segue,unknown,,ParticipantOverview,,Navigation#\
1479301556.634962,segue,ParticipantOverview,current,DetailView,Martin,CEList#\
1479301556.665676,segue,unknown,,DetailView,current,Navigation#\
1479301558.16599,startScenarioBlock,coreTempPeak-41166#\
1479301558.290824,segue,unknown,,ParticipantOverview,,Navigation#\
1479301559.24995,viewUpdate,Critical,Johannes,CEList#\
1479301563.17037,endScenarioBlock,stdCE-8063#\
1479301571.661559,segue,ParticipantOverview,current,DetailView,Johannes,CEList#\
1479301571.698733,segue,unknown,,DetailView,current,Navigation#\
1479301575.218301,segue,HeartRateGraph,Johannes,CoreTempGraph,Johannes,Button#\
1479301577.656047,segue,unknown,,ParticipantOverview,,Navigation#\
1479301580.546788,segue,ParticipantOverview,current,DetailView,Johannes,CEList#\
1479301580.589845,segue,unknown,,DetailView,current,Navigation#\
1479301582.734959,segue,HeartRateGraph,Johannes,WristTempGraph,Johannes,Button#\
1479301583.001842,segue,WristTempGraph,Johannes,HumidityGraph,Johannes,Button#\
1479301584.552209,segue,HumidityGraph,Johannes,CoreTempGraph,Johannes,Button#\
1479301586.856977,retreat,Johannes#\
1479301586.932012,viewUpdate,Retreat,Johannes,CEList#\
1479301587.770141,segue,unknown,,ParticipantOverview,,Navigation#\
1479301591.16914,endScenarioBlock,coreTempPeak-41166#\
1479301596.16967,startScenarioBlock,stdWarning-94513#\
1479301597.914346,viewUpdate,Warning,Martin,CEList#\
1479301600.07998,segue,ParticipantOverview,current,DetailView,Martin,CEList#\
1479301600.117132,segue,unknown,,DetailView,current,Navigation#\
1479301610.515694,segue,unknown,,ParticipantOverview,,Navigation#\
1479301613.132038,segue,ParticipantOverview,current,DetailView,Martin,CEList#\
1479301613.174358,segue,unknown,,DetailView,current,Navigation#\
1479301615.31342,segue,DetailView,current,DetailView,Martin,SmallOverview#\
1479301615.975749,segue,DetailView,current,DetailView,Martin,SmallOverview#\
1479301617.14677,segue,unknown,,ParticipantOverview,,Navigation#\
1479301621.857209,segue,ParticipantOverview,,DetailView,Martin,OverviewTable#\
1479301621.89805,segue,unknown,,DetailView,current,Navigation#\
1479301625.14007,segue,unknown,,ParticipantOverview,,Navigation#\
1479301627.17056,endScenarioBlock,stdWarning-94513#\
1479301632.1745,startScenarioBlock,importantVsUnimportant-71507#\
1479301632.546207,viewUpdate,Critical,Johannes,CEList#\
1479301633.970351,viewUpdate,Warning,Johannes,CEList#\
1479301635.796016,segue,ParticipantOverview,current,DetailView,Johannes,CEList#\
1479301635.822173,segue,unknown,,DetailView,current,Navigation#\
1479301637.628137,viewUpdate,Critical,Andreas,CEList#\
1479301638.145104,segue,HeartRateGraph,Johannes,HumidityGraph,Johannes,Button#\
1479301640.197355,retreat,Johannes#\
1479301640.632847,viewUpdate,Retreat,Johannes,CEList#\
1479301641.782402,segue,unknown,,ParticipantOverview,,Navigation#\
1479301643.722393,segue,ParticipantOverview,current,DetailView,Johannes,CEList#\
1479301643.754399,segue,unknown,,DetailView,current,Navigation#\
1479301646.087042,segue,HeartRateGraph,Johannes,WristTempGraph,Johannes,Button#\
1479301654.732357,segue,unknown,,ParticipantOverview,,Navigation#\
1479301667.17049,endScenarioBlock,importantVsUnimportant-71507#\
1479301672.17318,startScenarioBlock,stdWarning-7352#\
1479301672.823992,viewUpdate,Warning,Lorenzo,CEList#\
1479301674.732295,segue,ParticipantOverview,current,DetailView,Lorenzo,CEList#\
1479301674.768565,segue,unknown,,DetailView,current,Navigation#\
1479301683.065806,segue,unknown,,ParticipantOverview,,Navigation#\
1479301703.17893,endScenarioBlock,stdWarning-7352#\
1479301708.17571,startScenarioBlock,noConnection-42485#\
1479301708.532707,viewUpdate,Critical,Lorenzo,CEList#\
1479301708.575021,viewUpdate,Critical,Lorenzo,CEList#\
1479301708.617667,viewUpdate,Critical,Lorenzo,CEList#\
1479301708.651737,viewUpdate,Critical,Lorenzo,CEList#\
1479301708.694052,viewUpdate,Critical,Lorenzo,CEList#\
1479301711.033557,segue,ParticipantOverview,current,DetailView,Lorenzo,CEList#\
1479301711.064713,segue,unknown,,DetailView,current,Navigation#\
1479301713.77676,segue,unknown,,ParticipantOverview,,Navigation#\
1479301717.051496,segue,ParticipantOverview,,DetailView,Lorenzo,OverviewTable#\
1479301717.08362,segue,unknown,,DetailView,current,Navigation#\
1479301720.369294,retreat,Lorenzo#\
1479301720.450088,viewUpdate,Retreat,Lorenzo,CEList#\
1479301725.504476,segue,unknown,,ParticipantOverview,,Navigation#\
1479301727.434864,segue,ParticipantOverview,,DetailView,Lorenzo,OverviewTable#\
1479301727.465281,segue,unknown,,DetailView,current,Navigation#\
1479301729.512743,segue,unknown,,ParticipantOverview,,Navigation#\
1479301739.17245,endScenarioBlock,noConnection-42485#\
1479301738.13509,segue,ParticipantOverview,current,DetailView,Lorenzo,CEList#\
1479301738.168174,segue,unknown,,DetailView,current,Navigation#\
1479301740.372233,segue,unknown,,ParticipantOverview,,Navigation"

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
  
  /* WHAT IS RECORDED FOR EACH SCENARIO BLOCK?
    ==========================================
  stdCE - id - person - start - onDetailView - retreat
  stdWarning - nichts
  coreTempPeak - person - start - onDetailView - onGraph - retreat
  noConnection - person - start - onDetailView - retreat
  importantVsUnimportant - unimportantPerson - importantPerson - start - onDetailViewUnimportant - onDetailViewImportant - retreatUnimportant - retreatImportant
  */

  /* WHAT IS RECORDED OVERALL
    =========================
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

  // array that is returned with the data of the component test
  // each scenario block is appended to the array as an object containing its data
  var scenarioBlockData = [];

  // overall measurements
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
  // helper for identifying duplicate segues
  var lastSegueOn = 0;

  // look at each log and fill the scenarioBlockData object accordingly
  var logs = content.split('#');
  logs.forEach(function(logString) {
    log = logString.split(',');
    var timestamp = log[0];
    switch(log[1]) {
      case 'startScenarioBlock':
        var type = log[2].split('-')[0];
        // ignore stdWarnnigs
        if(type == 'stdWarning') break;
        var id = log[2].split('-')[1];
        scenarioBlockData.push({'type': type, 'id': id, 'seguesWhileActive': 0, 'active': true});
        viewUpdateQueue.push(id);
        // importantVsUnimportant awaits 2 critical viewUpdates, therefore needs one more
        if(type == 'importantVsUnimportant') {
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
              if(blockData.hasOwnProperty('unimportantPerson')) {
                blockData['importantPerson'] = forPerson;
              } else {
                blockData['start'] = timestamp;
                blockData['unimportantPerson'] = forPerson;
              }
            } else {
              blockData['person'] = forPerson;
              blockData['start'] = timestamp;
            }
          }
        });
        break;
      case 'segue':
        //ignore duplicate segues
        if(parseFloat(timestamp) - parseFloat(lastSegueOn) < 0.15) break;
        var toPerson = log[5];
        var via = log[6];
        // check if this is a reaction to a cricital event
        if(log[4] == 'DetailView') {
          scenarioBlockData.forEach(function(blockData) {
            if(blockData['type'] == 'importantVsUnimportant') {
              if(!blockData.hasOwnProperty('onDetailViewUnimportant') && 
                blockData.hasOwnProperty('unimportantPerson') && 
                blockData['unimportantPerson'] == toPerson) {
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
        } else if(/Graph$/.test(log[4])) {
          changesToAnotherGraph++;
          if(log[4] == 'CoreTempGraph') {
            scenarioBlockData.forEach(function(blockData) {
              if(blockData['active'] == true && 
                blockData['type'] == 'coreTempPeak' && 
                blockData['person'] == toPerson &&
                !blockData.hasOwnProperty('onGraph')) {
                blockData['onGraph'] = timestamp;
              }
            });
          }
        } 
        // increment segue counters
        overallSegues++;
        // seguesWhileActive counter for every active block
        scenarioBlockData.forEach(function(blockData) {
          if(blockData['active'] == true) {
            if((blockData['type'] == 'importantVsUnimportant' && 
                !blockData.hasOwnProperty['retreatImportant'] &&
                !blockData.hasOwnProperty['retreatUnimportant']) ||
              !blockData.hasOwnProperty['retreat']) {
              blockData['seguesWhileActive'] += 1;
            }
          }
        });
        // navigation counters
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
          default:
            break;
        }
        lastSegueOn = timestamp;
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
                if(scenarioBlock.hasOwnProperty('retreatUnimportant')) {
                  scenarioBlock['active'] = false;
                }
              } else if (scenarioBlock.hasOwnProperty('onDetailViewUnimportant') && 
                scenarioBlock['unimportantPerson'] == person && 
                !scenarioBlock.hasOwnProperty('retreatUnimportant')) {
                scenarioBlock['retreatUnimportant'] = timestamp;
                wasRight = true;
                if(scenarioBlock.hasOwnProperty('retreatImportant')) {
                  scenarioBlock['active'] = false;
                }
              }
            } else if((scenarioBlock['type'] == 'stdCE' || scenarioBlock['type'] == 'noConnection' || scenarioBlock['type'] == 'coreTempPeak') &&
              scenarioBlock.hasOwnProperty('onDetailView') && 
              scenarioBlock['person'] == person &&
              !scenarioBlock.hasOwnProperty('retreat')) {
              scenarioBlock['retreat'] = timestamp;
              wasRight = true;
              scenarioBlock['active'] = false;
            }
          }   
        });
        wasRight ? rightRetreats++ : wrongRetreats++;
        break;
      default:
        break;
    }
  });
  // add overall numbers
  scenarioBlockData.push({'numbers': [rightRetreats, wrongRetreats, clicksOnCEList, clicksOnStatusWidget, clicksOnTableViewCell, changesToAnotherGraph, overallSegues]});

  // remove helper attributes
  /*
  scenarioBlockData.forEach(function(scenarioBlock) {
    delete scenarioBlock['active'];
    delete scenarioBlock['id'];
    if(scenarioBlock['type'] == 'importantVsUnimportant') {
      delete scenarioBlock['importantPerson'];
      delete scenarioBlock['unimportantPerson'];
    } else {
      delete scenarioBlock['person'];
    }
  });*/

  console.log(scenarioBlockData);
  return scenarioBlockData;
}

analyzeComponentTest(content);
