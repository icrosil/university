# RO
Objects recognition labs.

To compile project use next command:

`gcc -o exec_name main_oi.cpp -lstdc++`

To run execute compiled file.
By default it is running last lab.

Works:
1. Files directory consist of POK files with patients data about damaged cells.
   'D2' and 'D3' are different sickness. So first work comparing D2~D2, D2~D3,
   D3~D3, D3~D2 about each column (15) that identifies patient.
2. What if we comparing in mean way?
   D2~D3 equals to D3~D2.
3. How much is influense here in D2 and D2 ?
4. How to build ellipse around set of points?
   Is there any difference to shrink or grow rects?
5. --
6. In this work we want to consider other ways to compare vectors.
   Here we testing with standard method Delta and Interval Tree.
7. --
8. --

For program you need POK directories `./files/D2/D201.POK ... ./files/D3/D341.POK`.
