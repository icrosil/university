/**
 * author - Illia Olenchenko
 * group  - PM-1 (OM)
 */

#pragma once

#include <string>
#include <vector>
#include <iostream>

using namespace std;

// Simple struct for Point
struct Point {
  public:
    // fields.
    double x;
    double y;

    // setters.
    void setX(double newX) {
      x = newX;
    }
    void setY(double newY) {
      y = newY;
    }
    // getters.
    double getX() {
      return x;
    }
    double getY() {
      return y;
    }
    Point operator + (const Point&);
    Point operator - (const Point&);
    Point operator * (double);
    Point operator - (double);

    // Methods
    string toString() {
      double x = getX();
      double y = getY();
      return "[" + to_string(x) + ", " + to_string(y) + "]";
    }

    double scalar(const Point a) {
      return a.x * x + a.y * y;
    }

    //Constructors.
    Point() {}
    Point(double newX, double newY) {
      setX(newX);
      setY(newY);
    }
};
Point Point::operator + (const Point &p) {
  return Point(x + p.x, y + p.y);
}

Point Point::operator - (const Point &p) {
  return Point(x - p.x, y - p.y);
}

Point Point::operator - (double p) {
  return Point(x - p, y - p);
}

Point Point::operator * (double p) {
  return Point(x * p, y * p);
}

// Cout vector.
int coutVector(vector<Point> v) {
  for (int i = 0; i < v.size(); ++i ) {
    cout << v[i].toString() << endl;
  }
  cout << endl;
  return 0;
}
