import { combineReducers } from "redux";
import {
  electionDetailReducer,
  electionTitlesReducer,
  aboutElectionReducer,
  aboutAdminReducer,
  voterElectionTitleReducer,
  candidateElectionSloganReducer
} from "./electionDetailReducer";

const rootReducer = combineReducers({
  electionDetailReducer,
  electionTitlesReducer,
  aboutElectionReducer,
  aboutAdminReducer,
  voterElectionTitleReducer,
  candidateElectionSloganReducer
});

export default rootReducer;
