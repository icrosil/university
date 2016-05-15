/**
 * author   -  Olenchenko Illia
 * group    -  PM-1 (OM)
 */

#ifndef LAB_5_CPP
#define LAB_5_CPP

#include "./4_lab.cpp"

double Distance(Point p1, Point p2){
  return sqrt((p1.getX() - p2.getX())*(p1.getX() - p2.getX()) + (p1.getY() - p2.getY())*(p1.getY() - p2.getY()));
}

double sin_a(Point p1, Point p2, Point p3){
  double d1 = Distance(p1, p2);
  double d2 = Distance(p3, p2);
  double ip = (p1.getX() - p2.getX())*(p3.getX() - p2.getX()) + (p1.getY() - p2.getY())*(p3.getY() - p2.getY());

  return sqrt(1 - (ip/(d1*d2))*(ip/(d1*d2)));
}

int count(vector<int> v, int k){
  int count = 0;
  for(int i=0; i < v.size(); i++){
    if(v[i] == k) count++;
  }

  return count;
}

int orientation (Point pO, Point p1, Point p2) {
  Point a = p1  - pO;
  Point b = p2  - pO;
  double sa = a.getX() * b.getY() - b.getX() * a.getY();
  if (sa > 0.0)
    return 1;
  if (sa < 0.0)
    return -1;
  return 0;
}

vector<double> PetuninsEllipse(vector<Point> points){
  int n, j, i_best, j_best, i1, i2, i_start;
  double d = 0.0, d1 = 100.0, delta_x, delta_y, delta1_x, delta1_y;

  n = points.size();
  vector<double> distances = vector<double>(n);
  vector<double> coeffs = vector<double>();

  //œÓËÒÍ ‰‚Ûı Ì‡Ë·ÓÎÂÂ ÓÚ‰‡Î∏ÌÌ˚ı ÚÓ˜ÂÍ
  for(int i=0; i < n; i++){
    for(int j=i+1; j < n; j++){
      if(Distance(points[i], points[j]) > d){
        i_best = i;
        j_best = j;
      }
    }
  }
  //œÓËÒÍ ‰‚Ûı ÚÓ˜ÂÍ, Ì‡Ë·ÓÎÂÂ ÓÚ‰‡Î∏ÌÌ˚ı ÓÚ Ì‡È‰ÂÌÌÓÈ ÔˇÏÓÈ
  for(int i=0; i < n; i++){
    
    if(i != i_best && i != j_best && orientation(points[j_best], points[i_best], points[i])==1) {
      distances[i] = Distance(points[i_best], points[i])*sin_a(points[j_best], points[i_best], points[i]);
    }
    //else distances[i] = 100.0;
    if(distances[i] < d1){
      d1 = distances[i];
      i1 = i;
    }
  }

  d1 = 100.0;
  

  for(int i=0; i < n; i++){
    if(i != i_best && i != j_best && orientation(points[j_best], points[i_best], points[i])==-1) distances[i] = Distance(points[i_best], points[i])*sin_a(points[j_best], points[i_best], points[i]);
      if(distances[i] < d1){
        d1 = distances[i];
        i2 = i;
      }
  }

  //œÓ‚ÓÓÚ ÚÓ˜ÂÍ ÔˇÏÓÛ„ÓÎ¸ÌËÍ‡ Ô‡‡ÎÎÂÎ¸ÌÓ Í Œı
  delta_y = abs(points[i_best].getY() - points[j_best].getY());
    delta_x = (points[i_best].getX() < points[j_best].getX()) ? (points[i_best].getX() + Distance(points[j_best], points[i_best]) - points[j_best].getX()) : (points[j_best].getX() + Distance(points[j_best], points[i_best]) - points[i_best].getX());
  i_start = (points[i_best].getX() < points[j_best].getX()) ? i_best : j_best;

  double sin_alpha = delta_y / Distance(points[i_best], points[j_best]);
  double cos_alpha = delta_x / Distance(points[i_best], points[j_best]);
  for(int i=0; i < n; i++){
    if(i != i_start){
      //if(points[i_start].getY() <= points[i_best].getY() && points[i_start].getY() <= points[j_best].getY()){
        points[i].setX(points[i].getX() - delta_x);
          points[i].setY(points[i].getY() - delta_y);
      /*}
      else {
        points[i].setX(points[i].getX() + delta_x);
          points[i].setY(points[i].getY() + delta_y);
      }*/
    }
  }
  //—ÏÂ˘ÂÌËÂ ‚ (0,0)
  delta1_x = points[i_start].getX();
  delta1_y = (points[i1].getY() < points[i2].getY()) ? points[i1].getY() : points[i2].getY();

  for(int i=0; i < n; i++){
        points[i].setX(points[i].getX() - delta_x);
          points[i].setY(points[i].getY() - delta_y);
  }
  //return points;
//}

//œÓÒÚÓÂÌËÂ ˝ÎÎËÔÒ‡
//void PetuninsEllipse(vector<Point> points){
  vector<double> x = vector<double> (points.size());
  vector<double> y = vector<double> (points.size());
  vector<double> dist = vector<double> (points.size());

  for(int i=0; i < points.size(); i++){
    x[i] = points[i].getX();
    y[i] = points[i].getY();
  }
  double a = *max_element(x.begin(), x.end());
  double b = *max_element(y.begin(), y.end());

  //—Ê‡ÚËÂ ÔˇÏÓÛ„ÓÎ¸ÌËÍ‡ ‚ Í‚‡‰‡Ú
  double alpha = (a < b) ? (a / b) : (b / a);

  for(int i=0; i < points.size(); i++){
    points[i].setX(points[i].getX() * alpha);
  }

  double min = (a > b) ? b : a;
  Point centre = Point(min / 2., min / 2.);

  for(int i=0; i < points.size(); i++) dist[i] = Distance(centre, points[i]);
  double r = *max_element(dist.begin(), dist.end());

  //ƒÎËÌ˚ ÓÒÂÈ ˝ÎÎËÔÒ‡ - r Ë r/alpha
  //¬ÓÁ‚‡˘‡ÂÏÒˇ Í "ËÒıÓ‰ÌÓÏÛ" ÔˇÏÓÛ„ÓÎ¸ÌËÍÛ: ÔÓ‚ÓÓÚ Ë ÒÏÂ˘ÂÌËÂ
  
  centre.setX(centre.getX() / alpha);
  centre.setX(centre.getX() + (delta1_x + delta_x));
  centre.setY(centre.getY() + (delta1_y + delta_y));

  double x0 = centre.getX();
  double y0 = centre.getY();

  coeffs.push_back(x0);
  coeffs.push_back(y0);
  coeffs.push_back(sin_alpha);
  coeffs.push_back(cos_alpha);
  coeffs.push_back(r);
  coeffs.push_back(r / alpha);
  return coeffs;
}

bool Point_is_in_ellipse(vector<double> coeffs, Point p){
  return(pow(((p.getX() - coeffs[0])*coeffs[3] +(p.getY() - coeffs[1])*coeffs[2]),2.0)/(coeffs[4]*coeffs[4]) + pow((-(p.getX() - coeffs[0])*coeffs[2] +(p.getY() - coeffs[1])*coeffs[3]),2.0)/(coeffs[5]*coeffs[5]) <= 1.0);
}

int executeFifth() {
  // default init.
  vector<vector<vector<double> > > F;
  vector<vector<vector<double> > > G;
  readingFolders(F, G);

  int s1 = F.size();
  int s2 = G.size();

  vector<vector<double> > mu  = vector<vector<double> > (N, vector<double> (s1, 0.));
  vector<vector<double> > nu  = vector<vector<double> > (N, vector<double> (s1, 0.));
  vector<vector<double> > aleph  = vector<vector<double> >(N, vector<double> (s2, 0.));
  vector<vector<double> > ksi  = vector<vector<double> >(N, vector<double> (s2, 0.));

  vector<vector<Point> > G1_G1 = vector<vector<Point> >();
  vector<vector<Point> > G2_G1 = vector<vector<Point> >();
  vector<vector<Point> > G2_G2 = vector<vector<Point> >();
  vector<vector<Point> > G1_G2 = vector<vector<Point> >();

  vector<int> answer = vector<int>((N - 1) * (N) / 2);
  vector<int> diagnoses = vector<int>((N - 1) * (N) / 2);

  vector<double> K (N);
  vector<vector<vector<double> > > FF = kliToikl(compare(F, F, K));
  vector<vector<vector<double> > > FG = kliToikl(compare(F, G, K));
  vector<vector<vector<double> > > GG = kliToikl(compare(G, G, K));
  vector<vector<vector<double> > > GF = kliToikl(compare(G, F, K));
  sumByIKLlast(FF, mu);
  sumByIKLlast(FG, nu);
  sumByIKLlast(GG, aleph);
  sumByIKLlast(GF, ksi);

  int m = 0;
  for (int i = 0; i < N; i++) {
    for (int j = i; j < N; j++) {
      G1_G1.push_back(vector<Point>());
      G1_G2.push_back(vector<Point>());
      for (int k = 0; k < s1; k++) {
        G1_G1[m].push_back(Point(mu[i][k], mu[i][k]));
        G1_G2[m].push_back(Point(nu[i][k], nu[i][k]));
      }
      m++;
    }
  }
  m = 0;
  for (int i = 0; i < N; i++) {
    for (int j = i; j < N; j++) {
      G2_G2.push_back(vector<Point>());
      G2_G1.push_back(vector<Point>());
      for (int k = 0; k < s2; k++) {
        G2_G2[m].push_back(Point(aleph[i][k], aleph[i][k]));
        G2_G1[m].push_back(Point(ksi[i][k], ksi[i][k]));
      }
      m++;
    }
  }
  vector<Point> p1 = vector<Point>();
  cout << "One part is ready" << endl;

  for (int k=0; k < s1; k++) {
    for (int m = 0; m < (N - 1) * (N) / 2; m++) {
      for (int l = 0; l < (N - 1) * (N) / 2; l++) {
        if (Point_is_in_ellipse(PetuninsEllipse(G1_G1[l]), G1_G1[m][k]) && !Point_is_in_ellipse(PetuninsEllipse(G2_G1[l]), G1_G1[m][k]) ) {
          answer[l] = 1;
        } else if (Point_is_in_ellipse(PetuninsEllipse(G2_G1[l]), G1_G1[m][k]) && !Point_is_in_ellipse(PetuninsEllipse(G1_G1[l]), G1_G1[m][k]) ) {
          answer[l] = 0;
        } else {
          answer[l] = 2;
        }
      }
      if (count(answer, 1) < ((N - 1) * (N) / 2 - count(answer, 2)) / 2.0) diagnoses[m] = 2;
      else diagnoses[m] = 1;
    }
    cout << "One for is ready " << k << " / " << s1 << endl;
  }

  for(int i=0; i < (N-1)*(N)/2; i++){
    cout<<diagnoses[i]<<" "<<endl;
  }

  return 0;
}

#endif
