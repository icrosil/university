from __future__ import division

from defineEllipseHelp import initEllipse

from ellipseApproximation import findSolution
from funcOperationHandler import FuncOperationHandler
from plotHelper import drawSolution

def my_main():

    R1 = 2
    R2 = 3

    C1 = 3
    C2 = 5

    L = 6


    G = [
        [FuncOperationHandler(lambda t: t ** 2 + t * 5)]
    ]

    A = [
        [-1*(1/(R1*C1) + 1/(R2*C2)), 1/(R2*C2), 0],
        [-1*(1/(R1*C1) + 1/(R2*C2)), -1*(R2/L - 1/(R2*C1)), R2/L],
        [1/C2, 1/C2, 0]
    ]

    C = [
        [1/(R1*C1)],
        [1/(R1*C1)],
        [0]
    ]

    ellipse = initEllipse()
    ellipseCenter = [2, 2, 2]

    timeStart = 0
    timeEnd = 5
    timeCount = 25


    timeArray, centerOfEllipse, shapeEllipseMatrix = findSolution(A, ellipseCenter, ellipse, C, G, timeStart, timeEnd, timeCount)
    drawSolution(timeArray, centerOfEllipse, shapeEllipseMatrix, [0, 1])


my_main()