from __future__ import division
import numpy as np

def initEllipse():
  initEllipse = [
    [4, 0.05, 0.01],
    [0.05, 9, 0.1],
    [0.01, 0.1, 1]
  ]
  ellipse = np.linalg.inv(initEllipse)
  return ellipse