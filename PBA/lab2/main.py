"""
authors: Illia Olenchenko, Maxim Manzuk.
"""
from scipy.integrate import odeint
import numpy as np
import math
from plotHelper import drawSolution
from helpers import convertArrayToMatrix, convertMatrixToArray

from functions.r import R
from functions.p import P
from functions.x import X
from functions.k import K

# function y, all matricies and vectors in some time
def y(X, G, w):
  gx = np.dot(G, X)
  return np.add(gx, w)

def main():
  """
  lab 2 solver
  """
  # variables
  # Defining constants
  # B - constant of friction
  B = 2
  # J - moment of inertia of the valve. Should be gt 0
  J = 0.1
  if J <= 0:
    raise NameError('J should be gt 0')
  # K1 - should be gt 0
  K1 = 0.3
  if K1 <= 0:
    raise NameError('K1 should be gt 0')
  # K2 - should be gt 0
  K2 = 0.4
  if K2 <= 0:
    raise NameError('K2 should be gt 0')
  # Ra - winding resistance
  Ra = 4.
  # La - induction
  La = 5.
  # G - matrix with y
  G = lambda t: [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ]
  # w - vector with y
  w = lambda t: [1, 1, 1]
  # ea - external power
  ea = lambda t: t ** 2 / (t + 1)
  # A - main matrix of diff system
  A = lambda t: [
    [0, 1, 0],
    [0, -B / J, K2 / J],
    [0, -K1 / La, -Ra / La]
  ]
  # N - one of additional predefined matrices
  N = lambda t: [
    [2, 0, 1],
    [0, 2, 0],
    [1, 0, 2]
  ]
  # M - one of additional predefined matrices
  M = lambda t: [
    [2, 0, 1],
    [0, 2, 0],
    [1, 0, 2]
  ]
  # C - second part for main diff
  C = lambda t: [ 0, 0, ea(t) / La ]
  # times
  timeStart = 0
  if timeStart < 0:
    raise NameError('T0 should be gt 0')
  timeEnd = 3
  if timeEnd < timeStart:
    raise NameError('TEnd should be gt T0')
  timeCount = 25
  if timeCount < 10:
    raise NameError('Please set up count bit greater than 10')
  times = np.linspace(timeStart, timeEnd, timeCount)

  # P0 - coeff
  P0 = np.array([
    [2, 0, 1],
    [0, 2, 0],
    [1, 0, 2]
  ])
  # coeff for P0 ** -1
  P0_1 = np.linalg.inv(P0)
  # coeff for k0
  k0 = 0
  # coeff for a
  a = [0, 0, 0]
  # coeff for mu, should be binded with other functions
  mu = 7

  rt = R(timeStart, timeEnd, P0_1, A, C, G, N, M, times)
  xt = X(timeStart, timeEnd, A, C, G, N, M, y, w, P0_1, a, rt, times)
  kt = K(timeStart, timeEnd, A, G, N, y, w, xt, times)
  # decomprehension
  kt = [kti[0] for kti in  kt]
  rSmallT = [math.sqrt((mu ** 2) - kti) for kti in kt]
  rSmallTSquared = [rti ** 2 for rti in rSmallT]
  shapeEllipseMatrix = [convertArrayToMatrix(np.dot(rSmallTSquared[i], rt[i])) for i in range(timeCount)]
  et = [max(np.linalg.eig(shape)[0]) for shape in shapeEllipseMatrix]
  etNorm = [rSmallT[i] * math.sqrt(et[i]) for i in range(timeCount)]
  print etNorm
  # drawSolution(times, xt, shapeEllipseMatrix, [0, 1])

main()