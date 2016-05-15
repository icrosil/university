/**
 * author   -  Olenchenko Illia
 * group    -  PM-1 (OM)
 */

#ifndef LAB_3_CPP
#define LAB_3_CPP
int N = 15;

#include "./2_lab.cpp"

using namespace std;

int executeThird() {
  // default init.
  vector<vector<vector<double> > > F;
  vector<vector<vector<double> > > G;
  readingFolders(F, G);
  // preparations.
  vector<vector<double> > deltaF = vector<vector<double> >(N, vector<double>(F.size()));
  vector<vector<double> > deltaG = vector<vector<double> >(N, vector<double>(G.size()));
  vector<double> kStub;
  vector<vector<vector<double> > > FF = kliToikl(compare(F, F, kStub));
  vector<vector<vector<double> > > FG = kliToikl(compare(F, G, kStub, true));
  vector<vector<vector<double> > > GG = kliToikl(compare(G, G, kStub));
  vector<vector<vector<double> > > GF = kliToikl(compare(G, F, kStub, true));
  vector<vector<double> > countF = vector<vector<double> >(N, vector<double> (7));
  vector<vector<double> > countG = vector<vector<double> >(N, vector<double> (7));
  double I[8] = {1.0, 0.95, 0.9, 0.8, 0.7, 0.6, 0.5, 0.0};

  // computing.
  computeDelta(F, FF, FG, deltaF, N);
  computeDelta(G, GG, GF, deltaG, N);
  computeCounts(F, G, deltaF, deltaG, countF, countG, I, N);
  // couting.
  coutInfluense(F, countF, deltaF, I, N, "D2");
  coutInfluense(G, countG, deltaG, I, N, "D3");
  return 0;
}

#endif
