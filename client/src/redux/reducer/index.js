import { combineReducers } from "redux";
import {
  electionDetailReducer,
  electionTitlesReducer,
  aboutElectionReducer,
  aboutAdminReducer,
} from "./electionDetailReducer";

const rootReducer = combineReducers({
  electionDetailReducer,
  electionTitlesReducer,
  aboutElectionReducer,
  aboutAdminReducer,
});

export default rootReducer;
