const addElectionDetail = (detail) => {
  return {
    type: "ADD_ELECTION_DETAIL",
    detail,
  };
};

const addNewTitle = (title) => {
  return {
    type: "ADD_ELECTION_TITLES",
    title,
  };
};

const addAboutElection = (value) => {
  return {
    type: "ADD_ABOUT_ELECTION",
    value,
  };
};

export { addElectionDetail, addNewTitle, addAboutElection };
