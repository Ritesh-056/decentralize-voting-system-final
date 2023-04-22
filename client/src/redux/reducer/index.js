import { combineReducers } from "redux";
import {
  electionDetailReducer,
  electionTitlesReducer,
  aboutElectionReducer,
  aboutAdminReducer,
  voterElectionTitleReducer,
} from "./electionDetailReducer";

const rootReducer = combineReducers({
  electionDetailReducer,
  electionTitlesReducer,
  aboutElectionReducer,
  aboutAdminReducer,
  voterElectionTitleReducer
});

export default rootReducer;
