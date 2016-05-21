/**
 * author - Illia Olenchenko
 * group  - PM-1 (OM)
 */

#include <stdlib.h>
#include <iostream>
#include "./app/gradDesc.cpp"
#include "./app/conjGrad.cpp"
#include "./app/structs.cpp"

using namespace std;

// function as 10x^2 + y^2
double f(Point a) {
  return 10 * a.x * a.x + a.y * a.y;
}

// grad(f)
Point gradf(Point a) {
  return Point(20 * a.x, 2 * a.y);
}

int main() {
  // Want to read it from arguments that sent from node that sent from client.
  Point a = Point(10, 10);
  double step = 1;
  double delta = 0.5;
  double eps = 0.5;

  gradDescMethod(f, gradf, a, step, delta, eps);
  return 0;
}
