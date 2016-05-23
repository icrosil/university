/**
 * author - Illia Olenchenko
 * group  - PM-1 (OM)
 */

// SASS
require('../scss/index.scss');

// Angular
const angular = require('angular');
require('angular-material');
require('angular-material/angular-material.css');
require('d3');

// Controllers
function mainController($scope, $http) {
  const vm = this;

  vm.exitRules = [
    {
      name: 'Function approximation',
      value: 'functionApproximation',
    },
  ];

  // Descent variables
  vm.descent = {
    epsilon: 0.5,
    delta: 0.5,
    step: 1,
    point: {
      x: 10,
      y: 10,
    },
    accuracy: 1e-5,
    exitRule: vm.exitRules[0],
  };
  vm.sendDescent = function sendDescent() {
    $http.post('descent', vm.descent);
  };
}
mainController.$inject = ['$scope', '$http'];

angular.module('mno', ['ngMaterial'])
  .controller('mainController', mainController);
