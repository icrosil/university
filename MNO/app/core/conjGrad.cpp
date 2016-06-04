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
  double accuracy
) {
  vector<Point> approximation = vector<Point>(1, a);
  vector<Point> grads = vector<Point>(1, gradf(approximation.back()));
  vector<double> b = vector<double>(0);
  vector<Point> d = vector<Point>(1, gradf(approximation.back()) * (-1));
  vector<double> steps = vector<double>(0);
  while(grads.back().toDouble() > accuracy) {
    steps.push_back(mint(approximation.back(), d.back()));
    approximation.push_back(approximation.back() + (d.back() * steps.back()));
    grads.push_back(gradf(approximation.back()));
    b.push_back(grads.back().toDouble() * grads.back().toDouble() / grads.end()[-2].toDouble() / grads.end()[-2].toDouble());
    d.push_back(grads.back() * (-1) + d.back() * b.back());
  }

  return approximation;
}
