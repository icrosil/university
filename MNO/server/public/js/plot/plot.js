/**
 * author - Illia Olenchenko
 * group  - PM-1 (OM)
 */
/* eslint no-underscore-dangle: 0 */
/* eslint no-use-before-define: 0 */

const angular = require('angular');
const _ = require('lodash');
const Plotly = require('plotly.js');

function plotLink($scope) {
  $scope.$on('mno.approximations', (e, d) => {
    _.extend(circles, d);
    circles.z = _.map(_.zip(d.x, d.y), _.spread(f));
    init();
  });
  function f(x, y) {
    return Math.sqrt(x * x + y * y + 1) + x / 2 - y / 2;
  }
  const circles = {
    x: [],
    y: [],
    z: [],
    mode: 'line',
    marker: {
      color: 'rgb(127, 127, 127)',
      size: 5,
      symbol: 'circle',
      line: {
        color: 'rgb(204, 204, 204)',
        width: 1,
      },
      opacity: 0.9,
    },
    type: 'scatter3d',
  };
  const z = [];
  const x = [];
  const y = [];

  for (let i = -100; i < 100; i++) {
    x.push(i);
    y.push(i);
    z.push([]);
    for (let j = -100; j < 100; j++) {
      z[z.length - 1].push(f(j, i));
    }
  }

  const surface = {
    z,
    x,
    y,
    type: 'surface',
  };

  init();

  function init() {
    Plotly.newPlot('plot', [surface, circles]);
  }
}

plotLink.$inject = ['$scope'];

// Directives
function plotDirective() {
  return {
    restrict: 'E',
    templateUrl: '/js/plot/plot.html',
    link: plotLink,
    controllerAs: 'plot',
  };
}

angular.module('mno')
  .directive('mnoPlot', plotDirective);
