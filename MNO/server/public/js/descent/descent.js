/**
 * author - Illia Olenchenko
 * group  - PM-1 (OM)
 */

const angular = require('angular');

// Controllers
function descentController($scope, common) {
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
  vm.sendDescent = (options) => {
    common.sendDescent(options)
      .then((response) => {
        $scope.$broadcast('mno.approximations', response.data.response);
      });
  };
}

descentController.$inject = ['$scope', 'common'];

// Directives
function descentDirective() {
  return {
    restrict: 'E',
    templateUrl: '/js/descent/descent.html',
    controller: descentController,
    controllerAs: 'descentCtrl',
  };
}

angular.module('mno')
  .directive('mnoDescent', descentDirective);
