/**
 * author - Illia Olenchenko
 * group  - PM-1 (OM)
 */

const angular = require('angular');

// Services
function commonService($http) {
  this.sendDescent = (params) => $http.post('descent', params);
  this.sendConjugate = (params) => $http.post('conjugate', params);
}

commonService.$inject = ['$http'];

angular.module('mno')
  .service('common', commonService);
