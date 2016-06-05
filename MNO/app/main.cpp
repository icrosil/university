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
  double x = a.x;
  double y = a.y;
  return sqrt(x * x + y * y + 1) + x / 2. - y /2.;
}

// grad(f)
Point gradf(Point a) {
  double x = a.x;
  double y = a.y;
  return Point(x / sqrt(x * x + y * y + 1) + 0.5, y / sqrt(x * x + y * y + 1) - 0.5);
}

int main(int argc, char* argv[]) {
  // Want to read it from arguments that sent from node that sent from client.
  Point a = Point(10, 10);
  double step = 1;
  double delta = 0.5;
  double eps = 0.5;
  double accuracy = 1e-5;
  int polakN = 5;
  string rule = "polak";
  string method = "conjugate";

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
      } else if (str == "-m") {
        method = argv[i + 1];
      } else if (str == "-n") {
        polakN = atoi(argv[i + 1]);
      }
    }
  }

  vector<Point> results;
  if (method == "descent") {
    results = gradDescMethod(f, gradf, a, step, delta, eps, accuracy, rule);
  } else if (method == "conjugate") {
    results = conjGradMethod(f, gradf, a, accuracy, rule, polakN);
  }

  makeJson(results);
  return 0;
}
