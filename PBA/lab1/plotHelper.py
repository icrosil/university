"""This module provides utilities for plotting."""

import math

import matplotlib.pyplot as plt
import numpy as np
from mpl_toolkits.mplot3d import Axes3D
import matplotlib.colors as colors

from helper import findProjectOfEllipseToSubspace

def drawSolution(timeArray, centerArray, ellipseShapeMatrixArray, coordinates):
    """Plot of result.

    t_array - array of timestamps
    center_array - array containing centers of ellispoids
        for each timestamp
    shape_matrix_array - array containing shape matrices
        of ellipsoids for each timestamp
    coordinates - array that contains two numbers - numbers of coordinates
        in which result will be plotted.
    For e. g. if coordinates=[0, 1] and dimension = 3, than projection
    onto xy plane will be computed
    """

    timeLen = len(timeArray)
    initial_dimension = np.shape(centerArray)[1]

    fig = plt.figure()
    #fig.patch.set_facecolor('black')
    axes = Axes3D(fig)
    axes.set_xlabel('X')
    axes.set_ylabel('Y')
    axes.set_zlabel('Z')
    axes.w_xaxis.set_pane_color((0, 0, 1, 0.2))
    axes.w_yaxis.set_pane_color((0, 0, 1, 0.2))
    axes.w_zaxis.set_pane_color((0, 0, 1, 0.2))
    i=0
    for t in range(timeLen):
        center, shape_matrix = findProjectOfEllipseToSubspace(centerArray[t], \
                                                              ellipseShapeMatrixArray[t], initial_dimension, coordinates)

        draw2DEllipseIn3D(axes, center, shape_matrix, timeArray[t], i)
        i+=0.03

    plt.show()

def draw2DEllipseIn3D(axes3d, center, shape, timePoint, i):
    """Plot ellipse given by center and shape matrix in some time point."""
    numberOfPoints = 25
    xArray, yArray = getEllipsePoints(center, shape, numberOfPoints)
    timeArray = [timePoint for _ in range(numberOfPoints)]
    axes3d.plot(timeArray, xArray, yArray, color=(0.75 - i, 0 + i, 0.75 - i), linewidth=3.0, linestyle='dotted')

def getEllipsePoints(center, ellipseShapeMatrix, numberOfPoints):
    """Return two one-dimensional arrays that represent points on ellipse.

    Ellipse described by center and shape matrix.
    number_of_points - number of discrete points on ellipse."""
    theta = np.linspace(0, 2 * math.pi, numberOfPoints)
    e_vals, e_vecs = np.linalg.eig(ellipseShapeMatrix)

    ax1 = 1/math.sqrt(e_vals[0])
    ax2 = 1/math.sqrt(e_vals[1])

    angle = math.acos(e_vecs[0][0])/math.sqrt(e_vecs[0][0]**2 + e_vecs[1][0]**2)

    if angle < 0:
        angle += 2*math.pi

    x_coordinates = []
    y_coordinates = []
    for t in theta:
        x_coordinates.append(
            ax1 * np.cos(t) * np.cos(angle) - ax2 * np.sin(t) * np.sin(angle) + center[0])
        y_coordinates.append(
            ax1 * np.cos(t) * np.sin(angle) + ax2 * np.sin(t) * np.cos(angle) + center[1])

    return x_coordinates, y_coordinates





