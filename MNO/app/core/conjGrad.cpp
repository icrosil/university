/**
 * author - Illia Olenchenko
 * group  - PM-1 (OM)
 */

#include <cmath>
#include <vector>
#include <iostream>
#include <fstream>
#include "../utils/structs.cpp"
#include "../utils/inout.cpp"
#include "./gradDesc.cpp"


// Optimization rule for exact function
double mint(Point s, Point com) {
  double x1 = s.x;
  double x2 = com.x;
  double y1 = s.y;
  double y2 = com.y;
  double a = x2 * x2 + y2 * y2 - (4) * (x2 * x2 + y2 * y2) * (x2 * x2 + y2 * y2) / (y2 - x2) / (y2 - x2);
  double b = 2 * x1 * x2 + 2 * y1 * y2 - (8) * (x2 * x2 + y2 * y2) * (x1 * x2 + y1 * y2) / (y2 - x2) / (y2 - x2);
  double c = x1 * x1 + y1 * y1 + 1 - (4) * (x1 * x2 + y1 * y2) * (x1 * x2 + y1 * y2) / (y2 - x2) / (y2 - x2);
  double t1 = (-b + sqrt(b * b - 4 * a * c)) / 2. / a;
  double t2 = (-b - sqrt(b * b - 4 * a * c)) / 2. / a;
  return a * t1 * t1 + b * t1 + c < a * t2 * t2 + b * t2 + c ? t1 : t2;
}

// b func choosing
// 'fletcher' and 'polak' available
double findB(
  string rule,
  vector<Point> grads,
  int n
) {
  double result = 0;
  if (rule == "fletcher") {
    result = grads.back().toDouble() * grads.back().toDouble() / grads.end()[-2].toDouble() / grads.end()[-2].toDouble();
  } else if (rule == "polak") {
    if (grads.size() % n == 0) {
      result = 0;
    } else {
      result = grads.back().scalar(grads.back() - grads.end()[-2]) / grads.back().scalar(grads.back());
    }
  }
  return result;
}


/**
 * Main method for computing results.
 * Conjugate Gradients Method.
 *
 * @method conjGradMethod
 * @param  f              main task function
 * @param  gradf          diff for f
 * @param  a              first approximation point
 * @param  accuracy       How strict we should find solution
 * @return                status of execution
 */
vector<Point> conjGradMethod(
  double (*f)(Point),
  Point (*gradf)(Point),
  Point a,
  double accuracy,
  string rule,
  int polakN
) {
  // Setting first steps and default values
  vector<Point> approximation = vector<Point>(1, a);
  vector<Point> grads = vector<Point>(1, gradf(approximation.back()));
  vector<double> b = vector<double>(0);
  vector<Point> d = vector<Point>(1, gradf(approximation.back()) * (-1));
  vector<double> steps = vector<double>(0);
  while(grads.back().toDouble() > accuracy) {
    // Finding next step we will use by optimization problem
    steps.push_back(mint(approximation.back(), d.back()));
    // Setting next approximation
    approximation.push_back(approximation.back() + (d.back() * steps.back()));
    // Adding new gradient of new approximation
    grads.push_back(gradf(approximation.back()));
    // Calculating B by one of 2 rules
    b.push_back(findB(rule, grads, polakN));
    // Adding new value for exit rule
    d.push_back(grads.back() * (-1) + d.back() * b.back());
  }

  return approximation;
}
