var logSummary = require('./logSummarizer.js');
//var aggregateType = ['single', 'sum', 'arraySum', 'mean', 'arrayMean'];

var printSummary = function() {
	console.log(JSON.stringify(logSummary));
}

var processCurrentAggregate = function(aggregateType, currentGroup, alsoRecord, currentAggregate) {
	var resultPart = {};
	switch (aggregateType) {
		case 'sum':
			currentAggregate.reduce(function(a, b) {
				return a+b;
			}, 0);
			break;
		case 'mean':
			var length = currentAggregate.length;
			var sum = currentAggregate.reduce(function(a, b) {
				return a+b;
			}, 0);
			currentAggregate = sum/length;
			break;
		case 'arraySum':
			var firstArrayLength = currentAggregate[0].length;
			var testArr = currentAggregate.slice();
			testArr.map(function(arr) {
				return arr.length == firstArrayLength;
			});
			var allSameLength = testArr.reduce(function(a, b) {
				return a && b;
			}, true);
			if(allSameLength) {
				currentAggregate.reduce(function(a, b) {
					var resultArr = [];
					for(var i=0; i<a.length; i++) {
						resultArr.push(a[i]+b[i]);
					}
					return resultArr;
				});
			} else {
				currentAggregate = 'error!';
			}
			break;
		case 'arrayMean':
			break;
		default:
			break;
	}
	resultPart['group'] = currentGroup;
	if(alsoRecord != "") resultPart['alsoRecord'] = alsoRecord;
	resultPart['result'] = currentAggregate;
	return resultPart;
}

var aggregate = function(tobeAggregated, groupedBy, aggregateType, alsoRecord, dataSet) {
	var result = [];
	var currentGroup = "";
	var currentAggregate = [];
	var alsoRecordValue = '';
	dataSet.forEach(function(line) {
		if(line.hasOwnProperty(tobeAggregated)) {
			if(alsoRecord != '') {
				alsoRecordValue = line[alsoRecord];
			}
			if(!(line[groupedBy] == currentGroup)) {
				if(currentAggregate.length > 0) {
					result.push(processCurrentAggregate(aggregateType, currentGroup, alsoRecordValue, currentAggregate));
				}
				currentGroup = line[groupedBy];
				currentAggregate = [];
			}
			currentAggregate.push(line[tobeAggregated]);
		}
	});
	var alsoRecordValue = '';
	result.push(processCurrentAggregate(aggregateType, currentGroup, alsoRecordValue, currentAggregate));
	return result;
}

var filter = function(column, value, data) {
	var result = [];
	data.forEach(function(line) {
		if(line.hasOwnProperty(column) && line[column] == value) {
			result.push(line);
		}
	});
	return result;
}

var countEntries = function(column, data) {
	count = 0;
	data.forEach(function(line) {
		if(line.hasOwnProperty(column)) {
			count++;
		}
	});
	return count;
}

var sumOf = function(column, data) {
	var sum = 0;
	data.forEach(function(line) {
		if(line[column] != '') {
			sum += line[column];
		}
	});
	return sum;
}

var meanOf = function(column, data) {
	var count = 0;
	var sum = 0;
	data.forEach(function(line) {
		if(line.hasOwnProperty(column)) {
			sum += parseFloat(line[column]);
			count++;
		}
	});
	return sum/count;
}

var standardDev = function(column, data) {
	var mean = meanOf(column, data);
	var sum = 0;
	var count = 0;
	data.forEach(function(line) {
		if(line[column] != '') {
			sum += (line[column]-mean)^2;
		}
		count ++;
	});
	return sum/count;
}

var getCoreTempPeakData = function() {
	var coreTempPeakRows = filter('type', 'coreTempPeak', logSummary);
	var onDetailViewCount = countEntries('onDetailView', coreTempPeakRows);
	var onGraphCount = countEntries('onGraph', coreTempPeakRows);
	var meanOnDetailView = meanOf('onDetailView', coreTempPeakRows);
	var meanOnGraph = meanOf('onGraph', coreTempPeakRows);
	var sdOnDetailView = standardDev('onDetailView', coreTempPeakRows);
	var sdOnGraph = standardDev('onGraph', coreTempPeakRows);
	console.log('Core Temp Peak Data:');
	console.log('On DetailView: '+onDetailViewCount+' (mean: '+meanOnDetailView+', var: '+sdOnDetailView+')');
	console.log('On Core Temp Graph: '+onGraphCount+' (mean: '+meanOnGraph+', var: '+sdOnGraph+')');
}

var getOnHeartrateGraphData = function() {
	var result = aggregate('onGraph', 'person', 'sum', '', logSummary);
	console.log(result);
}

var getRightRetreats = function() {
	var result = aggregate('rightRetreats', 'person', 'sum', '', logSummary);
	console.log(result);
}

var getSeguesPerPerson = function() {
	var result = [];
	var currentPerson = "";
	var currentArray = [];
	logSummary.forEach(function(element) {
		if(element.hasOwnProperty('clicksOnTableView')) {
			var person = element['person'];
			var clicksOnTableView = element['clicksOnTableView'];
			var clicksOnCeList = element['clicksOnCeList'];
			var clicksOnStatusWidget = element['clicksOnStatusWidget'];
			var clicksOnAnotherGraph = element['clicksOnAnotherGraph'];
			var clicksOverall = element['clicksOverall'];
			if(person != currentPerson) {
				if(currentArray.length > 0) result.push(currentArray);
				currentPerson = person;
				currentArray = [clicksOnTableView, clicksOnCeList, clicksOnStatusWidget, clicksOnAnotherGraph, clicksOverall];

			}
			var clicksOnTableView = element['clicksOnTableView'];
			var clicksOnCeList = element['clicksOnCeList'];
			var clicksOnStatusWidget = element['clicksOnStatusWidget'];
			var clicksOnAnotherGraph = element['clicksOnAnotherGraph'];
			var clicksOverall = element['clicksOverall'];
			result.push([clicksOnTableView, clicksOnCeList, clicksOnStatusWidget, clicksOnAnotherGraph, clicksOverall]);
		}
	});
	console.log(result);
	return result;
}

//getOnHeartrateGraphData();
//getRightRetreats();
//getSeguesPerPerson();
//getCoreTempPeakData();
printSummary();