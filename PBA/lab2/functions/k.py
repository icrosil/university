"""K solver function"""

from scipy.integrate import odeint
import numpy as np
import math
from helpers import convertArrayToMatrix, convertMatrixToArray
from bisect import bisect

# function for dP/dt = Pfunc(t)
def Kfunc(K, t, G, N, y, w, xts, times):
  gt = G(t)
  nt = N(t)
  wt = w(t)
  bt = min([bisect(times, t), len(xts) - 1])
  xt = xts[bt]
  yt = y(xt, gt, wt)
  gx = np.dot(gt, xt)
  ygx = np.subtract(yt, gx)
  nygx = np.dot(nt, ygx)
  return np.dot(nygx, ygx)

def K(timeStart, timeEnd, G, N, y, w, xts, times):
  return odeint(
    Kfunc,
    0,
    times,
    args=(G, N, y, w, xts, times)
  )