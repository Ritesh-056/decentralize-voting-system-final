const electionTitlesInit = [];

const electionDetailInit = {
  adminName: "",
  adminEmail: "",
  adminTitle: "",
  electionTitle: [],
  organizationTitle: "",
};

const aboutElectionInit = {
  organizationTitle: "",
  registrationStartTime: "",
  registrationEndTime: "",
  votingStartTime: "",
  votingEndTime: "",
};

const aboutAdminInit = {
  adminFName: "",
  adminLName: "",
  adminEmail: "",
  adminTitle: "",
};

const electionDetailReducer = (state = electionDetailInit, action) => {
  if (action.type === "ADD_ELECTION_DETAIL") {
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

const aboutElectionReducer = (state = aboutElectionInit, action) => {
  if (action.type === "ADD_ABOUT_ELECTION") {
    return action.value;
  }
  return state;
};

const aboutAdminReducer = (state = aboutAdminInit, action) => {
  if (action.type === "ADD_ABOUT_ADMIN") {
    return action.value;
  }
  return state;
};

export {
  electionDetailReducer,
  electionTitlesReducer,
  aboutElectionReducer,
  aboutAdminReducer,
};
