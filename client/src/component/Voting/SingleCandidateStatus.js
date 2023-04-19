import React from "react";

const SingleCandidateStatus = (props) => {
  const candidateName = props.candidate;
  return (
    <div className="container-item info">
      <center>
        <h3>Single Candidate found.</h3>
        <p>Oops! You don't need to cast vote for single candidate.</p>
        <br></br>
        <p style={{ fontWeight: "bold", fontSize: 20 }}>
          Winner Candidate : {candidateName.header}
        </p>
      </center>
    </div>
  );
};
export default SingleCandidateStatus;
