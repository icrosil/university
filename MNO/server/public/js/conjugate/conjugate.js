/**
 * author - Illia Olenchenko
 * group  - PM-1 (OM)
 */
/* eslint new-cap: 0 */

const angular = require('angular');
const _ = require('lodash');

// Controllers
function conjugateController($scope, common, CacheFactory) {
  const vm = this;

  let conjugateCache;

  if (!CacheFactory.get('conjugate')) {
    conjugateCache = CacheFactory('conjugate');
  }


  // Descent variables
  const conjugateDefault = {
    point: {
      x: 10,
      y: 10,
    },
    accuracy: 1e-5,
    compile: false,
  };
  vm.conjugate = _.defaults(conjugateCache.get('/options') || {}, conjugateDefault);
  vm.sendConjugate = (options) => {
    conjugateCache.put('/options', angular.copy(options));
    common.sendConjugate(options)
      .then((response) => {
        $scope.$broadcast('mno.approximations.plotConjugate', response.data.response);
      });
  };
  vm.clearCache = () => {
    conjugateCache.put('/options', {});
    vm.conjugate = _.defaults(conjugateCache.get('/options') || {}, conjugateDefault);
  };
}

conjugateController.$inject = ['$scope', 'common', 'CacheFactory'];

// Directives
function conjugateDirective() {
  return {
    restrict: 'E',
    templateUrl: '/js/conjugate/conjugate.html',
    controller: conjugateController,
    controllerAs: 'conjugateCtrl',
  };
}

angular.module('mno')
  .directive('mnoConjugate', conjugateDirective);
