/**
 * author   -  Olenchenko Illia
 * group    -  PM-1 (OM)
 */
#ifndef IN_OUT_HELPER
#define IN_OUT_HELPER

#include <stdio.h>
#include <cstdlib>
#include <string.h>
#include <vector>
#include <sstream>
#include <sys/stat.h>
#include <dirent.h>
#include <fstream>
#include <iostream>
#include <iomanip>
#include "structures.cpp"
#include "matr_actions.cpp"

using namespace std;

// Defining general variables.
const string D2_FOLDER = "D2";
const string D3_FOLDER = "D3";

// helper functions.
double percentEqualityVectors(vector<Point> pointsA, vector<Point> pointsB) {
  double response = 0.;
  for (size_t i = 0; i < pointsA.size(); i++) {
    if ((int)pointsA[i].getX() == (int)pointsB[i].getX()) {
      response += 1.;
    }
  }
  response /= pointsA.size();
  response *= 100;
  return response;
}
// Checking if path is file.
bool isFile(string path) {
  const char *v = path.c_str();
  struct stat buf;
  stat(v, &buf);
  return S_ISREG(buf.st_mode);
}

// Special function to read POK file.
int readFile(string file, vector<vector<vector<double> > >& matr) {
  if (!isFile(file)) {
    return 1;
  }
  ifstream myFile(file);
  if (myFile.good()) {
    int rowSizes;
    double meanCells;
    double num;
    string str;
    vector<vector<double> > fileMatr;

    getline(myFile, str);
    istringstream ss(str);
    if (ss >> num) {
      // Getting number of lines.
      rowSizes = (int)num;
      if (ss >> num) {
        // Getting mean quantity of cells.
        meanCells = num;
      }
    }
    // Reading table. (first number in table - row number)
    while( getline(myFile, str) ) {
      istringstream ss(str);
      int rowNumber;
      int i = 0;
      ss >> rowNumber;
      while(ss >> num) {
        if (fileMatr.size() < i + 1) {
          fileMatr.push_back(vector<double>());
        }
        fileMatr[i].push_back(num);
        i++;
      }
    }
    matr.push_back(fileMatr);
  }
  myFile.close();
  return 0;
}

// Special function to open directories with POK files.
int readFolder(string folder, vector<vector<vector<double> > >& matr) {
  folder = "./files/" + folder;
  const char *v = folder.c_str();
  int len;
  struct dirent *pDirent;
  DIR *pDir;
  pDir = opendir (v);
  if (pDir == NULL) {
    printf ("Cannot open directory '%s'\n", v);
    return 1;
  }
  while ((pDirent = readdir(pDir)) != NULL) {
    string currentFile = folder + "/" + pDirent->d_name;
    readFile(currentFile, matr);
  }
  closedir (pDir);
  return 0;
}

// Cout vector.
template <typename T>
int coutVector(vector<T> v) {
  for (int i = 0; i < v.size(); ++i ) {
    cout << v[i] << " ";
  }
  cout << endl;
  return 0;
}

// Cout several vectors.
int coutVectors(vector<vector<double> > K) {
  int width = 16;
  cout << setw(width / 8) << "#";
  for (size_t i = 0; i < K.size(); i++) {
    cout << setw(width - 1) << "K" << i + 1;
  }
  cout << endl;
  for (size_t k = 0; k < 15; k++) {
    cout << setw(width / 8) << k + 1;
    for(int i = 0; i < K.size(); i++) {
      cout << setw(width) << K[i][k];
    }
    cout << endl;
  }
  cout << endl;
  return 0;
}

int readingFolders(vector<vector<vector<double> > > &F,
                   vector<vector<vector<double> > > &G) {
  // Reading folders.
  readFolder(D2_FOLDER, F);
  readFolder(D3_FOLDER, G);
  return 0;
}

int coutInfluense(vector<vector<vector<double> > > X,
                  vector<vector<double> > countX,
                  vector<vector<double> > deltaX,
                  double I[],
                  int N,
                  string set) {
  ofstream fout("./outs/influense_set_" + set + ".txt");
  int width = 16;

  fout << set + " files:" << endl << endl;
  for (int i = 0; i < N; i++) {
    for (int j = 0; j < 7; j++) {
      fout << setw(width / 8) << i + 1 << setw(width / 2) << I[j + 1] << setw(12) << "< delta <=" << setw(width / 2) << I[j] << setw(width / 4) << countX[i][j];
      for (int k = 0; k < X.size(); k++){
        if (deltaX[i][k] >= I[j + 1] && deltaX[i][k] < I[j]) fout << setw(3)<< k + 1;
      }
      fout << endl;
    }
  }
  return 0;
}

vector<Point> readPoints(string file) {
  vector<Point> points;
  if (isFile(file)) {
    ifstream myFile(file);
    if (myFile.good()) {
      int rowSizes;
      int num;
      string str;
      getline(myFile, str);
      istringstream ss(str);
      if (ss >> num) {
        // Getting number of lines.
        rowSizes = (int)num;
      }
      // Reading table. (first number in table - row number)
      while (getline(myFile, str)) {
        istringstream ss(str);
        int rowNumber;
        int i = 0;
        ss >> rowNumber;
        double x, y;
        ss >> x >> y;
        points.push_back(Point(x, y));
      }
    }
    myFile.close();
  }
  return points;
}
void outVectorPoint(vector<Point> points) {
  for (size_t i = 0; i < points.size(); i++) {
    cout << points[i].toString() << endl;
  }
}
int out4(vector<Point> FRR,
         vector<Point> FLR,
         vector<Point> FTR,
         vector<Point> FRW,
         vector<Point> FLW,
         vector<Point> FTW,
         vector<Point> FTopR,
         vector<Point> FBotR,
         vector<Point> FTYR,
         vector<Point> FTopW,
         vector<Point> FBotW,
         vector<Point> FTYW) {
  ofstream fout("./outs/points.txt");
  int width = 16;
  fout << "Центр квадрата, Сжатие от правого края" << endl;
  for (size_t i = 0; i < FRR.size(); i++) {
    fout << setw(width / 4) << FRR[i].getX() + 1;
  }
  fout << endl;
  fout << "Центр квадрата, Сжатие от левого края" << endl;
  for (size_t i = 0; i < FLR.size(); i++) {
    fout << setw(width / 4) << FLR[i].getX() + 1;
  }
  fout << endl;
  fout << "Центр квадрата, Сжатие с двух сторон" << endl;
  for (size_t i = 0; i < FTR.size(); i++) {
    fout << setw(width / 4) << FTR[i].getX() + 1;
  }
  fout << endl;
  fout << "Центр Тяжести, Сжатие с правого края" << endl;
  for (size_t i = 0; i < FRW.size(); i++) {
    fout << setw(width / 4) << FRW[i].getX() + 1;
  }
  fout << endl;
  fout << "Центр Тяжести, Сжатие с левого края" << endl;
  for (size_t i = 0; i < FLW.size(); i++) {
    fout << setw(width / 4) << FLW[i].getX() + 1;
  }
  fout << endl;
  fout << "Центр Тяжести, Сжатие с двух сторон" << endl;
  for (size_t i = 0; i < FTW.size(); i++) {
    fout << setw(width / 4) << FTW[i].getX() + 1;
  }
  fout << endl;
  fout << "Центр квадрата, Сжатие сверху" << endl;
  for (size_t i = 0; i < FTopR.size(); i++) {
    fout << setw(width / 4) << FTopR[i].getX() + 1;
  }
  fout << endl;
  fout << "Центр квадрата, Сжатие снизу" << endl;
  for (size_t i = 0; i < FBotR.size(); i++) {
    fout << setw(width / 4) << FBotR[i].getX() + 1;
  }
  fout << endl;
  fout << "Центр квадрата, Сжатие с двух сторон у" << endl;
  for (size_t i = 0; i < FTYR.size(); i++) {
    fout << setw(width / 4) << FTYR[i].getX() + 1;
  }
  fout << endl;
  fout << "Центр Тяжести, Сжатие сверху" << endl;
  for (size_t i = 0; i < FTopW.size(); i++) {
    fout << setw(width / 4) << FTopW[i].getX() + 1;
  }
  fout << endl;
  fout << "Центр Тяжести, Сжатие снизу" << endl;
  for (size_t i = 0; i < FBotW.size(); i++) {
    fout << setw(width / 4) << FBotW[i].getX() + 1;
  }
  fout << endl;
  fout << "Центр Тяжести, Сжатие с двух сторон у" << endl;
  for (size_t i = 0; i < FTYW.size(); i++) {
    fout << setw(width / 4) << FTYW[i].getX() + 1;
  }
  fout << endl << endl;
  fout << "Центр Квадрата от правого края ~ Центр Квадрата с левого края - " << percentEqualityVectors(FRR, FLR) << "\%" << endl;
  fout << "Центр Квадрата от правого края ~ Центр Квадрата с правого и левого - " << percentEqualityVectors(FRR, FTR) << "\%" << endl;
  fout << "Центр Квадрата от левого края ~ Центр Квадрата с правого и левого - " << percentEqualityVectors(FLR, FTR) << "\%" << endl;
  fout << "Центр Тяжести от правого края ~ Центр Тяжести с левого края - " << percentEqualityVectors(FRW, FLW) << "\%" << endl;
  fout << "Центр Тяжести от правого края ~ Центр Тяжести с правого и левого - " << percentEqualityVectors(FRW, FTW) << "\%" << endl;
  fout << "Центр Тяжести от левого края ~ Центр Тяжести с правого и левого - " << percentEqualityVectors(FLW, FTW) << "\%" << endl;
  fout << endl;
  fout << "Центр Квадрата снизу ~ Центр Квадрата сверху - " << percentEqualityVectors(FBotR, FTopR) << "\%" << endl;
  fout << "Центр Квадрата снизу ~ Центр Квадрата сверху и снизу - " << percentEqualityVectors(FBotR, FTYR) << "\%" << endl;
  fout << "Центр Квадрата сверху ~ Центр Квадрата сверху и снизу - " << percentEqualityVectors(FTopR, FTYR) << "\%" << endl;
  fout << "Центр Тяжести снизу ~ Центр Тяжести с сверху - " << percentEqualityVectors(FBotW, FTopW) << "\%" << endl;
  fout << "Центр Тяжести снизу ~ Центр Тяжести сверху и снизу - " << percentEqualityVectors(FBotW, FTYW) << "\%" << endl;
  fout << "Центр Тяжести сверху ~ Центр Тяжести сверху и снизу - " << percentEqualityVectors(FTopW, FTYW) << "\%" << endl;
  fout << endl;
  fout << "Центр Квадрата снизу ~ Центр Тяжести снизу - " << percentEqualityVectors(FBotR, FBotW) << "\%" << endl;
  fout << "Центр Квадрата сверху и снизу ~ Центр Тяжести сверху и снизу - " << percentEqualityVectors(FTopR, FTopW) << "\%" << endl;
  fout << "Центр Квадрата сверху ~ Центр Тяжести сверху - " << percentEqualityVectors(FTYR, FTYW) << "\%" << endl;
  fout << "Центр Квадрата от правого края ~ Центр Тяжести от правого края - " << percentEqualityVectors(FRR, FRW) << "\%" << endl;
  fout << "Центр Квадрата от левого края ~ Центр Тяжести от левого края - " << percentEqualityVectors(FLR, FLW) << "\%" << endl;
  fout << "Центр Квадрата с правого и левого ~ Центр Тяжести с правого и левого края - " << percentEqualityVectors(FTYR, FTYW) << "\%" << endl;
  return 0;
}

int coutInterval(int from, int to, string text) {
  cout << text << from - to << "ms" << endl;
  return 0;
}

#endif
