const Synaptic = require('synaptic');

// file

// pattern to filter hidden files in directory
const pattern = {
  hidden: /(^|\/)\.[^/.]/g,
};

// how many last characters classifying image changes
const FILE_CLASS_EXT = 6;

// how to group files
const fileGrouper = f => f.slice(-FILE_CLASS_EXT);

// directories for pattern and test sets
const PATTERN_DIR = './patterns/';
const TEST_DIR = './test/';

// neuralNet config

// amount of input
const INPUT_LAYER = 16 * 16;

// several squash functions to use
const SQUASH = Synaptic.Neuron.squash.TANH;
// const SQUASH = Synaptic.Neuron.squash.LOGISTIC;

// options for training, here you can specify learning rate, log schedule, minimal error,
// shuffle unshuffle files.
const TR_OPTIONS = {
  rate: 0.01,
  log: 10,
  error: 1e-3,
  shuffle: false,
};

module.exports = {
  pattern,
  fileGrouper,
  FILE_CLASS_EXT,
  INPUT_LAYER,
  PATTERN_DIR,
  TEST_DIR,
  SQUASH,
  TR_OPTIONS,
};
