"""X solver function"""

from scipy.integrate import odeint
import numpy as np
import math
from helpers import convertArrayToMatrix, convertMatrixToArray
from bisect import bisect

# function for dx/dt = Xfunc(t)
def Xfunc(X, t, A, C, G, N, M, y, w, P0_1, tStart, rt, times):
  at = A(t)
  ct = C(t)
  gt = G(t)
  nt = N(t)
  mt = M(t)
  wt = w(t)
  ax = np.dot(at, X)
  yt = y(X, gt, wt)
  bt = min([bisect(times, t), len(rt) - 1])
  rt = convertArrayToMatrix(rt[bt])
  rgn = np.dot(np.dot(rt, np.transpose(gt)), nt)
  ygx = np.subtract(yt, np.dot(gt, X))
  rgnygx = np.dot(rgn, ygx)
  return np.add(ax, rgnygx)

def X(tStart, t, A, C, G, N, M, y, w, P0_1, a, rt, times):
  return odeint(
    Xfunc,
    a,
    times,
    args=(A, C, G, N, M, y, w, P0_1, tStart, rt, times)
  )