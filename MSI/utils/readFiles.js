const fs = require('fs');
const { pattern } = require('../config');

function readFiles(dirname, onFileContent, onFileNames, onError) {
  fs.readdir(dirname, (err, filenames) => {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach((filename) => {
      fs.readFile(dirname + filename, 'utf-8', (error, content) => {
        if (error) {
          onError(error);
          return;
        }
        onFileContent(filename, content);
      });
    });
    onFileNames(filenames.filter(item => !(pattern.hidden).test(item)));
  });
}

module.exports = readFiles;
