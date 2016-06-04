/**
 * author - Illia Olenchenko
 * group  - PM-1 (OM)
 */
#pragma once
#include <cmath>
#include <vector>
#include <iostream>
#include <fstream>
#include "../utils/structs.cpp"
#include "../utils/inout.cpp"

using namespace std;

/**
 * Armijo rule for steps approximation in descent method
 * @method armijo
 * @param  f              main task function
 * @param  gradf          diff for f
 * @param  a              first approximation point
 * @param  step           step that we going to proceed first approximation for Armijo
 * @param  delta          how we should decrease steps? 0 < delta < 1
 * @param  eps            Armijo rule config, 0 < eps < 1
 */
double armijo(
  double (*f)(Point),
  Point (*gradf)(Point),
  Point a,
  double step,
  double delta,
  double eps
) {
  while(f(a - gradf(a) * step) >= (f(a) - eps * step * gradf(a).scalar(gradf(a)))) {
    step = step * delta;
  }
  return step;
}

/**
 * How we should stop our calculations/
 * @method stopCondition
 * @param  f                         main task function
 * @param  approximation             vector of current approximations
 * @param  accuracy                  How strict we should find solution
 * @param  rule                      What rule we should use for stop
 * @return                           bool to stop or not to stop
 */
bool stopCondition(
  double (*f)(Point),
  const vector<Point> approximation,
  double accuracy,
  string rule
) {
  if (rule == "functionApproximation") {
    return fabs(f(approximation.back()) - f(approximation.end()[-2])) >= accuracy;
  } else if (rule == "pointApproximation") {
    Point last = approximation.back();
    Point prelast = approximation.end()[-2];
    return fabs((last - prelast).toDouble()) >= accuracy;
  }
  return false;
}

/**
 * Main method for computing results.
 * Gradient Descending Method. With Armijo choosing rule.
 *
 * @method gradDescMethod
 * @param  f              main task function
 * @param  gradf          diff for f
 * @param  a              first approximation point
 * @param  step           step that we going to proceed first approximation for Armijo
 * @param  delta          how we should decrease steps? 0 < delta < 1
 * @param  eps            Armijo rule config, 0 < eps < 1
 * @param  accuracy       How strict we should find solution
 * @param  rule           What rule we should use for stop
 * @return                status of execution
 */
vector<Point> gradDescMethod(
  double (*f)(Point),
  Point (*gradf)(Point),
  Point a,
  double step,
  double delta,
  double eps,
  double accuracy,
  string rule
) {
  vector<Point> approximation = vector<Point>(1, a);
  vector<double> steps = vector<double>(1, step);
  do {
    // Getting Armijo step
    steps.push_back(armijo(f, gradf, a, steps.back(), delta, eps));
    // Finding next approximation
    a = a - gradf(a) * steps.back();
    approximation.push_back(Point(a));
  } while(stopCondition(f, approximation, accuracy, rule));

  return approximation;
}
