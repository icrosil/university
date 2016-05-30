/**
 * author - Illia Olenchenko
 * group  - PM-1 (OM)
 */

#pragma once

#include "./structs.cpp"
#include <string>

using namespace std;

// Needed to workaround json

int makeJson(
  vector<Point> approximation
) {
  string result("");
  result += "{\"response\":{\"x\":[" + to_string(approximation[0].getX());
  for (size_t i = 1; i < approximation.size(); i++) {
    result += ", " + to_string(approximation[i].getX());
  }
  result += "], \"y\": [" + to_string(approximation[0].getY());
  for (size_t i = 1; i < approximation.size(); i++) {
    result += ", " + to_string(approximation[i].getY());
  }
  result += "]}}";
  cout << result;
  return 0;
}
