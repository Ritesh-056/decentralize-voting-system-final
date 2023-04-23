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

const addNewSlogan = (slogan) =>{
  return {
    type : "ADD_ELECTION_SLOGAN",
    slogan,
  }
}

//voter election title index
const addNewVoterElectionTitle =(voterElectionTitle) => {
  return {
    type:"ADD_VOTER_ELECTION_TITLES",
    voterElectionTitle,
  }
}

const addAboutElection = (value) => {
  return {
    type: "ADD_ABOUT_ELECTION",
    value,
  };
};

const addAboutAdmin = (value) => {
  return {
    type: "ADD_ABOUT_ADMIN",
    value,
  };
};

export { addElectionDetail, addNewTitle, addAboutElection, addAboutAdmin,addNewVoterElectionTitle, addNewSlogan };
