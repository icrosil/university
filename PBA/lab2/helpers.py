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

def findProjectOfEllipseToSubspace(center, ellipseShapeMatrix, initDimension, projectionCoordinates):
    """Projects n-dimesnaional ellipsoid into 2d plane.

    shape_matrix - shape matrix of ellipsoid
    initial_dimension - dimension of ellipsoid
    projection_coordinates - numbers of coordinates that will form projection subspace.
    For e. g. if projection_coordinates=[0, 1] and dimension = 3, than projection
    onto xy plane will be computed"""
    # basis of subspace, ellipsoid is being projected
    projectionCoordinates.sort()
    projectionDimension = len(projectionCoordinates)

    projectionBasis = [
        [1 if i == projectionCoordinates[j] else 0 for j in range(projectionDimension)]
        for i in range(initDimension)
    ]

    # basis of complementary space
    kernelCoordinates = list(set(range(initDimension)) - set(projectionCoordinates))
    kernelDimension = len(kernelCoordinates)

    kernelBasis = [
        [1 if i == kernelCoordinates[j] else 0 for j in range(kernelDimension)]
        for i in range(initDimension)
    ]

    newCenter = np.dot(np.transpose(projectionBasis), center)

    # find new shape matrix
    basisDotEllipseShape = np.dot(np.transpose(projectionBasis), ellipseShapeMatrix)
    kernelDotShape = np.dot(np.transpose(kernelBasis), ellipseShapeMatrix)
    e11 = np.dot(basisDotEllipseShape, projectionBasis)
    # Yt * E * Z = (Zt * E * Y)t for symmetric E
    e12 = np.dot(basisDotEllipseShape, kernelBasis)
    e22 = np.dot(kernelDotShape, kernelBasis)
    e22 = np.linalg.inv(e22)
    temp = np.dot(e12, e22)
    temp = np.dot(temp, np.transpose(e12))

    newEllipseShapeMatrix = np.subtract(e11, temp)

    return newCenter, newEllipseShapeMatrix