#include <iostream>
#include <unistd.h>
#include <sys/types.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/ipc.h>
#include <sys/msg.h>
#include <sys/wait.h>
#include <chrono>
#include <thread>
#include <functional>
#include <sys/types.h>
#include <signal.h>

using namespace std;

typedef struct mymsgbuf {
  long mtype;
  bool value;
} mess_t;

bool f(bool input) {
  sleep(100);
  return !input;
}
bool g(bool input) {
  return input;
}

void timer_start(std::function<bool(pid_t, pid_t)> func, unsigned int interval, pid_t pid1, pid_t pid2) {
  std::thread([func, interval, pid1, pid2]() {
    bool con = true;
    while (con) {
      std::this_thread::sleep_for(std::chrono::milliseconds(interval));
      con = func(pid1, pid2);
    }
  }).detach();
}

bool to_continue(pid_t pid1, pid_t pid2) {
  int user_action;
  cout << "Processes is executing, do you want to continue? (0 - no, 1 - yes, 2 - yes and never ask.)" << endl;
  cin >> user_action;
  switch (user_action) {
    case 0:
      kill(pid1, 0);
      kill(pid2, 0);
      exit(0);
      break;
    case 1:
      break;
    case 2:
      return false;
  }
  return true;
}

int main() {
  srand(time(0));
  pid_t f_pid = -1;
  pid_t g_pid = -1;

  int f_qid;
  key_t f_msgkey;

  int g_qid;
  key_t g_msgkey;

  mess_t f_buf;
  mess_t g_buf;

  int length;

  length = sizeof(mess_t) - sizeof(long);

  f_msgkey = ftok("/f", 'm');
  g_msgkey = ftok("/g", 'm');

  f_qid = msgget(f_msgkey, IPC_CREAT | 0660);
  g_qid = msgget(g_msgkey, IPC_CREAT | 0660);

  f_pid = fork();

  if (f_pid == 0) {
    msgrcv(f_qid, &f_buf, length, 1, 0);
    return f(f_buf.value);
  } else if (f_pid > 0) {
    g_pid = fork();
    if (g_pid == 0) {
      msgrcv(g_qid, &g_buf, length, 1, 0);
      return g(g_buf.value);
    } else if (g_pid > 0) {
    }
  }

  f_buf.mtype = 1;
  g_buf.mtype = 1;
  cout << "Input bool for f --- f(true) == false (1 || 0)" << endl;
  cin >> f_buf.value;
  cout << "Input bool for g --- g(true) == true (1 || 0)" << endl;
  cin >> g_buf.value;
  msgsnd(f_qid, &f_buf, length, 0);
  msgsnd(g_qid, &g_buf, length, 0);
  int status;
  timer_start(to_continue, 10000, g_pid, f_pid);
  waitpid(-1, &status, 0);
  if (WEXITSTATUS(status)) {
    cout << "First process exit with true." << endl;
  } else {
    cout << "First process exit with false." << "Full response - True." << endl;
    return 0;
  }
  waitpid(-1, &status, 0);
  if (WEXITSTATUS(status)) {
    cout << "Second process exit with true." << endl << "Full response - True." << endl;
  } else {
    cout << "Second process exit with false." << endl << "Full response - False." << endl;
  }

  return 0;
}
