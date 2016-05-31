/**
 * author - Illia Olenchenko
 * group  - PM-1 (OM)
 */
/* eslint new-cap: 0 */

const angular = require('angular');
const _ = require('lodash');

// Controllers
function descentController($scope, common, CacheFactory) {
  const vm = this;

  let descentCache;

  if (!CacheFactory.get('descent')) {
    descentCache = CacheFactory('descent');
  }

  vm.exitRules = [
    {
      name: 'Function approximation',
      value: 'functionApproximation',
    },
    {
      name: 'Point approximation',
      value: 'pointApproximation',
    },
  ];

  // Descent variables
  const descentDefault = {
    epsilon: 0.5,
    delta: 0.5,
    step: 1,
    point: {
      x: 10,
      y: 10,
    },
    accuracy: 1e-5,
    exitRule: vm.exitRules[0].value,
    compile: false,
  };
  vm.descent = _.defaults(descentCache.get('/options') || {}, descentDefault);
  vm.sendDescent = (options) => {
    descentCache.put('/options', angular.copy(options));
    common.sendDescent(options)
      .then((response) => {
        $scope.$broadcast('mno.approximations', response.data.response);
      });
  };
  vm.clearCache = () => {
    descentCache.put('/options', {});
    vm.descent = _.defaults(descentCache.get('/options') || {}, descentDefault);
  };
}

descentController.$inject = ['$scope', 'common', 'CacheFactory'];

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
