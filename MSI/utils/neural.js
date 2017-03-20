const _ = require('lodash');
const Synaptic = require('synaptic');

const { INPUT_LAYER, SQUASH, TR_OPTIONS } = require('../config');

// nSamples / (alpha * (nInput + nOutput)), aplha 2-10
// http://stats.stackexchange.com/questions/181/how-to-choose-the-number-of-hidden-layers-and-nodes-in-a-feedforward-neural-netw
const howManyHiddenLayers = (nSamples, nInput, nOutput, alpha = 2) => Math.round(
  nSamples / (alpha * (nInput + nOutput))
);

/**
 * auto calculated amount of neurons for hidden layer
 * @method howManyHiddenLayers2
 * @param  {number}             nInput  amount of inputs
 * @param  {number}             nOutput amount of outputs
 * @return {number}                     amount of neurons for hidden layer
 */
const howManyHiddenLayers2 = (nInput, nOutput) => Math.round((0.667 * nInput) + nOutput);
// static amount of neurons in hidden layer
const howManyHiddenLayers3 = () => 64;

/**
 * main function for learning on images
 * @method neuralLearn
 * @param  {store}    storeTr training store with filenames classes and set of inputs and outs
 * @param  {store}    storeTe -//-
 * @return {undefined}
 */
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
  // setting custom activate function on hidden layer
  neuralNet.layers.hidden[0].set({
    squash: SQUASH,
  });
  // creating trainer
  const trainer = new Synaptic.Trainer(neuralNet);
  const trainingSet = _.values(storeTr.set);
  // training with timings
  console.time('train');
  trainer.train(trainingSet, TR_OPTIONS);
  console.timeEnd('train');

  // testing our network on same files
  const activated = _.map(storeTe.set, ({ input }) => neuralNet.activate(input));
  const activatedMapped = _.map(activated, active => _.findIndex(
    _.map(active, Math.round)
  ));
  // logging our results
  _.each(activatedMapped, (type, index) => {
    console.log(storeTr.classes[type], '==', storeTe.filenames[index]);
  });
  // kill process
  process.exit(1);
};

module.exports = {
  neuralLearn,
  howManyHiddenLayers,
  howManyHiddenLayers2,
};
