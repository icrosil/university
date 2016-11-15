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
  pt = convertArrayToMatrix(P)
  gng = np.dot(np.dot(np.transpose(gt), nt), gt)
  pa = np.dot(pt, at)
  ap = np.dot(np.transpose(at), pt)
  pcmcp = np.dot(np.dot(np.dot(np.dot(pt, ct), np.linalg.inv(mt)), np.transpose(ct)), pt)
  return convertMatrixToArray(np.subtract(np.subtract(np.subtract(gng, pa), ap), pcmcp))

def P(tStart, t, A, C, G, N, M, P0):
  return odeint(
    Pfunc,
    P0.reshape([1, len(P0) ** 2])[0, :],
    np.linspace(tStart, t, 25),
    args=(A, C, G, N, M,)
  )