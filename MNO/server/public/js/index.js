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
require('angular-cache');
const _ = require('lodash');
require('angular-material');
require('angular-material/angular-material.css');
const mdTable = require('angular-material-data-table');
require('angular-material-data-table/dist/md-data-table.css');

function runConfig($rootScope) {
  $rootScope.function = 'z = \\sqrt{x^2 + y^2 + 1} + \\frac{x}{2} - \\frac{y}{2}';
  $rootScope.f = (x, y) => Math.sqrt(x * x + y * y + 1) + x / 2 - y / 2;
  $rootScope._ = _;
}
runConfig.$inject = ['$rootScope'];

function config(CacheFactoryProvider) {
  angular.extend(CacheFactoryProvider.defaults, {
    maxAge: 15 * 60 * 1000,
    storageMode: 'localStorage',
  });
}
config.$inject = ['CacheFactoryProvider'];

angular
  .module('mno', ['ngMaterial', 'angular-cache', mdTable])
  .run(runConfig)
  .config(config);

// Application
require('./service/common.js');
require('./descent/descent.js');
require('./plot/plot.js');
