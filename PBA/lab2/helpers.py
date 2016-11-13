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

def convertArrayToMatrix(array, rows, cols):
  """Convert array that represents matrix to matrix.

  Used to convert system of differential equations back to matrix form.
  Returns matrix of shape (rows, cols)."""
  return np.reshape(array, (rows, cols))