const Synaptic = require('synaptic');

// file

const pattern = {
  hidden: /(^|\/)\.[^/.]/g,
};

const FILE_CLASS_EXT = 6;

const fileGrouper = f => f.slice(-FILE_CLASS_EXT);

const PATTERN_DIR = './patterns/';
const TEST_DIR = './test/';

// neuralNet

const INPUT_LAYER = 16 * 16;

// const SQUASH = Synaptic.Neuron.squash.TANH;
const SQUASH = Synaptic.Neuron.squash.LOGISTIC;

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
