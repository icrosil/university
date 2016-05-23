/**
 * author - Illia Olenchenko
 * group  - PM-1 (OM)
 */

#pragma once

#include "./structs.cpp"
#include <fstream>

using namespace std;

// Needed to workaround json

int makeJson(
  vector<Point> approximation
) {
  ofstream myfile;
  myfile.open ("../server/public/build/descent.json");
  myfile << "{\"response\":{\"x\":[" << approximation[0].getX();
  for (size_t i = 1; i < approximation.size(); i++) {
    myfile << ", " << approximation[i].getX();
  }
  myfile << "], \"y\": [" << approximation[0].getY();
  for (size_t i = 1; i < approximation.size(); i++) {
    myfile << ", " << approximation[i].getY();
  }
  myfile << "]}}";
  myfile.close();
  return 0;
}
