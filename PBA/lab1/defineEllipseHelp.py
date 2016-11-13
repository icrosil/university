from __future__ import division
import numpy as np

def initEllipse():
    #init ellipse (M0)
    N = 3


    semiAxes = [3, 1, 2]

    eigenValues = [
        [
            (0 if j != i else 1 / semiAxes[i] ** 2) for j in range(N)
            ]
        for i in range(N)
        ]

    vec1 = [1, 0, 0]
    vec2 = [0, 1, 0]
    vec3 = [0, 0, 1]

    eigenVectorsMatrix = np.transpose([vec1, vec2, vec3])
    eigenVectorsMatrixInv = np.linalg.inv(eigenVectorsMatrix)

    ellipse = np.dot(eigenVectorsMatrix, eigenValues)
    ellipse = np.dot(ellipse, eigenVectorsMatrixInv)
    return ellipse