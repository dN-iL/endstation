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

var addIfNotThere = function(e, array) {
  var alreadyThere = false;
  array.forEach(function(element) {
    if(element == e) {
      alreadyThere = true;
    }
  });
  if(!alreadyThere) {
    array.push(e);
  }
}

var arrayContaintsElement = function(e, array) {
  var contains = false;
  array.forEach( function(element) {
    if(element == e) {
      contains = true;
    }
  });
  return contains;
}

var getElementByAttribute = function(value, attr, arr) {
  var target;
  arr.forEach(function(element) {
    if(element[attr] == value) {
      target = element;
      return;
    }
  });
  return target;
}

var removeFromArray = function(e, array) {
  var index = array.indexOf(e);
  if (index > -1) {
    array.splice(index, 1);
  }
}

var beautifyTimestamps = function(scenarioBlockData) {
  scenarioBlockData.forEach(function(scenarioBlock) {
    if(scenarioBlock.hasOwnProperty('type')) {
      var start = parseFloat(scenarioBlock['start']).toFixed(3);
      switch (scenarioBlock['type']) {
        case 'stdCE':
        case 'noConnection':
          if(scenarioBlock.hasOwnProperty('onDetailView')) {
            scenarioBlock['onDetailView'] = (parseFloat(scenarioBlock['onDetailView']) - start).toFixed(3);  
          }
          if(scenarioBlock.hasOwnProperty('retreat')) {
            scenarioBlock['retreat'] = (parseFloat(scenarioBlock['retreat']) - start).toFixed(3);
          }
          break;
        case 'coreTempPeak':
          if(scenarioBlock.hasOwnProperty('onDetailView')) {
            scenarioBlock['onDetailView'] = (parseFloat(scenarioBlock['onDetailView']) - start).toFixed(3);  
          }
          if(scenarioBlock.hasOwnProperty('onGraph')) {
            scenarioBlock['onGraph'] = (parseFloat(scenarioBlock['onGraph']) - start).toFixed(3);
          }
          if(scenarioBlock.hasOwnProperty('retreat')) {
            scenarioBlock['retreat'] = (parseFloat(scenarioBlock['retreat']) - start).toFixed(3);
          }
          break;
        case 'importantVsUnimportant':
          if(scenarioBlock.hasOwnProperty('onDetailViewUnimportant')) {
            scenarioBlock['onDetailViewUnimportant'] = (parseFloat(scenarioBlock['onDetailViewUnimportant']) - start).toFixed(3);  
          }
          if(scenarioBlock.hasOwnProperty('onDetailViewImportant')) {
            scenarioBlock['onDetailViewImportant'] = (parseFloat(scenarioBlock['onDetailViewImportant']) - start).toFixed(3);  
          }
          if(scenarioBlock.hasOwnProperty('retreatUnimportant')) {
            scenarioBlock['retreatUnimportant'] = (parseFloat(scenarioBlock['retreatUnimportant']) - start).toFixed(3);  
          }
          if(scenarioBlock.hasOwnProperty('retreatImportant')) {
            scenarioBlock['retreatImportant'] = (parseFloat(scenarioBlock['retreatImportant']) - start).toFixed(3);  
          }
          break;
        default:
          break;
      }
      scenarioBlock['start'] = start;
    }
  });
}

var removeInvalidCEs = function(scenarioBlockData) {
  var toBeRemoved = [];
  scenarioBlockData.forEach(function(scenarioBlock) {
    if(scenarioBlock['type'] == 'stdCE' && !scenarioBlock.hasOwnProperty('person')) {
      toBeRemoved.push(scenarioBlock);
    }
  });
  toBeRemoved.forEach(function(scenarioBlock) {
    removeFromArray(scenarioBlock, scenarioBlockData);
  });
}

var removeHelperAttributes = function(scenarioBlockData) {
  scenarioBlockData.forEach(function(scenarioBlock) {
    delete scenarioBlock['active'];
    delete scenarioBlock['id'];
    if(scenarioBlock['type'] == 'importantVsUnimportant') {
      delete scenarioBlock['importantPerson'];
      delete scenarioBlock['unimportantPerson'];
    } else {
      delete scenarioBlock['person'];
    }
  });
}

var analyzeScenarioBlocks = function(data) {
  if(data == "") {
    console.log("No data to analyze!");
    return;
  }

  /* RECORDED DATA FOR EACH SCENARIO BLOCK
    ======================================
  stdCE - (id) - seguesWhileActive - (person) - start - onDetailView - retreat
  stdWarning - nichts
  coreTempPeak - (id) - seguesWhileActive - (person) - start - onDetailView - onGraph - retreat
  noConnection - (id) - seguesWhileActive - (person) - start - onDetailView - retreat
  importantVsUnimportant - (id) - seguesWhileActive - (unimportantPerson) - (importantPerson) - start - 
    onDetailViewUnimportant - onDetailViewImportant - retreatUnimportant - retreatImportant
  */

  /* RETURN OBJECT */
  var scenarioBlockData = [];

  /* OVERALL MEASUREMENTS */
  var wrongRetreats = 0;
  var duplicateRetreats = 0;
  var rightRetreats = 0;
  var clicksWhileTaskOpen = 0;
  var clicksOnCEList = 0;
  var clicksOnStatusWidget = 0;
  var clicksOnTableViewCell = 0;
  var changesToAnotherGraph = 0;
  var clicksOnHistoryButton = 0;
  var clicksOnMedicalCard = 0;
  var overallSegues = 0;
  var skippedScenarioBlocks = [];

  /* HELPERS */
  var retreatedPersons = [];
  var toBeRetreatedPersons = [];
  // helper for assigning view updates to scenario blocks
  var viewUpdateQueue = [];
  // helper for identifying duplicate segues
  var lastSegueOn = 0;

  // look at each log and fill the scenarioBlockData object accordingly
  var logs = data.split('\n');
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
        // importantVsUnimportant awaits 2 critical viewUpdates, therefore needs one more in the queue
        if(type == 'importantVsUnimportant') {
          viewUpdateQueue.push(id);
        }  
        break;

      case 'endScenarioBlock':
        var id = log[2].split('-')[1];
        var forBlock = getElementByAttribute(id, 'id', scenarioBlockData);
        if(forBlock != undefined) { // scenario block might already be deleted
          forBlock['active'] = false;
          if(forBlock['type'] == 'importantVsUnimportant') {
            removeFromArray(forBlock['importantPerson'], toBeRetreatedPersons);
            removeFromArray(forBlock['unimportantPerson'], toBeRetreatedPersons);
          } else {
            removeFromArray(forBlock['person'], toBeRetreatedPersons);
          }
        }
        break;

      case 'viewUpdate':
        var forEvent = log[2];
        if (forEvent == 'Retreat' || forEvent == 'Warning') break; // => forEvent == 'stdCE'
        var forId = viewUpdateQueue.shift();
        var forBlock = getElementByAttribute(forId, 'id', scenarioBlockData);
        var forPerson = log[3];
        var isAlreadyRetreated = arrayContaintsElement(forPerson, retreatedPersons);
        if(!isAlreadyRetreated) {
          if(forBlock == undefined || forBlock['type'] != 'coreTempPeak') {
            addIfNotThere(forPerson, toBeRetreatedPersons);
          }
          if(forBlock != undefined) {
            if(forBlock['type'] == 'importantVsUnimportant') {
              if(forBlock.hasOwnProperty('unimportantPerson')) {
                forBlock['importantPerson'] = forPerson;
              } else {
                forBlock['start'] = timestamp;
                forBlock['unimportantPerson'] = forPerson;
              }
            } else {
              forBlock['person'] = forPerson;
              forBlock['start'] = timestamp;
            }
          }
        /* if the event belongs to a person that is already retreated and the event
         is not deleted yet (therefore not undefined), delete it */
        } else if (forBlock != undefined) {
          skippedScenarioBlocks.push(forBlock['type']);
          removeFromArray(forBlock, scenarioBlockData);
        }
        break;

      case 'segue':
        //ignore duplicate segues
        if(parseFloat(timestamp) - parseFloat(lastSegueOn) < 0.15) break;
        var toPerson = log[5];
        var via = log[6];
        // check if this is a reaction to a cricital event
        if(log[4] == 'DetailView') {
          scenarioBlockData.forEach(function(blockData) {
            if(blockData['active'] == true) {
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
        var wasRight = arrayContaintsElement(person, toBeRetreatedPersons);
        wasRight ? rightRetreats++ : wrongRetreats++;
        arrayContaintsElement(person, retreatedPersons) ? duplicateRetreats++ : retreatedPersons.push(person);
        scenarioBlockData.forEach(function(scenarioBlock) {
          if(scenarioBlock['active'] == true) {
            if(scenarioBlock['type'] == 'importantVsUnimportant') {
              if(scenarioBlock.hasOwnProperty('onDetailViewImportant') && 
                scenarioBlock['importantPerson'] == person && 
                !scenarioBlock.hasOwnProperty('retreatImportant')) {
                scenarioBlock['retreatImportant'] = timestamp;
                if(scenarioBlock.hasOwnProperty('retreatUnimportant')) {
                  scenarioBlock['active'] = false;
                }
              } else if (scenarioBlock.hasOwnProperty('onDetailViewUnimportant') && 
                scenarioBlock['unimportantPerson'] == person && 
                !scenarioBlock.hasOwnProperty('retreatUnimportant')) {
                scenarioBlock['retreatUnimportant'] = timestamp;
                if(scenarioBlock.hasOwnProperty('retreatImportant')) {
                  scenarioBlock['active'] = false;
                }
              }
            } else if((scenarioBlock['type'] == 'stdCE' || scenarioBlock['type'] == 'noConnection' || scenarioBlock['type'] == 'coreTempPeak') &&
              scenarioBlock.hasOwnProperty('onDetailView') && 
              scenarioBlock['person'] == person &&
              !scenarioBlock.hasOwnProperty('retreat')) {
              scenarioBlock['retreat'] = timestamp;
              scenarioBlock['active'] = false;
            }
          }   
        });
        removeFromArray(person, toBeRetreatedPersons);
        addIfNotThere(person, retreatedPersons);
        break;

      default:
        break;
    }
  });
  // add overall numbers and skipped scenario blocks
  scenarioBlockData.push({'retreats': [rightRetreats, wrongRetreats, duplicateRetreats]});
  scenarioBlockData.push({'clicks': [clicksOnTableViewCell, clicksOnCEList, clicksOnStatusWidget, changesToAnotherGraph, overallSegues]});
  scenarioBlockData.push({'skipped': skippedScenarioBlocks});
  // last man standing in speed test produces invalid CE
  removeInvalidCEs(scenarioBlockData);
  removeHelperAttributes(scenarioBlockData);
  beautifyTimestamps(scenarioBlockData);
  //console.log(scenarioBlockData);
  return scenarioBlockData;
}

module.exports = analyzeScenarioBlocks;
