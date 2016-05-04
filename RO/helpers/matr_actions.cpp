/**
 * author   -  Olenchenko Illia
 * group    -  PM-1 (OM)
 */

#ifndef MATR_ACTIONS
#define MATR_ACTIONS

#include <vector>
#include <cmath>
#include <algorithm>
#include "structures.cpp"
#include "in_out_helper.cpp"

using namespace std;

// Sort matr by Vectors.
int sortVector(vector<double>& U) {
  sort( U.begin(), U.end() );
  return 0;
}

// Compare intersections double in vector. Fixing y, searching in x.
double compareDoubleVector(vector<double> y, vector<double> x) {
  int countB = 0;
  double g = 3;
  double jMinus, jPlus;
  int n = (double)x.size();
  int N = (double)(n * (n - 1)) / 2.;
  int m = (double)y.size();
  double h = 0;
  sortVector(x);
  sortVector(y);
  for (size_t i = 0; i < n - 1; i++) {
    for (size_t j = i + 1; j < n; j++) {
      int countA = 0;
      for (size_t k = 0; k < m; k++) {
        if (y[k] > x[i] && y[k] < x[j]) {
          countA++;
        }
      }
      h = (double)countA / m;
      jMinus = (m * h + g * g / 2. - g * sqrt( h * (1 - h) * m + g * g / 4. )) / (m + g * g);
      jPlus = (m * h + g * g / 2. + g * sqrt( h * (1 - h) * m + g * g / 4. )) / (m + g * g);
      Interval interval (jMinus, jPlus);
      double inter = (double)(j - i) / (n + 1);
      if (interval.inRange(inter)) {
        countB++;
      }
    }
  }
  double response = (double)countB / N;
  return response;
}

// Comparing function.
// returns A matr of ROs.
vector<vector<vector<double> > > compare(vector<vector<vector<double> > > F,
                                         vector<vector<vector<double> > > G,
                                         vector<double>& K,
                                         bool K2Flag = false) {
  vector<vector<vector<double> > > A;
  for (size_t k = 0; k < F.size(); k++) {
    A.push_back(vector<vector<double> > ());
    for (size_t l = 0; l < G.size(); l++) {
      if (k == l && F == G) continue;
      A[k].push_back(vector<double> ());
      for (size_t j = 0; j < F[k].size(); j++) {
        double roXY = compareDoubleVector(F[k][j], G[l][j]);
        if (K2Flag) {
          roXY = (roXY + compareDoubleVector(G[l][j], F[k][j])) / 2.;
        }
        A[k][A[k].size() - 1].push_back(roXY);
      }
    }
  }

  vector<vector<double> > ro (A.size(), vector<double> (15, 0));
  for (size_t k = 0; k < A.size(); k++) {
    for (size_t i = 0; i < 15; i++) {
      for (size_t l = 0; l < A[k].size(); l++) {
        ro[k][i] += A[k][l][i];
      }
      ro[k][i] /= (double)(A[k].size());
    }
  }
  K = vector<double> (15, 0);
  for (size_t i = 0; i < 15; i++) {
    for (size_t k = 0; k < ro.size(); k++) {
      K[i] += ro[k][i];
    }
    K[i] /= ro.size();
  }
  return A;
}
vector<vector<vector<double> > > kliToikl(vector<vector<vector<double> > > A) {
  vector<vector<vector<double> > > response;
  for (size_t i = 0; i < 15; i++) {
    response.push_back(vector<vector<double> >());
    for (size_t k = 0; k < A.size(); k++) {
      response[i].push_back(vector<double>());
      for (size_t l = 0; l < A[k].size(); l++) {
        response[i][k].push_back(A[k][l][i]);
      }
    }
  }
  return response;
}

int computeDelta(vector<vector<vector<double> > > X,
                 vector<vector<vector<double> > > XX,
                 vector<vector<vector<double> > > XY,
                 vector<vector<double> >& deltaF,
                 int N) {
  for (int k = 0; k < X.size(); k++) {
    for (int i = 0; i < N; i++) {
      double a = *max_element(XX[i][k].begin(), XX[i][k].end());
      double b = *min_element(XY[i][k].begin(), XY[i][k].end());
      deltaF[i][k] = abs(a - b);
    }
  }
  return 0;
}

int computeCounts(vector<vector<vector<double> > > F,
                  vector<vector<vector<double> > > G,
                  vector<vector<double> >& deltaF,
                  vector<vector<double> >& deltaG,
                  vector<vector<double> >& countF,
                  vector<vector<double> >& countG,
                  double I[],
                  int N) {
  for (int i = 0; i < N; i++) {
    for (int k = 0; k < F.size(); k++) {
      for (int j = 0; j < 7; j++) {
        if (deltaF[i][k] >= I[j + 1] && deltaF[i][k] < I[j]) countF[i][j]++;
      }
    }
    for (int k = 0; k < G.size(); k++) {
      for (int j = 0; j < 7; j++) {
        if (deltaG[i][k] >= I[j + 1] && deltaG[i][k] < I[j]) countG[i][j]++;
      }
    }
  }
  return 0;
}

int findMinX(vector<Point> points) {
  int result = 0;
  for (size_t i = 1; i < points.size(); i++) {
    if (points[i].getX() < points[result].getX()) {
      result = i;
    }
  }
  return result;
}
int findMaxX(vector<Point> points) {
  int result = 0;
  for (size_t i = 1; i < points.size(); i++) {
    if (points[i].getX() > points[result].getX()) {
      result = i;
    }
  }
  return result;
}
int findMaxY(vector<Point> points, Line diag) {
  int result = 0;
  double dResult = diag.dToPoint(points[result]);
  for (size_t i = 1; i < points.size(); i++) {
    double dI = diag.dToPoint(points[i]);
    if (dI > dResult) {
      result = i;
      dResult = dI;
    }
  }
  return result;
}
int findMinY(vector<Point> points, Line diag) {
  int result = 0;
  double dResult = diag.dToPoint(points[result]);
  for (size_t i = 1; i < points.size(); i++) {
    double dI = diag.dToPoint(points[i]);
    if (dI < dResult) {
      result = i;
      dResult = dI;
    }
  }
  return result;
}
double getAngleBetweenLines(Line x1, Line x2) {
  double result = (x1.getA() * x2.getB() - x2.getA() * x1.getB()) / (x1.getA() * x2.getA() + x1.getB() * x2.getB());
  if (x1.getA() * x2.getA() + x1.getB() * x2.getB() == 0) {
    return 90;
  }
  return (atan(result) * 180 / M_PI);
}
vector<Point> roundPointsClockVersa(vector<Point> points, int left, int right, int &top, int &bot) {
  Point item = points[left];
  // true angle
  double angle = getAngleBetweenLines(
    Line(Point(0, 0), Point(points[right].getX() - points[left].getX(), points[right].getY() - points[left].getY())),
    Line(Point(0, 0), Point(1, 0))
  );
  double c = cos(angle * M_PI / 180.0);
  double s = sin(angle * M_PI / 180.0);
  for (size_t i = 0; i < points.size(); i++) {
    // rotate
    double xR = (points[i].getX() - item.getX()) * c  - (points[i].getY() - item.getY()) * s + item.getX();
    double yR = (points[i].getX() - item.getX()) * s  + (points[i].getY() - item.getY()) * c + item.getY();
    points[i].setX(xR);
    points[i].setY(yR);
  }
  if (points[top].getY() < points[bot].getY()) {
    int mess = top;
    top = bot;
    bot = mess;
  }
  return points;
}
Line findMaxLine(vector<Point> points, int &left, int &right) {
  Line response = Line(points[0], points[0]);
  left = right = 0;
  for (size_t i = 0; i < points.size(); i++) {
    for (size_t j = 0; j < points.size(); j++) {
      Line item = Line(points[i], points[j]);
      if (item.getLength() > response.getLength()) {
        response = item;
        if (points[i].getX() < points[j].getX()) {
          left = i;
          right = j;
        } else {
          left = j;
          right = i;
        }
      }
    }
  }
  return response;
}
vector<Point> translatePointsToO(vector<Point> points, int bottom, int left) {
  double b = points[bottom].getY();
  double l = points[left].getX();
  for (size_t i = 0; i < points.size(); i++) {
    double x = points[i].getX() - l;
    double y = points[i].getY() - b;
    points[i].setX(x);
    points[i].setY(y);
  }
  return points;
}
vector<Point> translatePointsToOLeft(vector<Point> points, int bottom, int right) {
  double b = points[bottom].getY();
  double l = points[right].getX();
  for (size_t i = 0; i < points.size(); i++) {
    double x = points[i].getX() - l;
    double y = points[i].getY() - b;
    points[i].setX(x);
    points[i].setY(y);
  }
  return points;
}
vector<Point> translatePointsToOBot(vector<Point> points, int top, int right, int bot, int left) {
  points = translatePointsToO(points, bot, left);
  double b = points[top].getY();
  for (size_t i = 0; i < points.size(); i++) {
    double y = points[i].getY() - b;
    points[i].setY(y);
  }
  return points;
}
vector<Point> translatePointsToORightLeft(vector<Point> points, int bottom, int right, int left) {
  points = translatePointsToO(points, bottom, left);
  double b = points[bottom].getY();
  double l = points[right].getX() / 2.;
  for (size_t i = 0; i < points.size(); i++) {
    double x = points[i].getX() - l;
    double y = points[i].getY() - b;
    points[i].setX(x);
    points[i].setY(y);
  }
  return points;
}
vector<Point> translatePointsToORightLeftY(vector<Point> points, int top, int bottom, int right, int left) {
  points = translatePointsToO(points, bottom, left);
  double b = points[top].getY() / 2.;
  for (size_t i = 0; i < points.size(); i++) {
    double y = points[i].getY() - b;
    points[i].setY(y);
  }
  return points;
}
vector<Point> shrinkFrom(vector<Point> points, int top, int side, double &coef) {
  coef = abs(points[side].getX() / points[top].getY());
  for (size_t i = 0; i < points.size(); i++) {
    double newV = points[i].getX() / coef;
    points[i].setX(newV);
  }
  return points;
}
vector<Point> growTo(vector<Point> points, int top, int side, double &coef) {
  coef = abs(points[top].getY() / points[side].getX());
  for (size_t i = 0; i < points.size(); i++) {
    double newV = points[i].getX() * coef;
    points[i].setX(newV);
  }
  return points;
}
vector<Point> shrinkFromTwoSides(vector<Point> points, int top, int left, int right, double &coefFT) {
  coefFT = abs(Line(points[left], points[right]).getLength() / points[top].getY());
  for (size_t i = 0; i < points.size(); i++) {
    double newV = points[i].getX() / (coefFT);
    points[i].setX(newV);
  }
  return points;
}
vector<Point> growToTwoSides(vector<Point> points, int top, int left, int right, int bot, double &coefFT) {
  coefFT = abs(points[right].getX() / (Line(points[top], Point(points[top].getX(), 0)).getLength() * 2));
  for (size_t i = 0; i < points.size(); i++) {
    double newV = points[i].getY() * (coefFT);
    points[i].setY(newV);
  }
  return points;
}
Point centreByRect(Point height, Point width) {
  return Point(width.getX() / 2., height.getY() / 2.);
}
Point centreByWeight(vector<Point> points) {
  Point response;
  double x = 0,
         y = 0;
  for (size_t i = 0; i < points.size(); i++) {
    x += points[i].getX();
    y += points[i].getY();
  }
  x /= points.size();
  y /= points.size();
  response = Point(x, y);
  return response;
}
Point centreByRect(Point height, Point widthLeft, Point widthRight) {
  return Point((widthLeft.getX() + widthRight.getX()) / 2., height.getY() / 2.);
}
Point centreByRectY(Point width, Point heightTop, Point heightBot) {
  return Point((width.getX()) / 2., (heightTop.getY() + heightBot.getY()) / 2.);
}
vector<Point> getRadRect(vector<Point> points, Point center) {
  vector<Point> rad;
  for (size_t i = 0; i < points.size(); i++) {
    rad.push_back(Point(i, Line(center, points[i]).getLength()));
  }
  return rad;
}
vector<Point> getKindOfRadRect(vector<Point> points, Point center, double coef) {
  vector<Point> rad;
  for (size_t i = 0; i < points.size(); i++) {
    rad.push_back(Point(i, Line(center, points[i]).getLength(coef)));
  }
  return rad;
}
vector<Point> growTo(vector<Point> points, Point &center, double coef) {
  double med = center.getX() * coef;
  center.setX(med);
  for (size_t i = 0; i < points.size(); i++) {
    med = points[i].getX() * coef;
    points[i].setX(med);
  }
  return points;
}
vector<Point> sortByValue(vector<Point> points) {
  for (size_t i = 0; i < points.size(); i++) {
    for (size_t j = 0; j < points.size(); j++) {
      if (points[i].getY() > points[j].getY()) {
        Point med = points[i];
        points[i] = points[j];
        points[j] = med;
      }
    }
  }
  return points;
}

#endif
