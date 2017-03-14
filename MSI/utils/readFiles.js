const fs = require('fs');

const { pattern } = require('../config');

function readFiles(dirname, onFileContent, onFileNames, onError) {
  fs.readdir(dirname, (err, filenames) => {
    if (err) {
      onError(err);
      return;
    }
    const filtered = filenames.filter(item => !(pattern.hidden).test(item));
    onFileNames(filtered);
    filtered.forEach((filename) => {
      fs.readFile(dirname + filename, (error, content) => {
        if (error) {
          onError(error);
          return;
        }
        onFileContent(filename, content);
      });
    });
  });
}

module.exports = readFiles;
