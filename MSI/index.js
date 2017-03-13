const _ = require('lodash');
const Synaptic = require('synaptic');

const readFiles = require('./utils/readFiles');
const { howManyHiddenLayers2 } = require('./utils/neural');
const { fileGrouper, FILE_CLASS_EXT, INPUT_LAYER } = require('./config');

const data = {
  images: {},
  classes: [],
  filenames: [],
};

// Read part
const getFile = (filename, content) => {
  data.images[filename] = content;
};

const getError = (err) => {
  throw err;
};

const getFilenames = (filenames) => {
  const imageClasses = _.groupBy(filenames, fileGrouper);
  const groupedFileClasses = _.mapValues(
    imageClasses, iC => _.map(iC, c => c.slice(0, -FILE_CLASS_EXT))
  );
  data.filenames = filenames;
  data.classes = _.union(..._.values(groupedFileClasses));
  // TODO should be managed in separate part
  // Creation of neuronet as Perceptron with 3 layers
  // First figure - how many input we will receive
  // Second figure - how many hidden neurons using this formula
  // Third figure - how many classes do we have for identification
  const HIDDEN_LAYER = howManyHiddenLayers2(INPUT_LAYER, data.classes.length);
  const neuralNet = new Synaptic.Architect.Perceptron(
    INPUT_LAYER,
    HIDDEN_LAYER,
    data.classes.length
  );
};

readFiles('patterns/', getFile, getFilenames, getError);
