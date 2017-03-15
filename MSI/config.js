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

module.exports = {
  pattern,
  fileGrouper,
  FILE_CLASS_EXT,
  INPUT_LAYER,
  PATTERN_DIR,
  TEST_DIR,
  SQUASH,
};
