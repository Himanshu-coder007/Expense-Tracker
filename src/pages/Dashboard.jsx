import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement } from "../redux/counterSlice";

const CounterPage = () => {
  const count = useSelector((state) => state.counter.value); // 🔹 Fetching count from Redux store
  const dispatch = useDispatch();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Counter Page</h1>
      <h2 className="text-xl mt-4">Count: {count}</h2>

      <button
        className="bg-green-500 text-white px-4 py-2 rounded mr-2"
        onClick={() => dispatch(increment())}
      >
        Increment
      </button>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded"
        onClick={() => dispatch(decrement())}
      >
        Decrement
      </button>
    </div>
  );
};

export default CounterPage;
