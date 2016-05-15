/**
 * author   -  Olenchenko Illia
 * group    -  PM-1 (OM)
 */

#ifndef LAB_6_CPP
#define LAB_6_CPP


#include "./5_lab.cpp"

double rand(double min, double max) {
  return min + (max - min) * (double)rand() / (double)RAND_MAX;
}

int executeSixth() {
  srand (time(NULL));

  int size = 100;
  double min = 0;
  double max = 10;

  vector<double> x = vector<double>(size);
  vector<double> y = vector<double>(size);

  // Fill vectors with rand numbers.
  for (size_t i = 0; i < size; i++) {
    x.push_back(rand(min, max));
    y.push_back(rand(min, max));
  }

  // Checking methods and getting timestamps.
  int timeStampBegin = clock();

  compareDoubleVector(x, y);

  int timeStampCompare = clock();
  coutInterval(timeStampCompare, timeStampBegin, "Standard Method: ");

  compareDoubleVectorDelta(x, y);

  int timeStampDelta = clock();
  coutInterval(timeStampDelta, timeStampCompare, "Delta Method: ");

  int t[4 * 1000];
  compareDoubleVectorDeltaIntervalTree(x, y, t);

  int timeStampInterval = clock();
  coutInterval(timeStampInterval, timeStampDelta, "Interval Tree Method: ");

  return 0;
}

#endif
