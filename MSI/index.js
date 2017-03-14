const { readFiles, getFilenames, getFiles } = require('./utils/readFiles');
const { neuralLearn } = require('./utils/neural');
const { PATTERN_DIR, TEST_DIR } = require('./config');

// Read part

const readTr = readFiles(PATTERN_DIR)
  .then(getFilenames)
  .then(getFiles);

const readTe = readFiles(TEST_DIR)
  .then(getFilenames)
  .then(getFiles);

// Learn part

Promise.all([readTr, readTe])
  .then(neuralLearn);
