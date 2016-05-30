/**
 * author - Illia Olenchenko
 * group  - PM-1 (OM)
 */

#include <stdlib.h>
#include <iostream>
#include <string>
#include "./core/gradDesc.cpp"
#include "./core/conjGrad.cpp"
#include "./utils/structs.cpp"

using namespace std;

// function as sqrt(x^2 + y^2 + 1) + x/2 - y/2
double f(Point a) {
  return sqrt(a.x * a.x + a.y * a.y + 1) + a.x / 2. - a.y /2.;
}

// grad(f)
Point gradf(Point a) {
  return Point(a.x / sqrt(a.x * a.x + a.y * a.y + 1) + 0.5, a.y / sqrt(a.x * a.x + a.y * a.y + 1) - 0.5);
}

int main(int argc, char* argv[]) {
  // Want to read it from arguments that sent from node that sent from client.
  Point a = Point(10, 10);
  double step = 1;
  double delta = 0.5;
  double eps = 0.5;
  double accuracy = 1e-5;
  string rule = "functionApproximation";

  // Read params from arguments
  for (int i = 1; i < argc; i++) {
    if (i + 1 != argc) {
      string str(argv[i]);
      if (str == "-px") {
        a.setX(atof(argv[i + 1]));
      } else if (str == "-py") {
        a.setY(atof(argv[i + 1]));
      } else if (str == "-s") {
        step = atof(argv[i + 1]);
      } else if (str == "-d") {
        delta = atof(argv[i + 1]);
      } else if (str == "-e") {
        eps = atof(argv[i + 1]);
      } else if (str == "-a") {
        accuracy = atof(argv[i + 1]);
      } else if (str == "-er") {
        rule = argv[i + 1];
      }
    }
  }

  gradDescMethod(f, gradf, a, step, delta, eps, accuracy, rule);
  return 0;
}
