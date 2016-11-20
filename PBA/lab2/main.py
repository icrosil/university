"""
authors: Illia Olenchenko, Maxim Manzuk.
"""
from __future__ import division
from scipy.integrate import odeint, quad
import numpy as np
import math
from plotHelper import drawSolution
from helpers import convertArrayToMatrix, convertMatrixToArray
from prettytable import PrettyTable

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
  # Dimensions
  # n = 3, m = 1, r = 2
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
  # G - matrix with y, r * n
  G = lambda t: [
    [1, 0, 1],
    [0, 1, 1],
  ]
  # ea - external power
  ea = lambda t: 0
  # w - vector with y, vector of r
  w = lambda t: [math.sin(t), math.cos(t)]
  # v - vector with x, vector of m
  v = lambda t: [ea(t)]
  # A - main matrix of diff system, n * n
  A = lambda t: [
    [0, 1, 0],
    [0, -B / J, K2 / J],
    [0, -K1 / La, -Ra / La]
  ]
  # N - one of additional predefined matrices, r * r, diag or correlation matrix, +determined, sym
  N = lambda t: [
    [2. / (t + 0.1), 0],
    [0, 0.2 / ((t + 0.1) ** 2)]
  ]
  # M - one of additional predefined matrices, m * m, diag or correlation matrix, +determined, sym
  M = lambda t: [
    [2 / (t + 1)],
  ]
  # C - second part for main diff, n * m
  C = lambda t: [
    [0],
    [0],
    [1 / La]
  ]
  # times
  timeStart = 0
  if timeStart < 0:
    raise NameError('T0 should be gt 0')
  timeEnd = 10
  if timeEnd < timeStart:
    raise NameError('TEnd should be gt T0')
  timeCount = 40
  if timeCount < 10:
    raise NameError('Please set up count bit greater than 10')
  times = np.linspace(timeStart, timeEnd, timeCount)

  # P0 - coeff, n * n, diag or correlation matrix, +determined, sym
  P0 = np.array([
    [4, 0.05, 0.01],
    [0.05, 9, 0.1],
    [0.01, 0.1, 1]
  ])
  # coeff for P0 ** -1, n * n, -//-
  P0_1 = np.linalg.inv(P0)
  # coeff for k0, always 0
  k0 = 0
  # coeff for a, always 0 vector of n
  a = [0, 0, 0]
  # coeff for x0, same as a vector of n
  x0 = a
  # coeff for mu, should be binded with other functions
  mu = 45
  # checking mu
  def muIntegral(t):
    nt = N(t)
    mt = M(t)
    wt = w(t)
    vt = v(t)
    nw = np.dot(nt, wt)
    nww = np.dot(nw, wt)
    mv = np.dot(mt, vt)
    mvv = np.dot(mv, vt)
    return nww + mvv
  nwwmvv = quad(muIntegral, timeStart, timeEnd)[0]
  xa = np.subtract(x0, a)
  pxaxa = np.dot(np.dot(P0, xa), xa)
  nwwmvvpxaxa = nwwmvv + pxaxa
  if (nwwmvvpxaxa > mu ** 2):
    raise NameError('MU conditions are not correct, set up mu to greater than', math.sqrt(nwwmvvpxaxa))

  rt = R(timeStart, timeEnd, P0_1, A, C, G, N, M, times)
  # xt - array size timeCount of n vector
  # yt - array size timeCount of r vector
  xt = X(timeStart, timeEnd, A, C, G, N, M, y, w, v, P0_1, a, rt, times)
  kt = K(timeStart, timeEnd, G, N, y, w, xt, times)
  # decomprehension
  kt = [kti[0] for kti in  kt]
  rSmallT = [math.sqrt((mu ** 2) - kti) for kti in kt]
  rSmallTSquared = [rti ** 2 for rti in rSmallT]
  shapeEllipseMatrix = [convertArrayToMatrix(np.dot(rSmallTSquared[i], rt[i])) for i in range(timeCount)]
  et = [max(np.linalg.eig(shape)[0]) for shape in shapeEllipseMatrix]
  etNorm = [rSmallT[i] * math.sqrt(et[i]) for i in range(timeCount)]
  t = PrettyTable(['time', 'etNorm'])
  for i in range(timeCount):
    t.add_row([times[i], etNorm[i]])
  print t
  drawSolution(times, xt, shapeEllipseMatrix, [0, 1], etNorm)

main()