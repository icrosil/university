#include <iostream>
#include <stdio.h>
#include <stdlib.h>
#include <sys/mman.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>
#include <sys/shm.h>
#include <sys/ipc.h>
#include <semaphore.h>

using namespace std;

#define SHMSZ     1
int *shm, *s;

int read() {
  return *shm;
}
int write(int val) {
  *shm = val;
  return 0;
}

int main() {
  pid_t first_pid = -1;
  pid_t second_pid = -1;

  int permissions = 0644;
  sem_t *shared_sem;
  unsigned int inital_value = 1;
  shared_sem = sem_open("SharedSem", O_CREAT, permissions, inital_value);

  int shmid;
  key_t key;
  /*
   * We'll name our shared memory segment
   * "5678".
   */
  key = 5678;
  /*
   * Create the segment.
   */
  if ((shmid = shmget(key, SHMSZ, IPC_CREAT | 0666)) < 0) {
    perror("shmget");
    exit(1);
  }
  /*
   * Now we attach the segment to our data space.
   */
  if ((shm = (int *) shmat(shmid, NULL, 0)) == (int *) -1) {
    perror("shmat");
    exit(1);
  }
  /*
   * Now put some things into the memory for the
   * other process to read.
   */
  s = shm;

  *s = 0;


  first_pid = fork();
  if (first_pid == 0) {
    for (size_t i = 0; i < 1000; i++) {
      sem_wait(shared_sem);
      write(read() + 1);
      sem_post(shared_sem);
    }
    return 0;
  } else if (first_pid > 0) {
    second_pid = fork();
    if (second_pid == 0) {
      for (size_t i = 0; i < 1000; i++) {
        sem_wait(shared_sem);
        write(read() + 1);
        sem_post(shared_sem);
      }
      return 0;
    } else if (second_pid > 0) {
    }
  }
  int status;
  waitpid(first_pid, &status, 0);
  waitpid(second_pid, &status, 0);
  cout << *shm << endl;
  return 0;
}
