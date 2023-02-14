const electionTitlesInit = [];

const electionDetailInit = {
  adminName: "",
  adminEmail: "",
  adminTitle: "",
  organizationTitle: "",
};

const electionDetailReducer = (state = electionDetailInit, action) => {
  if (action.type === "ADD_ELECTION_DETAIL") {
    return action.payload;
  }
  return state;
};

const electionTitlesReducer = (state = electionTitlesInit, action) => {
  if (action.type === "ADD_ELECTION_TITLES") {
    return [...state, action.payload];
  }
  return state;
};

export { electionDetailReducer, electionTitlesReducer };
