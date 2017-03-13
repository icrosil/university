// nSamples / (alpha * (nInput + nOutput)), aplha 2-10
// http://stats.stackexchange.com/questions/181/how-to-choose-the-number-of-hidden-layers-and-nodes-in-a-feedforward-neural-netw
const howManyHiddenLayers = (nSamples, nInput, nOutput, alpha = 2) => Math.round(
  nSamples / (alpha * (nInput + nOutput))
);

const howManyHiddenLayers2 = (nInput, nOutput) => Math.round((0.667 * nInput) + nOutput);

module.exports = {
  howManyHiddenLayers,
  howManyHiddenLayers2,
};
