const fs = require('fs-promise');
const _ = require('lodash');

const { pattern, fileGrouper, FILE_CLASS_EXT, PATTERN_DIR } = require('../config');

/**
 * read directory and filter hidden files
 * @method readFiles
 * @param  {string}  dirname
 * @return {promise} names of files in directory
 */
function readFiles(dirname) {
  return fs.readdir(dirname)
    .then(filenames => filenames.filter(item => !(pattern.hidden).test(item)));
}

/**
 * read exact file
 * @method readFile
 * @param  {string}  dirname
 * @param  {string}  filename
 * @return {promise} resolves content
 */
function readFile(dirname, filename) {
  return fs.readFile(dirname + filename);
}

/**
 * transform buffer object to black-whtie array
 * @method bufferToBW
 * @param  {buffer}   buffer raw file content
 * @return {array}           black-white representation
 */
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

/**
 * grouping files into classes
 * @method getFilenames
 * @param  {array}     filenames
 * @return {object}               filenames and classes
 */
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

/**
 * mapping input file to some class that looked by file name
 * @method getTrS
 * @param  {object} store    filenames and classes
 * @param  {string} filename
 * @param  {buffer} content  raw image content
 * @return {object}          train set
 */
const getTrS = (store, filename, content) => {
  const blackWhite = bufferToBW(content);
  // simple visualise of input
  // console.log(_.chunk(blackWhite, 16), filename);
  return {
    input: blackWhite,
    output: _.map(store.classes, cls => +_.startsWith(filename, cls)),
  };
};

/**
 * mapper of all files to train set
 * @method getFiles
 * @param  {object} store filenames classes and set
 * @return {promise}      resolves store object
 */
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
