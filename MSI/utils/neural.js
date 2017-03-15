const _ = require('lodash');
const Synaptic = require('synaptic');

const { INPUT_LAYER } = require('../config');

// nSamples / (alpha * (nInput + nOutput)), aplha 2-10
// http://stats.stackexchange.com/questions/181/how-to-choose-the-number-of-hidden-layers-and-nodes-in-a-feedforward-neural-netw
// const howManyHiddenLayers = (nSamples, nInput, nOutput, alpha = 2) => Math.round(
//   nSamples / (alpha * (nInput + nOutput))
// );

const howManyHiddenLayers2 = (nInput, nOutput) => Math.round((0.667 * nInput) + nOutput);
const howManyHiddenLayers3 = () => 64;

const neuralLearn = ([storeTr, storeTe]) => {
  // Creation of neuronet as Perceptron with 3 layers
  // First figure - how many input we will receive
  // Second figure - how many hidden neurons using this formula
  // Third figure - how many classes do we have for identification
  const HIDDEN_LAYER = howManyHiddenLayers3(INPUT_LAYER, storeTr.classes.length);
  const neuralNet = new Synaptic.Architect.Perceptron(
    INPUT_LAYER,
    HIDDEN_LAYER,
    storeTr.classes.length
  );
  // creating trainer
  const trainer = new Synaptic.Trainer(neuralNet);
  const trainingSet = _.values(storeTr.set);
  // training
  // TODO have this options in config
  trainer.train(trainingSet, {
    rate: 0.05,
    log: 10,
    shuffle: true,
  });
  // testing our network on same files
  const activated = _.map(storeTe.set, ({ input }) => _.findIndex(
    _.map(neuralNet.activate(input), Math.round)
  ));
  // logging our results
  _.each(activated, (type, index) => {
    console.log(storeTr.classes[type], '==', storeTe.filenames[index]);
  });
  // kill process
  process.exit(1);
};

module.exports = {
  neuralLearn,
  howManyHiddenLayers2,
};
