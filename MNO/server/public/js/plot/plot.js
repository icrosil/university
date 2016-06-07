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

function plotLink($scope, $timeout, CacheFactory) {
  const vm = this;

  // Retrieving data
  $scope.$on(`mno.approximations.${vm.id}`, (e, d) => {
    _.extend(vm.plotParams.circles, d);
    vm.plotParams.circles.z = _.map(_.zip(d.x, d.y), _.spread($scope.$root.f));
    vm.redraw();
  });

  // Cache instance
  let plotCache;

  if (!CacheFactory.get(`plot${vm.id}`)) {
    plotCache = CacheFactory(`plot${vm.id}`);
  }

  // Settering data
  const plotDefault = {
    query: {
      limit: 20,
      page: 1,
    },
    circles: {
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
      name: 'Approximations',
    },
    sizes: {
      from: -50,
      to: 50,
      get times() {
        return Math.abs(this.from) + Math.abs(this.to);
      },
    },
    surface: {
      z: [],
      x: [],
      y: [],
      type: 'surface',
      name: 'Real function',
    },
  };

  vm.plotParams = _.defaults(plotCache.get('/options') || {}, plotDefault);

  function setPoints() {
    const x = vm.plotParams.surface.x;
    const y = vm.plotParams.surface.y;
    const z = vm.plotParams.surface.z;
    x.length = 0;
    y.length = 0;
    z.length = 0;
    _.times(vm.plotParams.sizes.times + 1, (ival) => {
      const i = ival - vm.plotParams.sizes.times / 2;
      x.push(i);
      y.push(i);
      z.push([]);
      _.times(vm.plotParams.sizes.times + 1, (jval) => {
        const j = jval - vm.plotParams.sizes.times / 2;
        z[z.length - 1].push($scope.$root.f(j, i));
      });
    });
  }
  vm.redraw = () => {
    plotCache.put('/options', angular.copy(vm.plotParams));
    setPoints();
    Plotly.redraw(vm.id);
  };

  function init() {
    setPoints();
    $timeout(_.partial(Plotly.newPlot, vm.id, [vm.plotParams.surface, vm.plotParams.circles]));
  }

  init();
}

plotLink.$inject = ['$scope', '$timeout', 'CacheFactory'];

// Directives
function plotDirective() {
  return {
    restrict: 'E',
    templateUrl: '/js/plot/plot.html',
    controller: plotLink,
    scope: {
      id: '=',
    },
    controllerAs: 'plotCtrl',
    bindToController: true,
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
