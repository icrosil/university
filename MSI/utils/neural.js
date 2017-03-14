const _ = require('lodash');
const Synaptic = require('synaptic');

const { INPUT_LAYER } = require('../config');

// nSamples / (alpha * (nInput + nOutput)), aplha 2-10
// http://stats.stackexchange.com/questions/181/how-to-choose-the-number-of-hidden-layers-and-nodes-in-a-feedforward-neural-netw
// const howManyHiddenLayers = (nSamples, nInput, nOutput, alpha = 2) => Math.round(
//   nSamples / (alpha * (nInput + nOutput))
// );

const howManyHiddenLayers2 = (nInput, nOutput) => Math.round((0.667 * nInput) + nOutput);

const neuralLearn = ([storeTr, storeTe]) => {
  // Creation of neuronet as Perceptron with 3 layers
  // First figure - how many input we will receive
  // Second figure - how many hidden neurons using this formula
  // Third figure - how many classes do we have for identification
  const HIDDEN_LAYER = howManyHiddenLayers2(INPUT_LAYER, storeTr.classes.length);
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
    rate: 0.3,
    iterations: 40,
    error: 0.01,
    shuffle: true,
    log: 4,
    cost: Synaptic.Trainer.cost.CROSS_ENTROPY,
  });
  // testing our network on stubbed file
  const testIndex = 0;
  const testResult = _.findIndex(
    _.map(neuralNet.activate(storeTe.set[testIndex].input), Math.round)
  );
  // TODO continue here on why error so big check input output and neural network itself
  console.log(storeTr.classes[testResult], '==', storeTe.classes[testIndex]);
  // kill process
  process.exit(1);
};

module.exports = {
  neuralLearn,
};
