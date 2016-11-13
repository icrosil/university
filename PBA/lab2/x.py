"""X solver function"""

from scipy.integrate import odeint
import numpy as np
import math
from helpers import convertArrayToMatrix, convertMatrixToArray

# function for dx/dt = Xfunc(t)
def Xfunc(X, t, A, C, G, N, M, y, w, P0_1, R, tStart):
  at = A(t)
  ct = C(t)
  gt = G(t)
  nt = N(t)
  mt = M(t)
  wt = w(t)
  ax = np.dot(at, X)
  y1 = y(X, gt, wt)
  solR = R(tStart, t, P0_1, A, C, G, N, M)[-1]
  Rlen = len(solR)
  l = int(math.sqrt(Rlen))
  R1 = solR.reshape([l, l])
  rgn = np.dot(np.dot(R1, np.transpose(gt)), nt)
  ygx = np.subtract(y1, np.dot(gt, X))
  rgnygx = np.dot(rgn, ygx)
  return np.add(ax, rgnygx)

def X(tStart, t, A, C, G, N, M, y, w, P0_1, a, R):
  return odeint(
    Xfunc,
    a,
    np.linspace(tStart + 0.0000001, t, 25),
    args=(A, C, G, N, M, y, w, P0_1, R, tStart)
  )