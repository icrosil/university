const fs = require('fs-promise');
const _ = require('lodash');

const { pattern, fileGrouper, FILE_CLASS_EXT, PATTERN_DIR } = require('../config');

function readFiles(dirname) {
  return fs.readdir(dirname)
    .then(filenames => filenames.filter(item => !(pattern.hidden).test(item)));
}

function readFile(dirname, filename) {
  return fs.readFile(dirname + filename);
}

function bufferToBW(buffer) {
  // slicing headers magic number for 16 * 16 bmp file
  const arrayBuffer = new Uint8Array(buffer).slice(54);
  // 4 because we have rgba (i hope)
  const rgba = _.chunk(arrayBuffer, 4);
  // excluding a
  const rgb = _.map(rgba, color => color.slice(0, -1));
  // to pure 0 - 1 values
  const blackWhite = _.map(rgb, colors => +_.every(colors, color => color === 255));
  return blackWhite;
}

const getFilenames = (filenames) => {
  const imageClasses = _.groupBy(filenames, fileGrouper);
  const groupedFileClasses = _.mapValues(
    imageClasses, iC => _.map(iC, c => c.slice(0, -FILE_CLASS_EXT))
  );
  return {
    filenames,
    classes: _.union(..._.values(groupedFileClasses)),
  };
};

const getTrS = (store, filename, content) => {
  const blackWhite = bufferToBW(content);
  // simple visualise of input
  // console.log(_.chunk(blackWhite, 16), filename);
  return {
    input: blackWhite,
    output: _.map(store.classes, cls => +_.startsWith(filename, cls)),
  };
};

const getFiles = (store) => {
  const files = _.map(store.filenames, filename => readFile(PATTERN_DIR, filename));
  return Promise.all(files)
    .then(fileBuffers => _.map(
      store.filenames,
      (filename, i) => getTrS(store, filename, fileBuffers[i])
    ))
    .then(set => Object.assign({ set }, store));
};

module.exports = {
  readFiles,
  readFile,
  bufferToBW,
  getFilenames,
  getFiles,
};
