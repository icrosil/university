/**
 * author - Illia Olenchenko
 * group  - PM-1 (OM)
 */
/* eslint no-underscore-dangle: 0 */
/* eslint no-use-before-define: 0 */
/* eslint no-undef: 0 */
/* eslint new-cap: 0 */
/* eslint no-param-reassign: 0 */

const angular = require('angular');
const _ = require('lodash');
const Plotly = require('plotly.js');
require('mathjax');

MathJax.Hub.Config({
  skipStartupTypeset: true,
  messageStyle: 'none',
  'HTML-CSS': {
    showMathMenu: false,
  },
});
MathJax.Hub.Configured();

function plotLink($scope) {
  const vm = this;

  $scope.$on('mno.approximations', (e, d) => {
    _.extend(vm.circles, d);
    vm.circles.z = _.map(_.zip(d.x, d.y), _.spread($scope.$root.f));
    init();
  });
  vm.query = {
    limit: 20,
    page: 1,
  };
  vm.circles = {
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
      z[z.length - 1].push($scope.$root.f(j, i));
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
    Plotly.newPlot('plot', [surface, vm.circles]);
  }
}

plotLink.$inject = ['$scope'];

// Directives
function plotDirective() {
  return {
    restrict: 'E',
    templateUrl: '/js/plot/plot.html',
    controller: plotLink,
    scope: {},
    controllerAs: 'plotCtrl',
  };
}

function mathjaxBindDirective() {
  return {
    restrict: 'A',
    controller: ['$scope', '$element', '$attrs',
        function mjbdController($scope, $element, $attrs) {
          $scope.$watch($attrs.mathjaxBind, (value) => {
            const $script = angular.element('<script type="math/tex">')
              .html(value === undefined ? '' : value);
            $element.html('');
            $element.append($script);
            MathJax.Hub.Queue(['Reprocess', MathJax.Hub, $element[0]]);
          });
        },
      ],
  };
}

angular.module('mno')
  .directive('mnoPlot', plotDirective)
  .directive('mathjaxBind', mathjaxBindDirective);
