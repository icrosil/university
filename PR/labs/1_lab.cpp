/**
 * author   -  Olenchenko Illia
 * group    -  PM-1 (OM)
 */
#ifndef LAB_1_CPP
#define LAB_1_CPP

#include "../helpers/matr_actions.cpp"

using namespace std;

int executeFirst() {
  // default init.
  vector<vector<vector<double> > > F;
  vector<vector<vector<double> > > G;
  readingFolders(F, G);
  // preparations.
  vector<vector<double> > K1 (4);
  // Calculate intersections.
  compare(F, F, K1[0]);
  compare(F, G, K1[1]);
  compare(G, G, K1[2]);
  compare(G, F, K1[3]);
  // couting.
  coutVectors(K1);
  return 0;
}
// Overloading
vector<vector<double> > executeFirst(vector<vector<vector<double> > >& F,
                 vector<vector<vector<double> > >& G) {
  if (F.empty() || G.empty()) {
    readingFolders(F, G);
  }
  vector<vector<double> > K1 (4);
  // Calculate intersections.
  compare(F, F, K1[0]);
  compare(F, G, K1[1]);
  compare(G, G, K1[2]);
  compare(G, F, K1[3]);
  // couting.
  cout << "1-st Lab" << endl;
  coutVectors(K1);
  return K1;
}

#endif