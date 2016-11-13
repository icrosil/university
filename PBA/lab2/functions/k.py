"""K solver function"""

from scipy.integrate import odeint
import numpy as np
import math
from helpers import convertArrayToMatrix, convertMatrixToArray
from bisect import bisect

# function for dP/dt = Pfunc(t)
def Kfunc(K, t, A, G, N, y, w, xts, times):
  at = A(t)
  gt = G(t)
  nt = N(t)
  wt = w(t)
  bt = min([bisect(times, t), len(xts) - 1])
  xt = xts[bt]
  yt = y(xt, gt, wt)
  ax = np.dot(at, xt)
  gx = np.dot(gt, xt)
  yax = np.subtract(yt, ax)
  nyax = np.dot(nt, yax)
  ygx = np.subtract(yt, gx)
  return np.dot(nyax, ygx)

def K(timeStart, timeEnd, A, G, N, y, w, xts, times):
  return odeint(
    Kfunc,
    0,
    times,
    args=(A, G, N, y, w, xts, times)
  )