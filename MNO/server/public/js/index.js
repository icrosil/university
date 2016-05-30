/**
 * author - Illia Olenchenko
 * group  - PM-1 (OM)
 */
/* eslint no-param-reassign: 0 */
/* eslint no-useless-escape: 0 */

// SASS
require('../scss/index.scss');

// Angular
const angular = require('angular');
const _ = require('lodash');
require('angular-material');
require('angular-material/angular-material.css');

function runConfig($rootScope) {
  $rootScope.function = 'z = \\sqrt{x^2 + y^2 + 1} + \\frac{x}{2} - \\frac{y}{2}';
  $rootScope.f = (x, y) => Math.sqrt(x * x + y * y + 1) + x / 2 - y / 2;
  $rootScope._ = _;
}
runConfig.$inject = ['$rootScope'];

angular
  .module('mno', ['ngMaterial'])
  .run(runConfig);

// Application
require('./service/common.js');
require('./descent/descent.js');
require('./plot/plot.js');
