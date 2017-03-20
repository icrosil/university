const { readFiles, getFilenames, getFiles } = require('./utils/readFiles');
const { neuralLearn } = require('./utils/neural');
const { PATTERN_DIR, TEST_DIR } = require('./config');

// Read Pattern set
const readTr = readFiles(PATTERN_DIR)
  .then(getFilenames)
  .then(getFiles);

// Read Test set
const readTe = readFiles(TEST_DIR)
  .then(getFilenames)
  .then(getFiles);

// Start Learning
Promise.all([readTr, readTe])
  .then(neuralLearn);
