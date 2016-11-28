from __future__ import division
import numpy as np

def initEllipse():
  a11 = 4
  a22 = 9
  a33 = 1

  a12 = 2 * 0.05
  a13 = 2 * 0.01

  a21 = a12
  a23 = 2 * 0.1

  a31 = a13
  a32 = a23

  quad_m = [
    [a11, a12 / 2, a13 / 2],
    [a21 / 2, a22, a23 / 2],
    [a31 / 2, a32 / 2, a33]
  ]

  return quad_m