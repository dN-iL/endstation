var fs = require('fs');

var getLogfileNames = function() {
  console.log("in function!");
  fs.readdir('./logfiles', 'utf8', function(err, fileList) {
    console.log("in readdir!");
    if(err) {
      console.log("Error reading log file names!");
      console.log(err);
    } else {
      console.log(fileList);
      return fileList;
    }
  });
}

exports.getLogfileNames = getLogfileNames;
