const _ = require('lodash');
const Synaptic = require('synaptic');
const fs = require('fs');

const readFiles = require('./utils/readFiles');
const { howManyHiddenLayers2 } = require('./utils/neural');
const { fileGrouper, FILE_CLASS_EXT, INPUT_LAYER } = require('./config');

const data = {
  images: {},
  classes: [],
  filenames: [],
};

// Read part

const allRead = () => {
  // TODO should be managed in separate part
  // TODO refactor this to promises at least and manage in own modules/files
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
  // creating trainer
  const trainer = new Synaptic.Trainer(neuralNet);
  const trainingSet = _.values(data.images);
  // training
  trainer.train(trainingSet, {
    rate: 0.3,
    iterations: 40,
    error: 0.5,
    shuffle: false,
    log: 4,
    cost: Synaptic.Trainer.cost.CROSS_ENTROPY,
  });
  // testing our network on stubbed file
  // TODO generalize
  const testBuffer = fs.readFileSync('./test/p__.bmp');
  // TODO move to some function
  // slicing headers magic number for 16 * 16 bmp file
  const arrayBuffer = new Uint8Array(testBuffer).slice(54);
  // 4 because we have rgba (i hope)
  const rgba = _.chunk(arrayBuffer, 4);
  // excluding a
  const rgb = _.map(rgba, color => color.slice(0, -1));
  // to pure 0 - 1 values
  const blackWhite = _.map(rgb, colors => +_.every(colors, color => color === 255));
  const testResult = _.findIndex(_.map(neuralNet.activate(blackWhite), Math.round));
  console.log(data.classes[testResult], 'blackWhite');
};

// TODO really bad, refactor this
let counter = 0;
const getFile = (filename, content) => {
  // slicing headers magic number for 16 * 16 bmp file
  const arrayBuffer = new Uint8Array(content).slice(54);
  // 4 because we have rgba (i hope)
  const rgba = _.chunk(arrayBuffer, 4);
  // excluding a
  const rgb = _.map(rgba, color => color.slice(0, -1));
  // to pure 0 - 1 values
  const blackWhite = _.map(rgb, colors => +_.every(colors, color => color === 255));
  data.images[filename] = {
    input: blackWhite,
    output: _.map(data.classes, cls => +_.startsWith(filename, cls)),
  };
  counter += 1;
  if (counter === data.filenames.length) allRead();
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
};

readFiles('./patterns/', getFile, getFilenames, getError);
