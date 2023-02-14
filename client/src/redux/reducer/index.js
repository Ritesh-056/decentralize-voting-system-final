import { combineReducers } from "redux";
import {
  electionDetailReducer,
  electionTitlesReducer,
} from "./electionDetailReducer";

const rootReducer = combineReducers({
  electionDetailReducer,
  electionTitlesReducer,
});

export default rootReducer;
