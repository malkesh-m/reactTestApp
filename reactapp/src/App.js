import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

import { firestore } from "./firebase";

const App = () => {
  const [numbers, setNumbers] = useState({ number1: 0, number2: 0 });
  const [sum, setSum] = useState(0);
  const [docId, setDocId] = useState(null);

  useEffect(() => {
    fetchNumbers();
  }, []);

  function printSum(data) {
    setSum(data.number1 + data.number2);
  }

  function calculate() {
    const data = {
      number1: +numbers.number1,
      number2: +numbers.number2,
    };

    printSum(data);
    if (docId) {
      updateNumber(data);
    } else {
      addNumber(data);
    }
  }

  async function fetchNumbers() {
    const notesCollection = collection(firestore, "test_data");
    const snapshot = await getDocs(notesCollection);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    if (data.length < 1) return;
    const { number1, number2, id } = data[0];
    const newNumbers = { number1, number2 };
    setDocId(id);
    setNumbers(newNumbers);
    printSum(newNumbers);
  }

  async function addNumber(data) {
    await addDoc(collection(firestore, "test_data"), data);
    fetchNumbers();
  }

  async function updateNumber(data) {
    const ref = doc(firestore, "test_data", docId);
    await updateDoc(ref, data);
    fetchNumbers();
  }

  return (
    <div>
      <h1>Sum Calculator</h1>
      <input
        type="text"
        placeholder="Enter number 1"
        value={numbers.number1}
        onChange={(e) =>
          setNumbers((prev) => ({ ...prev, number1: e.target.value }))
        }
      />
      <br />
      <input
        type="text"
        placeholder="Enter number 2"
        value={numbers.number2}
        onChange={(e) =>
          setNumbers((prev) => ({ ...prev, number2: e.target.value }))
        }
      />
      <br />
      <button onClick={calculate}>Calculate Sum</button>
      <br />
      {sum && <span>Sum: {sum}</span>}
    </div>
  );
};

export default App;
