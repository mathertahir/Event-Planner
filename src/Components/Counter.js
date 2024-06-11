"use client";
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement } from "../lib/feature/CounterSlice";

function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <button onClick={() => dispatch(increment())} className="text-white">
        Increment
      </button>
      <span className="text-white">{count}</span>
      <button onClick={() => dispatch(decrement())} className="text-white">
        Decrement
      </button>
    </div>
  );
}

export default Counter;
