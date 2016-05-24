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

angular.module('mno', ['ngMaterial']);

// Application
require('./service/common.js');
require('./descent/descent.js');
require('./plot/plot.js');
