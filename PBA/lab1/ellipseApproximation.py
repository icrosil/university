"""This module provides functionality for finding approximation of reachable set.

Considered model is x'(t) = A(t)*x(t) + C(t)u(t).
t belongs to [t0, t1]
x(t0) belongs to start set M0, which is ellipsoid
u(t) - control function, which belongs to U(t)
    which is also ellipsoid for any non-negative t
"""

import math

import numpy as np
from scipy.integrate import odeint

from funcOperationHandler import FuncOperationHandler

def findSolution(matrixA, startCenter, startEllipseShapeMatrix,  rightPart, uEllipseShapeMatrix, timeStart, timeEnd, timeCount):
    """Solve approximation problem.

    Assume n - dimension of the problem.

    Returns
    t_array - array of timestamps of length t_count
    center - array of shape (t_count, n)
    shape_matrix - array of shpe(t_count, n, n)"""
    timeArray = np.linspace(timeStart, timeEnd, timeCount)
    ellipseCenter = findCenterOfEllipse(matrixA, startCenter, timeArray)
    ellipseShapeMatrix = getEllipseMatrix(matrixA, rightPart, uEllipseShapeMatrix, startEllipseShapeMatrix, timeArray)

    return timeArray, ellipseCenter, ellipseShapeMatrix

def findCenterOfEllipse(matrix, initial_condition, t_array):
    """Returns center of approximation ellipsoid for reachable set.

    Considered equation: dx/dt = A*x + C*u

    matrix - matrix A(t) which defines system of diff equations of model
    initial_condition - initial condition for system, i. e. - center of ellipsoid,
        which describes initial set.
    t_array - discrete representation of time interval
    """
    def system(func, time):
        """Describes system of equations."""
        res = np.dot(matrix, func)
        res = [FuncOperationHandler(res[i])(time) for i in range(len(res))]
        return res
    sol = odeint(system, initial_condition, t_array)
    return sol

def getEllipseMatrix(system, rightPart, matrixU, \
                     startSetEllipse, timeArray):
    """Returns shape matrix of approximation ellipsoid for reachable set.

    Considered equation: dx/dt = A*x + C*u

    system - matrix A(t) which defines system of diff equations of model
    right_part - matrix C
    u_matrix - shape matrix for boundary ellipsoid for u
    start_set_ellipsoid - initial condition for system, i. e. - shape matrix of ellipsoid,
        which describes initial set.
    t_array - discrete representation of time interval
    """
    # calculate C*G*C^t, where C^t - transposed C
    # and G - u_matrix (i. e. shape matrix for boundary ellipsoid for u)
    cgc = np.dot(rightPart, matrixU)
    cgc = np.dot(cgc, np.transpose(rightPart))
    rows, cols = np.shape(system)
    def diff(func, time):
        """Describes system of equations.

        Returns array of values - value of of system in given time point."""
        matrixRepresentation = convertArrayToMatrix(func, rows, cols)
        a_r = np.dot(system, matrixRepresentation)
        r_a = np.dot(matrixRepresentation, np.transpose(system))

        parameter_q = findParameter_q(rows, matrixRepresentation, cgc)(time)
        parameter_q = 1 if parameter_q < 0.00001 else parameter_q
        # parameter_q = 1

        q_r = np.dot(parameter_q, matrixRepresentation)
        res = np.add(a_r, r_a)
        res = np.add(res, q_r)

        tmp = np.dot(1/parameter_q, cgc)
        res = np.add(res, tmp)
        res = convertMatrixToArray(res)
        res = [FuncOperationHandler(res[i])(time) for i in range(len(res))]
        return res
    initial_condition = convertMatrixToArray(startSetEllipse)
    sol = odeint(diff, initial_condition, timeArray)
    shape_matrix = convertSolutionToMatrixForm(sol, rows, cols, np.shape(timeArray)[0])
    return shape_matrix

def findParameter_q(dimension, matrix, cgc):
    """Returns optimal parameter function for algorithm.

    Consider equation x(t) = A(t)x(t) + C(t)u(t)
    dimension - dimension of problem
    matrix - matrix function - shape of sought ellipsoid
    cgc - product of matrices C, G, transposed C,
        where G - shape matrix of bounding ellispoid for u(t)."""
    def result(time):
        """Optimal parameter function."""
        inv = np.linalg.inv(matrix)

        # calculate cgc product in given time point
        product = [[FuncOperationHandler(cgc[i][j])(time) for j in range(dimension)] for i in range(dimension)]

        inv = np.dot(inv, product)
        res = np.trace(inv)/dimension
        return math.sqrt(res)
    return result

def convertMatrixToArray(matrix):
    """Convert matrix to array representation.

    Used to convert matrix differential equation to system of differential equations.
    Returns array of size n*m where n - number of rows in matrix,
    m - number of columns in matrix."""
    rows, cols = np.shape(matrix)
    return np.reshape(matrix, (rows*cols))

def convertArrayToMatrix(array, rows, cols):
    """Convert array that represents matrix to matrix.

    Used to convert system of differential equations back to matrix form.
    Returns matrix of shape (rows, cols)."""
    return np.reshape(array, (rows, cols))

def convertSolutionToMatrixForm(solution, rows, cols, timestamps_count):
    """Convert numerical solution of system of ODE to matrix form.

    Initially solution is represented in two dimensional form, where
    each row corresponds to certain timestamp and value is array of size
    rows*cols.
    This will be transformed into representation,
    where value for each timestamp will be matrix of shape of ellipsoid
    that corresponds to certain timestamp.
    """
    return np.reshape(solution, (timestamps_count, rows, cols))








