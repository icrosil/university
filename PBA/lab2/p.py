"""P solver function"""

from scipy.integrate import odeint
import numpy as np
import math
from helpers import convertArrayToMatrix, convertMatrixToArray

# function for dP/dt = Pfunc(t)
def Pfunc(P, t, A, C, G, N, M):
  at = A(t)
  ct = C(t)
  gt = G(t)
  nt = N(t)
  mt = M(t)
  Plen = len(P)
  l = int(math.sqrt(Plen))
  P1 = P.reshape([l, l])
  gng = np.dot(np.dot(np.transpose(gt), nt), gt)
  pa = np.dot(P1, at)
  ap = np.dot(np.transpose(at), P1)
  pcmcp = np.dot(np.dot(np.dot(np.dot(P1, ct), np.linalg.inv(mt)), np.transpose(ct)), P1)
  return np.subtract(np.subtract(np.subtract(gng, pa), ap), pcmcp).reshape([1, Plen])[0, :]

def P(tStart, t, A, C, G, N, M, P0):
  return odeint(
    Pfunc,
    P0.reshape([1, len(P0) ** 2])[0, :],
    np.linspace(tStart, t, 25),
    args=(A, C, G, N, M,)
  )