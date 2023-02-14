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

export { addElectionDetail, addNewTitle };
