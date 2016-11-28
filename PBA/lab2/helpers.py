"""Helper functions"""

from scipy.integrate import odeint
import numpy as np
import math

def convertMatrixToArray(matrix):
  """Convert matrix to array representation.

  Used to convert matrix differential equation to system of differential equations.
  Returns array of size n*m where n - number of rows in matrix,
  m - number of columns in matrix."""
  rows, cols = np.shape(matrix)
  return np.reshape(matrix, (rows * cols))

def convertArrayToMatrix(array):
  """Convert array that represents matrix to matrix.

  Used to convert system of differential equations back to matrix form.
  Returns matrix of shape (rows, cols)."""
  l = int(math.sqrt(len(array)))
  return np.reshape(array, (l, l))

def simpleProjectOfEllipseToSubspace(center, ellipseShapeMatrix, initDimension, projectionCoordinates):
  allCoord = [i for i in range(0,initDimension)]
  diff = set(allCoord) - set(projectionCoordinates)
  for e in diff:
      ellipseShapeMatrix = np.delete(ellipseShapeMatrix, e, 0)
      ellipseShapeMatrix = np.delete(ellipseShapeMatrix, e, 1)
  newCenter = np.array([center[projectionCoordinates[0]], center[projectionCoordinates[1]]])

  return newCenter, ellipseShapeMatrix