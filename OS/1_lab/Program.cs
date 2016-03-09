using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Threading;

namespace __lab {
    public class Program {
        private const int xx = 5;
        public static void Main(string[] args) {
            Console.WriteLine("Hello World");
            CycleList streams = new CycleList(xx);
            Thread producerThread = new Thread(producer);
            Thread operaterThread = new Thread(operater);
            Thread cunsomerThread = new Thread(cunsomer);
            // Console.Read();
        }
        static void producer() {}
        static void operater() {}
        static void cunsomer() {}
    }
    public class CycleList : LinkedList<Stream> {
        public CycleList(int size) {
            for (int i = 0; i < size; i++) {
                this.AddFirst(new MemoryStream());
            }
        }
        public int counter = 0;
        public int nextCounter() {
            int prev = counter++;
            counter = counter > this.Count - 1 ? 0 : counter;
            return prev;
        }
        public Stream getNext() {
            return this.ElementAt(nextCounter());
        }
    }
}
