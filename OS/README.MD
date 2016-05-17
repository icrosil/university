# OS
Operating systems works.

To compile project use next command:

`gcc -o exec_name main_oi.cpp -lstdc++`

To run execute compiled file.

For C# use
Compile - `mcs -out:./build/Program ./Program.cs`
Run     - `mono Program`

Works:
1. Customer – Editor - Supplier. Make task to supply information via queue with
   xx bufs exchange (eg cyclic).
   first thread fills bufs with data
   second thread coding big letters to small
   third thread write edited lines into file.

   help - Work about hairdressers. Here works xx hairdressers (xx chairs). Also
   here is a room with yy chairs where clients waiting for personal. If there is
   no free chairs then new client does not go in.
   Main module creating hairdressers and clients with static interval.
   Provide logging.
2. Programs, which realizing f and g consider only about result execution.
   f and g could be partial (cycling forever) ask user to continue every 10 sec.
   Find f && g using 2 additional processes. Main program manage in out and &&.
   Use send messages among processes. Make variant with blocking operations in
   sending messages. g and f waiting for in from main module. f and g does not
   now nothing about other.
3. Critical segment. Model parallel work of 2 processes with shared memory, that
   belongs to third process. Third process gives 2 processes read and write this
   memory. For example let us increment memory by 1 1000 times.
   Model right and wrong behavior.

For detailed information look for `README.MD` in subfolders.
