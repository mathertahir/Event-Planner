import { combineReducers } from "redux";
import counterReducer from "./feature/CounterSlice";
import eventReducer from "./feature/EventSlice";

const rootReducer = combineReducers({
  counter: counterReducer,
  eventdetail: eventReducer,
});

export default rootReducer;
