/**
 * author   -  Olenchenko Illia
 * group    -  PM-1 (OM)
 */

#ifndef LAB_2_CPP
#define LAB_2_CPP

#include "./1_lab.cpp"

using namespace std;

int executeSecond() {
  // default init.
  vector<vector<vector<double> > > F;
  vector<vector<vector<double> > > G;
  // preparations.
  vector<vector<double> > K2 (4);
  // Calculate intersections. Reading here.
  executeFirst(F, G);
  compare(F, F, K2[0], true);
  compare(F, G, K2[1], true);
  compare(G, G, K2[2], true);
  compare(G, F, K2[3], true);
  // couting.
  // 2 lab Mkli = 0.5 * (po(X,Y) + po(Y,X)).
  cout << "2-nd Lab" << endl;
  coutVectors(K2);
  return 0;
}
// overloading.
vector<vector<double> > executeSecond(vector<vector<vector<double> > >& F,
                  vector<vector<vector<double> > >& G) {
  if (F.empty() || G.empty()) {
    readingFolders(F, G);
  }
  // preparations.
  vector<vector<double> > K2 (4);
  // Calculate intersections.
  compare(F, F, K2[0], true);
  compare(F, G, K2[1], true);
  compare(G, G, K2[2], true);
  compare(G, F, K2[3], true);
  // couting.
  // 2 lab Mkli = 0.5 * (po(X,Y) + po(Y,X)).
  cout << "2-nd Lab" << endl;
  coutVectors(K2);
  return K2;
}

#endif