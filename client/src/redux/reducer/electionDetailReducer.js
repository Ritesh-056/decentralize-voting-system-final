const electionTitlesInit = [];

const electionDetailInit = {
  adminName: "",
  adminEmail: "",
  adminTitle: "",
  electionTitle: "",
  organizationTitle: "",
};

const electionDetailReducer = (state = electionDetailInit, action) => {
  if (action.type === "ADD_ELECTION_DETAIL") {
    console.log(action.detail);
    return action.detail;
  }
  return state;
};

const electionTitlesReducer = (state = electionTitlesInit, action) => {
  if (action.type === "ADD_ELECTION_TITLES") {
    return [...state, action.title];
  }
  return state;
};

export { electionDetailReducer, electionTitlesReducer };
