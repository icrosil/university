const _ = require('lodash');

const readFiles = require('./utils/readFiles');
const { fileGrouper, FILE_CLASS_EXT } = require('./config');

const data = {
  images: {},
  classes: [],
};

const getFile = (filename, content) => {
  data.images[filename] = content;
  console.log(filename, 'filename');
};

const getError = (err) => {
  throw err;
};

const getFilenames = (filenames) => {
  const imageClasses = _.groupBy(filenames, fileGrouper);
  const groupedFileClasses = _.mapValues(
    imageClasses, iC => _.map(iC, c => c.slice(0, -FILE_CLASS_EXT))
  );
  data.classes = _.union(..._.values(groupedFileClasses));
};

readFiles('patterns/', getFile, getFilenames, getError);
