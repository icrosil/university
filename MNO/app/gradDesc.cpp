/**
 * author - Illia Olenchenko
 * group  - PM-1 (OM)
 */

#include <cmath>
#include <vector>
#include <iostream>
#include "./structs.cpp"

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
 * @return                status of execution
 */
int gradDescMethod(
  double (*f)(Point),
  Point (*gradf)(Point),
  Point a,
  double step,
  double delta,
  double eps
) {
  vector<Point> approximation = vector<Point>(1, a);
  vector<double> steps = vector<double>(1, step);
  do {
    // Getting Armijo step
    steps.push_back(armijo(f, gradf, a, steps.back(), delta, eps));
    // Finding next approximation
    a = a - gradf(a) * steps.back();
    approximation.push_back(Point(a));
  } while(fabs(f(approximation.back()) - f(approximation.end()[-2])) >= 1e-5);

  return 0;
}