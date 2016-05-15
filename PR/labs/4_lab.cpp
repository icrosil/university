/**
 * author   -  Olenchenko Illia
 * group    -  PM-1 (OM)
 */

#ifndef LAB_4_CPP
#define LAB_4_CPP

#include "./3_lab.cpp"

int executeFourth() {
  // Read Points.
  vector<Point> points = readPoints("./files/Points/input.txt");
  int indexLeft;
  int indexRight;
  // Find max line and points.
  Line diag = findMaxLine(points, indexLeft, indexRight);
  // Find max top and bottom.
  int indexTop = findMaxY(points, diag);
  int indexBottom = findMinY(points, diag);
  // Rounding all points holding left point.
  points = roundPointsClockVersa(points, indexLeft, indexRight, indexTop, indexBottom);
  diag = Line(points[indexLeft], points[indexRight]);
  // Points to 0 0.
  points = translatePointsToO(points, indexBottom, indexLeft);
  vector<Point> pointsLeft = translatePointsToOLeft(points, indexBottom, indexRight);
  vector<Point> pointsBot = translatePointsToOBot(points, indexTop, indexRight, indexBottom, indexLeft);
  vector<Point> pointsTwoSide = translatePointsToORightLeft(points, indexBottom, indexRight, indexLeft);
  vector<Point> pointsTwoSideY = translatePointsToORightLeftY(points, indexTop, indexBottom, indexRight, indexLeft);
  diag = Line(points[indexLeft], points[indexRight]);
  // Shrink rect.
  double coefFR;
  double coefFTop;
  double coefFL;
  double coefFBot;
  double coefFT;
  vector<Point> pointsFR = shrinkFrom(points, indexTop, indexRight, coefFR);
  vector<Point> pointsFL = shrinkFrom(pointsLeft, indexTop, indexLeft, coefFL);
  vector<Point> pointsFT = shrinkFromTwoSides(pointsTwoSide, indexTop, indexLeft, indexRight, coefFT);
  vector<Point> pointsFTop = growTo(points, indexTop, indexRight, coefFTop);
  vector<Point> pointsFBot = growTo(pointsBot, indexBottom, indexRight, coefFBot);
  vector<Point> pointsFTY = growToTwoSides(pointsTwoSideY, indexTop, indexLeft, indexRight, indexBottom, coefFT);
  // Center points.
  Point centerFRR = centreByRect(pointsFR[indexTop], pointsFR[indexRight]);
  Point centerFTopR = centreByRect(pointsFTop[indexTop], pointsFTop[indexRight]);
  Point centerFRW = centreByWeight(pointsFR);
  Point centerFTopW = centreByWeight(pointsFTop);
  Point centerFLR = centreByRect(pointsFL[indexTop], pointsFL[indexLeft]);
  Point centerFBotR = centreByRect(pointsFBot[indexBottom], pointsFBot[indexRight]);
  Point centerFLW = centreByWeight(pointsFL);
  Point centerFBotW = centreByWeight(pointsFBot);
  Point centerFTR = centreByRect(pointsFT[indexTop], pointsFT[indexLeft], pointsFT[indexRight]);
  Point centerFTYR = centreByRectY(pointsFTY[indexRight], pointsFTY[indexTop], pointsFTY[indexBottom]);
  Point centerFTW = centreByWeight(pointsFT);
  Point centerFTYW = centreByWeight(pointsFTY);
  // radiuses
  vector<Point> radFRR = getRadRect(pointsFR, centerFRR);
  vector<Point> radFRW = getRadRect(pointsFR, centerFRW);
  vector<Point> radFLR = getRadRect(pointsFL, centerFLR);
  vector<Point> radFLW = getRadRect(pointsFL, centerFLW);
  vector<Point> radFTR = getRadRect(pointsFT, centerFTR);
  vector<Point> radFTW = getRadRect(pointsFT, centerFTW);
  vector<Point> radFTopR = getRadRect(pointsFTop, centerFTopR);
  vector<Point> radFTopW = getRadRect(pointsFTop, centerFTopW);
  vector<Point> radFBotR = getRadRect(pointsFBot, centerFBotR);
  vector<Point> radFBotW = getRadRect(pointsFBot, centerFBotW);
  vector<Point> radFTYR = getRadRect(pointsFTY, centerFTYR);
  vector<Point> radFTYW = getRadRect(pointsFTY, centerFTYW);
  // Sort by value.
  radFRR = sortByValue(radFRR);
  radFLR = sortByValue(radFLR);
  radFTR = sortByValue(radFTR);
  radFRW = sortByValue(radFRW);
  radFLW = sortByValue(radFLW);
  radFTW = sortByValue(radFTW);
  radFTopR = sortByValue(radFTopR);
  radFBotR = sortByValue(radFBotR);
  radFTYR = sortByValue(radFTYR);
  radFTopW = sortByValue(radFTopW);
  radFBotW = sortByValue(radFBotW);
  radFTYW = sortByValue(radFTYW);
  out4(radFRR, radFLR, radFTR, radFRW, radFLW, radFTW, radFTopR, radFBotR, radFTYR, radFTopW, radFBotW, radFTYW);
  return 0;
}

#endif
