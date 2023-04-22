import { combineReducers } from "redux";
import {
  electionDetailReducer,
  electionTitlesReducer,
  aboutElectionReducer,
} from "./electionDetailReducer";

const rootReducer = combineReducers({
  electionDetailReducer,
  electionTitlesReducer,
  aboutElectionReducer,
});

export default rootReducer;
