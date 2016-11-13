"""
authors: Illia Olenchenko, Maxim Manzuk.
"""
from scipy.integrate import odeint
import numpy as np
import math

from r import R
from p import P
from x import X

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
  ea = lambda t: 1. / (t + 1)
  # A - main matrix of diff system
  A = lambda t: [
    [0, 1, 0],
    [0, -B / J, K2 / J],
    [0, -K1 / La, -Ra / La]
  ]
  # N - one of additional predefined matrices
  N = lambda t: [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ]
  # M - one of additional predefined matrices
  M = lambda t: [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ]
  # C - second part for main diff
  C = lambda t: [ 0, 0, ea(t) / La ]
  # times
  timeStart = 0
  timeEnd = 3
  timeCount = 25
  if timeStart < 0:
    raise NameError('T0 should be gt 0')
  t = np.linspace(timeStart, timeEnd, timeCount)

  # P0 - coeff
  P0 = np.array([
    [1, 2, 3],
    [5, 1, 4],
    [6, 1, 1]
  ])
  # coeff for P0 ** -1
  P0_1 = np.linalg.inv(P0)
  # coeff for k0
  k0 = 0
  # coeff for a
  a = [0, 0, 0]
  # function y, all matricies and vectors in some time
  def y(X, G, w):
    gx = np.dot(G, X)
    return np.add(gx, w)

  solX = X(timeStart, timeEnd, A, C, G, N, M, y, w, P0_1, a, R)
  print solX

main()