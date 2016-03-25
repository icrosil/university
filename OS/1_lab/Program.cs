/**
 * author - Illia Olenchenko
 * group  - PM-1 (OM)
 */

using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace __lab {
    public class Program {
        // Setting number of resources.
        private const int xx = 5;
        // Some random instance for Dynamic sleep.
        private static Random rnd = new Random();
        // Simple cycled structure.
        private static CycleList streams = new CycleList(xx);
        // Create and run all 3 threads in time.
        public static void Main(string[] args) {
            Task producerTask = Task.Factory.StartNew(producer);
            Task operaterTask = Task.Factory.StartNew(operater);
            Task consumerTask = Task.Factory.StartNew(cunsomer);
            Task.WaitAll(producerTask, operaterTask, consumerTask);
        }
        static void producer() {
            string line;
            System.IO.StreamReader file = readFile();
            line = file.ReadLine();
            while (line != null) {
                Thread.Sleep(randomInt());
                lock (streams.getCurrentProducer()) {
                    if (streams.openProducer()) {
                        // Console.WriteLine("{0} Producer", streams.counterProducer);
                        streams.setCurrentProducer(line);
                        line = file.ReadLine();
                    }
                }
            }
            file.Close();
            streams.producerEnd = true;
        }
        static void operater() {
            int status = 1;
            while (!streams.producerEnd || !streams.all(status)) {
                Thread.Sleep(randomInt());
                lock (streams.getCurrentOperater()) {
                    if (streams.openOperater(streams.producerEnd)) {
                        // Console.WriteLine("{0} Operater", streams.counterOperater);
                        streams.setCurrentOperater();
                    }
                }
            }
            streams.operaterEnd = true;
        }
        static void cunsomer() {
            int status = 2;
            System.IO.StreamWriter file = writeFile();
            while (!streams.operaterEnd || !streams.all(status)) {
                // Thread.Sleep(randomInt());
                lock (streams.getCurrentCunsomer()) {
                    if (streams.openCunsomer(streams.operaterEnd)) {
                        // Console.WriteLine("{0} Cunsomer", streams.counterCunsomer);
                        string local = streams.setCurrentCunsomer();
                        file.WriteLine(local);
                    }
                }
            }
            file.Close();
            streams.cunsomerEnd = true;
        }
        // Private members.
        private static StreamReader readFile() {
            System.IO.StreamReader file = new System.IO.StreamReader("./input.txt");
            return file;
        }
        private static StreamWriter writeFile() {
            System.IO.StreamWriter file = new System.IO.StreamWriter("./output.txt");
            return file;
        }
        private static int randomInt() {
            return rnd.Next(0);
        }
    }
    public class MyString {
        public MyString(string str) {
            elem = str;
        }
        public string elem = "";
    }
    public class CycleList : LinkedList<MyString> {

        public int size;
        public bool producerEnd = false;
        public bool operaterEnd = false;
        public bool cunsomerEnd = false;
        public List<int> statuses = new List<int>();

        public CycleList(int sizeN) {
            size = sizeN;
            for (int i = 0; i < sizeN; i++) {
                this.AddFirst(new MyString(""));
                this.statuses.Add(0);
            }
        }

        public bool all(int comparator) {
            bool response = true;
            for (int i = 0; i < size; ++i) {
                if (statuses[i] == comparator) {
                    response = false;
                }
            }
            return response;
        }
        public void updateStream(int n) {
            MyString element = this.ElementAt(n);
            this.Find(element).Value.elem = "";
        }

        // producer.
        public int counterProducer = 0;
        public int nextCounterProducer() {
            int next = counterProducer + 1;
            counterProducer = next > this.Count - 1 ? 0 : next;
            return counterProducer;
        }
        public MyString getNextProducer() {
            return this.ElementAt(nextCounterProducer());
        }
        public MyString getCurrentProducer() {
            return this.ElementAt(counterProducer);
        }
        public void setCurrentProducer(string str) {
            this.Find(getCurrentProducer()).Value.elem = str;
            statuses[counterProducer] = 1;
            nextCounterProducer();
        }
        public bool openProducer() {
            if (String.IsNullOrEmpty(getCurrentProducer().elem)) {
                return true;
            }
            return false;
        }

        // operater.
        public int counterOperater = 0;
        public int nextCounterOperater() {
            int next = counterOperater + 1;
            counterOperater = next > this.Count - 1 ? 0 : next;
            return counterOperater;
        }
        public MyString getNextOperater() {
            return this.ElementAt(nextCounterOperater());
        }
        public MyString getCurrentOperater() {
            return this.ElementAt(counterOperater);
        }
        public void setCurrentOperater() {
             string local = getCurrentOperater().elem.ToLower();
             this.Find(getCurrentOperater()).Value.elem = local;
             statuses[counterOperater] = 2;
             nextCounterOperater();
        }
        public bool openOperater(bool lastCircle = false) {
            if (statuses[counterOperater] == 1) {
                return true;
            }
            if (lastCircle) {
                nextCounterOperater();
            }
            return false;
        }

        // cunsomer.
        public int counterCunsomer = 0;
        public int nextCounterCunsomer() {
            int next = counterCunsomer + 1;
            counterCunsomer = next > this.Count - 1 ? 0 : next;
            return counterCunsomer;
        }
        public MyString getNextCunsomer() {
            return this.ElementAt(nextCounterCunsomer());
        }
        public MyString getCurrentCunsomer() {
            return this.ElementAt(counterCunsomer);
        }
        public string setCurrentCunsomer() {
             string local = getCurrentCunsomer().elem;
             statuses[counterCunsomer] = 0;
             updateStream(counterCunsomer);
             nextCounterCunsomer();
             return local;
        }
        public bool openCunsomer(bool lastCircle = false) {
            if (statuses[counterCunsomer] == 2) {
                return true;
            }
            if (lastCircle) {
                nextCounterCunsomer();
            }
            return false;
        }
    }
}
