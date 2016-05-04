/**
 * author   -  Olenchenko Illia
 * group    -  PM-1 (OM)
 */

#ifndef STRUCTURES
#define STRUCTURES
#include <math.h>
#include <string>

using namespace std;

struct Interval {
  // Fields
  double firstValue;
  double secondValue;

  // Setters.
  void setFirstValue(double value) {
    firstValue = value;
  }
  void setSecondValue(double value) {
    secondValue = value;
  }

  // Getters.
  double getFirstValue() {
    return firstValue;
  }
  double getSecondValue() {
    return secondValue;
  }

  // Methods
  int inRange(double num) {
    return num > getFirstValue() && num < getSecondValue();
  }

  //Constructors.
  Interval() {}
  Interval(double firstValue, double secondValue) {
    setFirstValue(firstValue);
    setSecondValue(secondValue);
  }
};

struct Point {
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

  // Methods
  string toString() {
    double x = getX();
    double y = getY();
    return "[" + to_string(x) + ", " + to_string(y) + "]";
  }

  //Constructors.
  Point() {}
  Point(double newX, double newY) {
    setX(newX);
    setY(newY);
  }
};

struct Line {
  // fields.
  Point first;
  Point second;

  // setters.
  void setFirst(Point newFirst) {
    first = newFirst;
  }
  void setSecond(Point newSecond) {
    second = newSecond;
  }
  // getters.
  Point getFirst() {
    return first;
  }
  Point getSecond() {
    return second;
  }

  // Methods
  double getA() {
    return first.getY() - second.getY();
  }
  double getB() {
    return second.getX() - first.getX();
  }
  double getC() {
    return first.getX() * second.getY() - second.getX() * first.getY();
  }
  double dToPoint(Point x) {
    return (getA() * x.getX() + getB() * x.getY() + getC()) / sqrt(getA() * getA() + getB() * getB());
  }
  double getLength() {
    return sqrt((getSecond().getX() - getFirst().getX()) * (getSecond().getX() - getFirst().getX()) +
               ((getSecond().getY() - getFirst().getY()) * (getSecond().getY() - getFirst().getY())));
  }
  double getLength(double coef) {
    return sqrt((getSecond().getX() - getFirst().getX()) * (getSecond().getX() - getFirst().getX()) * (coef * coef) +
               ((getSecond().getY() - getFirst().getY()) * (getSecond().getY() - getFirst().getY()) / (coef * coef)));
  }

  //Constructors.
  Line() {}
  Line(Point newFirst, Point newSecond) {
    setFirst(newFirst);
    setSecond(newSecond);
  }
};

#endif
