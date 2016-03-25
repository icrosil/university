#include <iostream>
#include <thread>
#include <vector>
#include <cstdlib>
#include <mutex>

using namespace std;

struct Person {
  Person() {};
};

// Блокиратор для вывода в консоль.
mutex cout_mutex;
struct Beauty_Salon {
  // Вектор блокираторов стулья парикмахеров.
  vector<mutex> chairs_xx;
  // Вектор блокираторов стулья в комнате ожидания.
  vector<mutex> chairs_yy;
  // Вектор потоков парикмахеров (каждый парикмахер отдельный поток)
  vector<thread> hairdressers;
  // Поток народа.
  thread lot_of_people;

  Beauty_Salon(int xx, int yy) {
    // Инициализация всего.
    chairs_xx = vector<mutex>(xx);
    chairs_yy = vector<mutex>(yy);
    hairdressers = vector<thread>(xx);
    lot_of_people = thread(people, this);
    for (int i = 0; i < xx; ++i ) {
      hairdressers[i] = thread(hairdresser, i, this);
    }
    for (auto &hd : hairdressers) {
      hd.join();
    }
    lot_of_people.join();
  };
  // Функция прихода людей.
  static void people(Beauty_Salon * salon) {
    while (true) {
      // Случайный промежуток.
      this_thread::sleep_for(chrono::milliseconds(getRand(1000, 1000)));
      Person somebody = Person();
      // Есть ли место у парикмахеров.
      if (!salon -> is_stuff_available(somebody)) {
        // Есть ли место в комнате ожидания.
        if (!salon -> is_room_available(somebody)) {
          // Местов нет.
          while (true) {
            if (cout_mutex.try_lock()) {
              cout << "кімната очікування переповнена, клієнт в перукарню не зайшов;" << endl;
              cout_mutex.unlock();
              break;
            }
          }
        }
      }
    }
  };
  // Проверка свободных парикмахеров.
  bool is_stuff_available(Person person) {
    bool someone = false;
    for (size_t i = 0; i < chairs_xx.size(); i++) {
      if (chairs_xx[i].try_lock()) {
        someone = true;
        while (true) {
          if (cout_mutex.try_lock()) {
            cout << "перукар " << i << " працює над клієнтом;" << endl;
            cout_mutex.unlock();
            break;
          }
        }
        break;
      }
    }
    return someone;
  };
  // Проверка свободного места в комнате.
  bool is_room_available(Person person) {
    bool someone = false;
    for (size_t i = 0; i < chairs_yy.size(); i++) {
      if (chairs_yy[i].try_lock()) {
        someone = true;
        while (true) {
          if (cout_mutex.try_lock()) {
            cout << "клієнт в кімнаті для очікування;" << endl;
            cout_mutex.unlock();
            break;
          }
        }
        break;
      }
    }
    return someone;
  };
  static void hairdresser(int i, Beauty_Salon * salon) {
    // Каждый парикмахер всегда смотрит на свое рабочее место, а когда заканчивает смотри в комнату ожидания.
    while (true) {
      if (!salon -> chairs_xx[i].try_lock()) {
        this_thread::sleep_for(chrono::milliseconds(getRand(2000, 5000)));
        while (true) {
          if (cout_mutex.try_lock()) {
            cout << "перукар " << i << " очікує нового клієнта;" << endl;
            cout_mutex.unlock();
            break;
          }
        }
        bool chairman = false;
        for (size_t j = 0; j < salon -> chairs_yy.size(); j++) {
          if (!salon -> chairs_yy[j].try_lock()) {
            while (true) {
              if (cout_mutex.try_lock()) {
                cout << "перукар " << i << " обрав клієнта з кімнати;" << endl;
                cout_mutex.unlock();
                break;
              }
            }
            salon -> chairs_yy[j].unlock();
            chairman = true;
            break;
          } else {
            salon -> chairs_yy[j].unlock();
          }
        }
        if (!chairman) {
          salon -> chairs_xx[i].unlock();
        }
      } else {
        salon -> chairs_xx[i].unlock();
      }
    }
  };
  // Функция случайных чисел. delay - случайное число от 0 до delay. range - минимальное начало.
  // getRand(1000, 3000) даст число [3000, 4000] (от, до)
  static int getRand(int delay, int range) {
    return rand() % delay + range;
  }
};


int main() {

  int xx = 7;
  int yy = 3;

  Beauty_Salon b_s = Beauty_Salon(xx, yy);

  return 0;
}
