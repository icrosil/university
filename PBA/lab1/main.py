from __future__ import division

from defineEllipseHelp import initEllipse
from defineEllipseHelp import initEllipseByQuadraticEquatin

from ellipseApproximation import findSolution
from funcOperationHandler import FuncOperationHandler
from plotHelper import drawSolution

def my_main():

    R1 = 2
    R2 = 3

    C1 = 3
    C2 = 5

    L = 6



    # G = [
    #     [FuncOperationHandler(lambda t: t ** 2 + t * 5)]
    # ]
    #G = [[5]]
    # G = [
    #     [FuncOperationHandler(lambda t: t ** 3 + t ** 2 + t*2)]
    # ]
    # G = [
    #     [FuncOperationHandler(lambda t: t**0.5 + t)]
    # ]
    G = [[1,0], [0, 1/((0.5)**2)]]
    A = [
        [-1*(1/(R1*C1) + 1/(R2*C1)), 1/(R2*C1), 0],
        [-1*(1/(R1*C1) + 1/(R2*C1)), -1*(R2/L - 1/(R2*C1)), R2/L],
        [1/(C2*R2), -1/(C2*R2), 0]
    ]

    C = [
        [1/(R1*C1), 0],
        [1/(R1*C1), 0],
        [0, 0]
    ]

    ellipse, ellipseCenter = initEllipseByQuadraticEquatin()


    timeStart = 0
    timeEnd = 5
    timeCount = 25


    timeArray, centerOfEllipse, shapeEllipseMatrix = findSolution(A, ellipseCenter, ellipse, C, G, timeStart, timeEnd, timeCount)
    drawSolution(timeArray, centerOfEllipse, shapeEllipseMatrix, [0, 1])

my_main()