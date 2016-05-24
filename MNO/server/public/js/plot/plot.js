/**
 * author - Illia Olenchenko
 * group  - PM-1 (OM)
 */

const angular = require('angular');
const d3 = require('d3');

// Controllers
function plotController() {
  let yaw = 0.5;
  let pitch = 0.5;
  const width = 700;
  const height = 400;
  let drag = false;

  function dataFromFormular(func) {
    const output = [];
    for (let x = -20; x < 20; x++) {
      const f0 = [];
      output.push(f0);
      for (let y = -20; y < 20; y++) {
        f0.push(func(x, y));
      }
    }
    return output;
  }

  const surfaces = [{
    name: 'Dataset 1',
    data: dataFromFormular((x, y) => Math.sin(Math.sqrt(x * x + y * y) / 5 * Math.PI) * 50),
  }, {
    name: 'Dataset 2',
    data: dataFromFormular((x, y) => Math.cos(x / 15 * Math.PI) *
      Math.cos(y / 15 * Math.PI) * 60 + Math.cos(x / 8 * Math.PI) *
      Math.cos(y / 10 * Math.PI) * 40),
  }, {
    name: 'Dataset 3',
    data: dataFromFormular((x, y) => -(Math.cos(Math.sqrt(x * x + y * y) / 6 * Math.PI) + 1) *
      300 / (Math.pow(x * x + y * y + 1, 0.3) + 1) + 50),
  }];
  // const selected = surfaces[0];

  const ul = d3.select('plot')
    .append('ul');
  const svg = d3.select('plot')
    .append('svg')
    .attr('height', height)
    .attr('width', width);

  const group = svg.append('g');

  // here is some problem
  const md = group.data([surfaces[0].data])
    .enter()
    .surface3D(width, height)
    .surfaceHeight((d) => d)
    .surfaceColor((d) => {
      const c = d3.hsl((d + 100), 0.6, 0.5).rgb();
      return `rgb(${parseInt(c.r, 10)},${parseInt(c.g, 10)},${parseInt(c.b, 10)})`;
    });

  ul.selectAll('li')
    .data(surfaces)
    .enter()
    .append('li')
    .html((d) => d.name)
    .on('mousedown', () => {
      md.data([d3.select(this).datum().data]).surface3D()
        .transition()
        .duration(500)
        .surfaceHeight((d) => d)
        .surfaceColor((d) => {
          const c = d3.hsl((d + 100), 0.6, 0.5).rgb();
          return `rgb(${parseInt(c.r, 10)},${parseInt(c.g, 10)},${parseInt(c.b, 10)})`;
        });
    });

  svg
    .on('mousedown', () => {
      drag = [d3.mouse(this), yaw, pitch];
    })
    .on('mouseup', () => {
      drag = false;
    })
    .on('mousemove', () => {
      if (drag) {
        const mouse = d3.mouse(this);
        yaw = drag[1] - (mouse[0] - drag[0][0]) / 50;
        pitch = drag[2] + (mouse[1] - drag[0][1]) / 50;
        pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
        md.turntable(yaw, pitch);
      }
    });
}

function plotLink() {
  const Surface = (node) => {
    let heightFunction;
    let colorFunction;
    let timer;
    const transformPrecalc = [];
    let displayWidth = 300;
    let displayHeight = 300;
    let zoom = 1;
    let trans;

    const transformPoint = (point) => {
      const x = transformPrecalc[0] * point[0] + transformPrecalc[1] * point[1] +
        transformPrecalc[2] * point[2];
      const y = transformPrecalc[3] * point[0] + transformPrecalc[4] * point[1] +
        transformPrecalc[5] * point[2];
      const z = transformPrecalc[6] * point[0] + transformPrecalc[7] * point[1] +
        transformPrecalc[8] * point[2];
      return [x, y, z];
    };

    const getHeights = () => {
      const data = node.datum();
      const output = [];
      const xlength = data.length;
      const ylength = data[0].length;
      for (let x = 0; x < xlength; x++) {
        const t = [];
        output.push(t);
        for (let y = 0; y < ylength; y++) {
          const value = heightFunction(data[x][y], x, y);
          t.push(value);
        }
      }
      return output;
    };
    const getTransformedData = () => {
      const data = node.datum();
      if (!heightFunction) {
        return [
          [],
        ];
      }
      let t;
      const output = [];
      const heights = getHeights();
      const xlength = data.length;
      const ylength = data[0].length;
      for (let x = 0; x < xlength; x++) {
        t = [];
        output.push(t);
        for (let y = 0; y < ylength; y++) {
          t.push(transformPoint([(x - xlength / 2) / (xlength * 1.41) *
            displayWidth * zoom, heights[x][y] * zoom, (y - ylength / 2) /
            (ylength * 1.41) * displayWidth * zoom]));
        }
      }
      return output;
    };
    const renderSurface = () => {
      const originalData = node.datum();
      const data = getTransformedData();
      const xlength = data.length;
      const ylength = data[0].length;
      const d0 = [];
      // const idx = 0;
      for (let x = 0; x < xlength - 1; x++) {
        for (let y = 0; y < ylength - 1; y++) {
          const depth = data[x][y][2] + data[x + 1][y][2] + data[x + 1][y + 1][2] +
            data[x][y + 1][2];
          d0.push({
            path: `M${(data[x][y][0] + displayWidth / 2).toFixed(10)},
              ${(data[x][y][1] + displayHeight / 2).toFixed(10)}
              L${(data[x + 1][y][0] + displayWidth / 2).toFixed(10)},
              ${(data[x + 1][y][1] + displayHeight / 2).toFixed(10)}
              L${(data[x + 1][y + 1][0] + displayWidth / 2).toFixed(10)},
              ${(data[x + 1][y + 1][1] + displayHeight / 2).toFixed(10)}
              L${(data[x][y + 1][0] + displayWidth / 2).toFixed(10)},
              ${(data[x][y + 1][1] + displayHeight / 2).toFixed(10)}Z`,
            depth,
            data: originalData[x][y],
          });
        }
      }
      d0.sort((a, b) => b.depth - a.depth);
      let dr = node.selectAll('path').data(d0);
      dr.enter().append('path');
      if (trans) {
        dr = dr.transition().delay(trans.delay()).duration(trans.duration());
      }
      dr.attr('d', (d) => d.path);
      if (colorFunction) {
        dr.attr('fill', (d) => colorFunction(d.data));
      }
      trans = false;
    };

    this.setZoom = (zoomLevel) => {
      zoom = zoomLevel;
      if (timer) clearTimeout(timer);
      timer = setTimeout(renderSurface);
    };

    this.renderSurface = renderSurface;
    this.setTurtable = (yaw, pitch) => {
      const cosA = Math.cos(pitch);
      const sinA = Math.sin(pitch);
      const cosB = Math.cos(yaw);
      const sinB = Math.sin(yaw);
      transformPrecalc[0] = cosB;
      transformPrecalc[1] = 0;
      transformPrecalc[2] = sinB;
      transformPrecalc[3] = sinA * sinB;
      transformPrecalc[4] = cosA;
      transformPrecalc[5] = -sinA * cosB;
      transformPrecalc[6] = -sinB * cosA;
      transformPrecalc[7] = sinA;
      transformPrecalc[8] = cosA * cosB;
      if (timer) clearTimeout(timer);
      timer = setTimeout(renderSurface);
      return this;
    };
    this.setTurtable(0.5, 0.5);
    this.surfaceColor = (callback) => {
      colorFunction = callback;
      if (timer) clearTimeout(timer);
      timer = setTimeout(renderSurface);
      return this;
    };
    this.surfaceHeight = (callback) => {
      heightFunction = callback;
      if (timer) clearTimeout(timer);
      timer = setTimeout(renderSurface);
      return this;
    };
    this.transition = () => {
      const transition = d3.selection.prototype.transition.bind(node)();
      // const colourFunction = null;
      // const heightFunction = null;
      transition.surfaceHeight = this.surfaceHeight;
      transition.surfaceColor = this.surfaceColor;
      trans = transition;
      return transition;
    };
    this.setHeight = (height) => {
      if (height) {
        displayHeight = height;
      }
    };
    this.setWidth = (width) => {
      if (width) {
        displayWidth = width;
      }
    };
  };
  d3.selection.prototype.surface3D = (width, height) => {
    if (!this.node().__surface__) {
      this.node().__surface__ = new Surface(this);
    }
    const surface = this.node().__surface__;
    this.turntable = surface.setTurtable;
    this.surfaceColor = surface.surfaceColor;
    this.surfaceHeight = surface.surfaceHeight;
    this.zoom = surface.setZoom;
    surface.setHeight(height);
    surface.setWidth(width);
    this.transition = surface.transition.bind(surface);
    return this;
  };
}

// plotController.$inject = ['$scope', '$http'];

// Directives
function plotDirective() {
  return {
    restrict: 'E',
    templateUrl: '/js/plot/plot.html',
    link: plotLink,
    controller: plotController,
    controllerAs: 'plot',
  };
}

angular.module('mno')
  .directive('mnoPlot', plotDirective);
