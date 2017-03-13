// file

const pattern = {
  hidden: /(^|\/)\.[^/.]/g,
};

const FILE_CLASS_EXT = 6;

const fileGrouper = f => f.slice(-FILE_CLASS_EXT);

// neuralNet

const INPUT_LAYER = 16 * 16;

module.exports = {
  pattern,
  fileGrouper,
  FILE_CLASS_EXT,
  INPUT_LAYER,
};
