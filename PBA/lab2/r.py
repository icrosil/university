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
  Rlen = len(R)
  l = int(math.sqrt(Rlen))
  R1 = convertArrayToMatrix(R, l, l)
  ar = np.dot(at, R1)
  ra = np.dot(R1, np.transpose(at))
  cmc = np.dot(np.dot(ct, np.linalg.inv(mt)), np.transpose(ct))
  rgngr = np.dot(np.dot(np.dot(np.dot(R1, np.transpose(gt)), nt), gt), R1)
  return convertMatrixToArray(np.subtract(np.add(np.add(ar, ra), cmc), rgngr))

def R(tStart, t, P0_1, A, C, G, N, M):
  return odeint(
    Rfunc,
    P0_1.reshape([1, len(P0_1) ** 2])[0, :],
    np.linspace(tStart, t, 25),
    args=(A, C, G, N, M,)
  )