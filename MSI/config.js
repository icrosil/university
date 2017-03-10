const pattern = {
  hidden: /(^|\/)\.[^/.]/g,
};

const FILE_CLASS_EXT = 6;

const fileGrouper = f => f.slice(-FILE_CLASS_EXT);

module.exports = {
  pattern,
  fileGrouper,
  FILE_CLASS_EXT,
};
