"""R solver function"""

from scipy.integrate import odeint
import numpy as np
import math
from helpers import convertArrayToMatrix, convertMatrixToArray

# function for dR/dt = Rfunc(t)
def Rfunc(R, t, A, C, G, N, M):
  at = A(t)
  ct = C(t)
  gt = G(t)
  nt = N(t)
  mt = M(t)
  rt = convertArrayToMatrix(R)
  ar = np.dot(at, rt)
  ra = np.dot(rt, np.transpose(at))
  cmc = np.dot(np.dot(ct, np.linalg.inv(mt)), np.transpose(ct))
  rgngr = np.dot(np.dot(np.dot(np.dot(rt, np.transpose(gt)), nt), gt), rt)
  return convertMatrixToArray(np.subtract(np.add(np.add(ar, ra), cmc), rgngr))

def R(tStart, t, P0_1, A, C, G, N, M, times):
  return odeint(
    Rfunc,
    P0_1.reshape([1, len(P0_1) ** 2])[0, :],
    times,
    args=(A, C, G, N, M,)
  )