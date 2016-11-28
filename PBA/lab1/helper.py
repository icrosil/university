"""This module provides different utilities."""

import numpy as np

def simpleProjectOfEllipseToSubspace(center, ellipseShapeMatrix, initDimension, projectionCoordinates):
   # sec_cen, sec_mat = findProjectOfEllipseToSubspace(center, ellipseShapeMatrix,initDimension, projectionCoordinates)
    allCoord = [i for i in range(0,initDimension)]
    diff = set(allCoord) - set(projectionCoordinates)
    for e in diff:
        ellipseShapeMatrix = np.delete(ellipseShapeMatrix, e, 0)
        ellipseShapeMatrix = np.delete(ellipseShapeMatrix, e, 1)
    newCenter = np.array([center[projectionCoordinates[0]], center[projectionCoordinates[1]]])

    # print(newCenter, sec_cen)
    # print('--------')
    # print(ellipseShapeMatrix)
    # print('--------')
    # print(sec_mat)
    return newCenter, ellipseShapeMatrix


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